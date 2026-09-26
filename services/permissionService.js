const { Op } = require('sequelize');
const TblRole = require('../models/tblRole');
const TblPermission = require('../models/tblPermission');
const TblRolePermission = require('../models/tblRolePermission');
const TblUserRole = require('../models/tblUserRole');
const TblAuditLog = require('../models/tblAuditLog');

const LEGACY_ROLE_MAP = {
    super_admin: 'SUPER_ADMIN',
    admin: 'COMPANY_ADMIN',
    company_admin: 'COMPANY_ADMIN',
    manager: 'MANAGER',
    staff: 'STAFF',
    user: 'STAFF',
};

function mapLegacyRoleToCode(roleString) {
    if (!roleString) return null;
    const raw = String(roleString).trim();
    const lower = raw.toLowerCase();
    if (LEGACY_ROLE_MAP[lower]) return LEGACY_ROLE_MAP[lower];
    return raw.toUpperCase();
}

async function permissionsForRoleIds(roleIds) {
    if (!roleIds.length) return [];
    const links = await TblRolePermission.findAll({
        where: { RoleId: { [Op.in]: roleIds } },
        attributes: ['PermissionId'],
    });
    const permIds = [...new Set(links.map((l) => l.PermissionId))];
    if (!permIds.length) return [];
    const perms = await TblPermission.findAll({
        where: { PermissionId: { [Op.in]: permIds } },
        attributes: ['Code'],
    });
    return [...new Set(perms.map((p) => p.Code))];
}

/**
 * Resolve effective permission codes for a user.
 * - super_admin → ['*']
 * - else load tblUserRole for user+company and join permissions
 * - if no user_role rows, map legacy role string → tblRole.Code and load that role
 */
async function getEffectivePermissions(userId, companyID, roleString) {
    try {
        const roleLower = String(roleString || '').toLowerCase();
        if (roleLower === 'super_admin') {
            return ['*'];
        }

        const uid = Number(userId);
        const cid = companyID != null && companyID !== '' ? Number(companyID) : null;

        if (uid && cid != null && !Number.isNaN(cid)) {
            const userRoles = await TblUserRole.findAll({
                where: { UserId: uid, CompanyId: cid },
                attributes: ['RoleId'],
            });
            if (userRoles.length) {
                return permissionsForRoleIds(userRoles.map((ur) => ur.RoleId));
            }
        }

        const code = mapLegacyRoleToCode(roleString);
        if (!code) return [];

        const role = await TblRole.findOne({ where: { Code: code }, attributes: ['RoleId'] });
        if (!role) return [];

        return permissionsForRoleIds([role.RoleId]);
    } catch (err) {
        // Tables may not exist yet — never break login/auth
        console.warn('[permissionService] getEffectivePermissions:', err.message);
        return [];
    }
}

async function logAudit({ userId, companyId, action, module, recordId, description, ip }) {
    try {
        await TblAuditLog.create({
            UserId: userId != null ? Number(userId) : null,
            CompanyId: companyId != null ? Number(companyId) : null,
            Action: action || 'UNKNOWN',
            Module: module || null,
            RecordId: recordId != null ? String(recordId) : null,
            Description: description || null,
            IpAddress: ip || null,
            CreatedDate: new Date(),
        });
    } catch (err) {
        console.warn('[permissionService] logAudit:', err.message);
    }
}

module.exports = {
    getEffectivePermissions,
    logAudit,
    mapLegacyRoleToCode,
    LEGACY_ROLE_MAP,
};
