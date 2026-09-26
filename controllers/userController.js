const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getEffectivePermissions, logAudit } = require('../services/permissionService');
require('dotenv').config();

const looksLikeBcrypt = (value) => typeof value === 'string' && /^\$2[aby]\$/.test(value);

async function verifyPassword(plain, stored) {
    if (!stored) return false;
    if (looksLikeBcrypt(stored)) {
        return bcrypt.compare(plain, stored);
    }
    // Legacy plaintext support during migration
    return plain === stored;
}

async function upgradePasswordIfNeeded(user, plain) {
    try {
        if (!looksLikeBcrypt(user.password)) {
            const hash = await bcrypt.hash(plain, 10);
            await user.update({ password: hash });
        }
    } catch (e) {
        console.warn('[LOGIN] password upgrade skipped:', e.message);
    }
}

exports.login = async (req, res) => {
    try {
        const { phone, password, email, username } = req.body;
        const identifier = phone || email || username;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                status: false,
                message: 'Phone/email and password are required',
            });
        }

        const user = await User.findOne({
            where: { phoneNumber: identifier },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                status: false,
                message: 'Invalid credentials',
            });
        }

        if (Number(user.isActive) === 0) {
            return res.status(403).json({
                success: false,
                status: false,
                message: 'Account is inactive',
            });
        }

        const ok = await verifyPassword(password, user.password);
        if (!ok) {
            return res.status(401).json({
                success: false,
                status: false,
                message: 'Invalid credentials',
            });
        }

        await upgradePasswordIfNeeded(user, password);

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET environment variable is not set');
            return res.status(500).json({
                success: false,
                status: false,
                message: 'Server misconfiguration: JWT_SECRET missing',
            });
        }

        const token = jwt.sign(
            {
                id: user.userId,
                companyID: user.companyID,
                role: user.role,
            },
            jwtSecret,
            { expiresIn: '7d' }
        );

        const plain = user.get({ plain: true });
        delete plain.password;

        const Company = require('../models/company');
        const company = await Company.findByPk(plain.companyID);

        // Normalize role for frontend RBAC
        const roleMap = {
            admin: 'COMPANY_ADMIN',
            super_admin: 'SUPER_ADMIN',
            manager: 'MANAGER',
            staff: 'STAFF',
            user: 'USER',
        };
        const roleCode = roleMap[String(plain.role || '').toLowerCase()] || String(plain.role || 'USER').toUpperCase();

        let permissions = [];
        try {
            permissions = await getEffectivePermissions(plain.userId, plain.companyID, plain.role);
        } catch (permErr) {
            console.warn('[LOGIN] permissions lookup skipped:', permErr.message);
        }

        try {
            await logAudit({
                userId: plain.userId,
                companyId: plain.companyID,
                action: 'LOGIN',
                module: 'AUTH',
                recordId: plain.userId,
                description: `User ${plain.name || plain.phoneNumber} logged in`,
                ip: req.ip,
            });
        } catch (auditErr) {
            console.warn('[LOGIN] audit log skipped:', auditErr.message);
        }

        return res.status(200).json({
            success: true,
            status: true,
            message: 'Login successful',
            token,
            permissions,
            data: {
                userId: plain.userId,
                name: plain.name,
                phoneNumber: plain.phoneNumber,
                companyID: plain.companyID,
                companyName: company ? company.name : 'Corporate Office',
                location: plain.location,
                isActive: plain.isActive,
                createdOn: plain.createdOn,
                updatedOn: plain.updatedOn,
                role: plain.role,
                roleCode,
                category: plain.category,
                permissions,
            },
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(500).json({
            success: false,
            status: false,
            message: 'Failed to login',
            error: error.message,
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const Company = require('../models/company');
        const company = await Company.findByPk(req.auth.companyID);
        const permissions = Array.isArray(req.auth.permissions)
            ? req.auth.permissions
            : await getEffectivePermissions(req.auth.userId, req.auth.companyID, req.auth.role);
        return res.status(200).json({
            success: true,
            status: true,
            permissions,
            data: {
                ...req.auth.user,
                companyName: company ? company.name : null,
                companyID: req.auth.companyID,
                role: req.auth.role,
                permissions,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: false, message: error.message });
    }
};

exports.getStaff = async (req, res) => {
    try {
        const where = {};
        // Company isolation
        if (req.auth && String(req.auth.role).toLowerCase() !== 'super_admin') {
            where.companyID = req.auth.companyID;
        }

        const users = await User.findAll({
            where,
            attributes: ['userId', 'name', 'role', 'phoneNumber', 'companyID', 'isActive', 'location', 'category'],
        });
        return res.status(200).json({ success: true, status: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, status: false, message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword || String(newPassword).length < 8) {
            return res.status(422).json({
                success: false,
                status: false,
                message: 'New password must be at least 8 characters',
            });
        }

        const user = await User.findByPk(req.auth.userId);
        const ok = await verifyPassword(currentPassword, user.password);
        if (!ok) {
            return res.status(401).json({ success: false, status: false, message: 'Current password is incorrect' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hash });
        return res.status(200).json({ success: true, status: true, message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, status: false, message: error.message });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const { name, phoneNumber, password, role, location, category, isActive } = req.body;
        if (!name || !phoneNumber || !password) {
            return res.status(400).json({
                success: false,
                status: false,
                message: 'name, phoneNumber, and password are required',
            });
        }

        const companyID =
            String(req.auth.role || '').toLowerCase() === 'super_admin' && req.body.companyID != null
                ? req.body.companyID
                : req.auth.companyID;

        const existing = await User.findOne({ where: { phoneNumber } });
        if (existing) {
            return res.status(409).json({
                success: false,
                status: false,
                message: 'Phone number already registered',
            });
        }

        const allowedRoles = ['staff', 'user', 'manager', 'admin'];
        const staffRole = String(role || 'staff').toLowerCase();
        if (!allowedRoles.includes(staffRole)) {
            return res.status(400).json({
                success: false,
                status: false,
                message: 'Invalid role for staff user',
            });
        }

        const hash = await bcrypt.hash(String(password), 10);
        const now = new Date();
        const user = await User.create({
            name,
            phoneNumber,
            password: hash,
            companyID,
            location: location || '',
            isActive: isActive != null ? Number(isActive) : 1,
            role: staffRole,
            category: category || null,
            createdOn: now,
            updatedOn: now,
        });

        const plain = user.get({ plain: true });
        delete plain.password;
        return res.status(201).json({ success: true, status: true, message: 'Staff created', data: plain });
    } catch (error) {
        return res.status(500).json({ success: false, status: false, message: error.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, status: false, message: 'User not found' });
        }

        const isSuper = String(req.auth.role || '').toLowerCase() === 'super_admin';
        if (!isSuper && String(user.companyID) !== String(req.auth.companyID)) {
            return res.status(403).json({
                success: false,
                status: false,
                message: 'Forbidden: company data isolation',
            });
        }

        const updates = { updatedOn: new Date() };
        if (req.body.name != null) updates.name = req.body.name;
        if (req.body.role != null) {
            const staffRole = String(req.body.role).toLowerCase();
            const allowedRoles = ['staff', 'user', 'manager', 'admin'];
            if (!allowedRoles.includes(staffRole)) {
                return res.status(400).json({
                    success: false,
                    status: false,
                    message: 'Invalid role for staff user',
                });
            }
            updates.role = staffRole;
        }
        if (req.body.isActive != null) updates.isActive = Number(req.body.isActive);
        if (req.body.location != null) updates.location = req.body.location;
        if (req.body.category != null) updates.category = req.body.category;
        if (req.body.password) {
            updates.password = await bcrypt.hash(String(req.body.password), 10);
        }

        await user.update(updates);
        const plain = user.get({ plain: true });
        delete plain.password;
        return res.status(200).json({ success: true, status: true, message: 'Staff updated', data: plain });
    } catch (error) {
        return res.status(500).json({ success: false, status: false, message: error.message });
    }
};
