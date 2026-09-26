const {
    isSuperAdmin,
    getAuthCompanyID,
    tenantWhere,
    forceBodyCompany,
} = require('../middleware/auth');

exports.isSuperAdmin = isSuperAdmin;
exports.getAuthCompanyID = getAuthCompanyID;
exports.tenantWhere = tenantWhere;
exports.forceBodyCompany = forceBodyCompany;

/** Resolve companyID for create: auth company unless super_admin or unauthenticated public form */
exports.resolveCreateCompanyID = (req, bodyCompanyID) => {
    if (!req.auth || isSuperAdmin(req)) {
        return bodyCompanyID != null && bodyCompanyID !== '' ? bodyCompanyID : null;
    }
    return req.auth.companyID ?? null;
};

/** Where clause for findByPk-style updates/deletes by id + tenant */
exports.scopedById = (req, id, idField = 'id') => {
    return tenantWhere(req, { [idField]: id });
};
