const { Op } = require('sequelize');
const db = require('../config/db.config');
const TblRole = require('../models/tblRole');
const TblPermission = require('../models/tblPermission');
const TblRolePermission = require('../models/tblRolePermission');
const TblUserRole = require('../models/tblUserRole');
const User = require('../models/user');
const { getEffectivePermissions, logAudit } = require('../services/permissionService');
const { ok, fail, safeError } = require('../utils/response');

exports.listPermissions = async (req, res) => {
    try {
        const permissions = await TblPermission.findAll({ order: [['Module', 'ASC'], ['Code', 'ASC']] });
        return ok(res, 'Permissions listed', permissions);
    } catch (err) {
        return safeError(res, err, 'Failed to list permissions');
    }
};

exports.listRoles = async (req, res) => {
    try {
        const roles = await TblRole.findAll({ order: [['RoleId', 'ASC']] });
        const links = await TblRolePermission.findAll();
        const byRole = {};
        for (const link of links) {
            if (!byRole[link.RoleId]) byRole[link.RoleId] = [];
            byRole[link.RoleId].push(link.PermissionId);
        }
        const data = roles.map((r) => {
            const plain = r.get({ plain: true });
            return { ...plain, permissionIds: byRole[plain.RoleId] || [] };
        });
        return ok(res, 'Roles listed', data);
    } catch (err) {
        return safeError(res, err, 'Failed to list roles');
    }
};

exports.createRole = async (req, res) => {
    try {
        const { Code, Name, Description, permissionIds } = req.body;
        if (!Code || !Name) {
            return fail(res, 400, 'Code and Name are required');
        }
        const existing = await TblRole.findOne({ where: { Code: String(Code).toUpperCase() } });
        if (existing) {
            return fail(res, 409, 'Role code already exists');
        }

        const role = await TblRole.create({
            Code: String(Code).toUpperCase(),
            Name,
            Description: Description || null,
            IsSystem: 0,
            CreatedDate: new Date(),
            UpdatedDate: new Date(),
        });

        const ids = Array.isArray(permissionIds) ? permissionIds.map(Number).filter(Boolean) : [];
        if (ids.length) {
            await TblRolePermission.bulkCreate(
                ids.map((PermissionId) => ({ RoleId: role.RoleId, PermissionId })),
                { ignoreDuplicates: true }
            );
        }

        await logAudit({
            userId: req.auth.userId,
            companyId: req.auth.companyID,
            action: 'CREATE',
            module: 'RBAC',
            recordId: role.RoleId,
            description: `Created role ${role.Code}`,
            ip: req.ip,
        });

        return ok(res, 'Role created', { ...role.get({ plain: true }), permissionIds: ids }, 201);
    } catch (err) {
        return safeError(res, err, 'Failed to create role');
    }
};

exports.updateRole = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const roleId = Number(req.params.id);
        const role = await TblRole.findByPk(roleId, { transaction });
        if (!role) {
            await transaction.rollback();
            return fail(res, 404, 'Role not found');
        }

        const { Name, Description, permissionIds } = req.body;
        const updates = { UpdatedDate: new Date() };
        if (Name != null) updates.Name = Name;
        if (Description !== undefined) updates.Description = Description;
        await role.update(updates, { transaction });

        if (Array.isArray(permissionIds)) {
            await TblRolePermission.destroy({ where: { RoleId: roleId }, transaction });
            const ids = permissionIds.map(Number).filter(Boolean);
            if (ids.length) {
                await TblRolePermission.bulkCreate(
                    ids.map((PermissionId) => ({ RoleId: roleId, PermissionId })),
                    { transaction, ignoreDuplicates: true }
                );
            }
        }

        await transaction.commit();

        const links = await TblRolePermission.findAll({ where: { RoleId: roleId } });
        await logAudit({
            userId: req.auth.userId,
            companyId: req.auth.companyID,
            action: 'UPDATE',
            module: 'RBAC',
            recordId: roleId,
            description: `Updated role ${role.Code}`,
            ip: req.ip,
        });

        return ok(res, 'Role updated', {
            ...role.get({ plain: true }),
            permissionIds: links.map((l) => l.PermissionId),
        });
    } catch (err) {
        await transaction.rollback();
        return safeError(res, err, 'Failed to update role');
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const roleId = Number(req.params.id);
        const role = await TblRole.findByPk(roleId);
        if (!role) return fail(res, 404, 'Role not found');
        if (Number(role.IsSystem) === 1) {
            return fail(res, 403, 'Cannot delete system role');
        }

        await TblRolePermission.destroy({ where: { RoleId: roleId } });
        await TblUserRole.destroy({ where: { RoleId: roleId } });
        await role.destroy();

        await logAudit({
            userId: req.auth.userId,
            companyId: req.auth.companyID,
            action: 'DELETE',
            module: 'RBAC',
            recordId: roleId,
            description: `Deleted role ${role.Code}`,
            ip: req.ip,
        });

        return ok(res, 'Role deleted', null);
    } catch (err) {
        return safeError(res, err, 'Failed to delete role');
    }
};

exports.getUserPermissions = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const user = await User.findByPk(userId);
        if (!user) return fail(res, 404, 'User not found');

        const companyId =
            req.query.companyId ??
            req.query.companyID ??
            user.companyID;

        const permissions = await getEffectivePermissions(userId, companyId, user.role);
        return ok(res, 'Effective permissions', { userId, companyId, permissions });
    } catch (err) {
        return safeError(res, err, 'Failed to get user permissions');
    }
};

exports.assignUserRoles = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const userId = Number(req.params.userId);
        const user = await User.findByPk(userId);
        if (!user) {
            await transaction.rollback();
            return fail(res, 404, 'User not found');
        }

        const roleIds = Array.isArray(req.body.roleIds)
            ? req.body.roleIds.map(Number).filter(Boolean)
            : [];
        let companyId = req.body.companyId ?? req.body.companyID ?? user.companyID;

        const authRole = String(req.auth.role || '').toLowerCase();
        if (authRole !== 'super_admin') {
            companyId = req.auth.companyID;
            if (String(user.companyID) !== String(req.auth.companyID)) {
                await transaction.rollback();
                return fail(res, 403, 'Forbidden: company data isolation');
            }
        }

        await TblUserRole.destroy({
            where: { UserId: userId, CompanyId: companyId },
            transaction,
        });

        if (roleIds.length) {
            const roles = await TblRole.findAll({
                where: { RoleId: { [Op.in]: roleIds } },
                transaction,
            });
            if (roles.length !== roleIds.length) {
                await transaction.rollback();
                return fail(res, 400, 'One or more roleIds are invalid');
            }
            await TblUserRole.bulkCreate(
                roleIds.map((RoleId) => ({
                    UserId: userId,
                    RoleId,
                    CompanyId: Number(companyId),
                })),
                { transaction, ignoreDuplicates: true }
            );
        }

        await transaction.commit();

        await logAudit({
            userId: req.auth.userId,
            companyId,
            action: 'ASSIGN_ROLES',
            module: 'RBAC',
            recordId: userId,
            description: `Assigned roles [${roleIds.join(',')}] to user ${userId}`,
            ip: req.ip,
        });

        const permissions = await getEffectivePermissions(userId, companyId, user.role);
        return ok(res, 'User roles assigned', { userId, companyId, roleIds, permissions });
    } catch (err) {
        await transaction.rollback();
        return safeError(res, err, 'Failed to assign user roles');
    }
};

exports.getMatrix = async (req, res) => {
    try {
        const roles = await TblRole.findAll({ order: [['RoleId', 'ASC']] });
        const permissions = await TblPermission.findAll({ order: [['Module', 'ASC'], ['Code', 'ASC']] });
        const links = await TblRolePermission.findAll();

        const linkSet = new Set(links.map((l) => `${l.RoleId}:${l.PermissionId}`));
        const matrix = roles.map((role) => {
            const plain = role.get({ plain: true });
            const cells = {};
            for (const p of permissions) {
                cells[p.PermissionId] = linkSet.has(`${plain.RoleId}:${p.PermissionId}`);
            }
            return { ...plain, permissions: cells };
        });

        return ok(res, 'RBAC matrix', { roles: matrix, permissions });
    } catch (err) {
        return safeError(res, err, 'Failed to load RBAC matrix');
    }
};
