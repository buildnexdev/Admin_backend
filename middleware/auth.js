const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getEffectivePermissions } = require('../services/permissionService');

/**
 * Resolve JWT secret from env. Fails hard in production if missing.
 */
exports.getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET environment variable is required in production');
        }
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
};

exports.isSuperAdmin = (req) => {
    return String(req.auth?.role || '').toLowerCase() === 'super_admin';
};

/** Company scope for queries: null for super_admin (unscoped), else auth companyID */
exports.getAuthCompanyID = (req) => {
    if (exports.isSuperAdmin(req)) return null;
    return req.auth?.companyID ?? null;
};

/**
 * Build a tenant-scoped where clause.
 * No auth: return extra only (public/optionalAuth paths).
 * Super admin: returns extra as-is, or merges companyID if provided via query/body for filtering.
 * Others: always forces companyID from auth.
 */
exports.tenantWhere = (req, extra = {}) => {
    if (!req.auth) {
        return { ...extra };
    }
    if (exports.isSuperAdmin(req)) {
        const requested =
            req.query?.companyID ??
            req.query?.companyId ??
            req.body?.companyID ??
            req.body?.companyId ??
            req.params?.companyID ??
            req.params?.companyId;
        if (requested != null && requested !== '') {
            return { ...extra, companyID: requested };
        }
        return { ...extra };
    }
    return { ...extra, companyID: req.auth.companyID };
};

/** Force body companyID from auth unless super_admin */
exports.forceBodyCompany = (req) => {
    if (!exports.isSuperAdmin(req) && req.auth?.companyID != null) {
        req.body = req.body || {};
        req.body.companyID = req.auth.companyID;
    }
    return req.body?.companyID;
};

/**
 * Require one or more permission codes (from req.auth.permissions).
 * Super admin always passes. Permissions are loaded/cached on authenticate.
 */
exports.requirePermission = (...codes) => (req, res, next) => {
    if (!req.auth) {
        return res.status(401).json({ success: false, status: false, message: 'Authentication required' });
    }

    const role = String(req.auth.role || '').toLowerCase();
    if (role === 'super_admin') return next();

    const perms = Array.isArray(req.auth.permissions) ? req.auth.permissions : [];
    if (perms.includes('*') || codes.some((c) => perms.includes(c))) {
        return next();
    }

    return res.status(403).json({
        success: false,
        status: false,
        message: 'Forbidden: insufficient permission',
    });
};

/**
 * Require valid JWT. Attaches req.auth = { userId, user, companyID, role }
 * Company context ALWAYS comes from authenticated user — never trust body.companyID alone.
 */
exports.authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : (req.headers['x-access-token'] || null);

        if (!token) {
            return res.status(401).json({
                success: false,
                status: false,
                message: 'Authentication required',
            });
        }

        let payload;
        try {
            payload = jwt.verify(token, exports.getJwtSecret());
        } catch (err) {
            if (err.message && err.message.includes('JWT_SECRET')) {
                console.error(err.message);
                return res.status(500).json({
                    success: false,
                    status: false,
                    message: 'Server misconfiguration: JWT_SECRET missing',
                });
            }
            return res.status(401).json({
                success: false,
                status: false,
                message: 'Session expired. Please login again.',
            });
        }

        const userId = payload.id || payload.userId;
        const user = await User.findByPk(userId);
        if (!user || Number(user.isActive) === 0) {
            return res.status(401).json({
                success: false,
                status: false,
                message: 'Account inactive or not found',
            });
        }

        const plain = user.get({ plain: true });
        delete plain.password;

        let permissions = [];
        try {
            permissions = await getEffectivePermissions(plain.userId, plain.companyID, plain.role);
        } catch (permErr) {
            console.warn('authenticate permissions:', permErr.message);
        }

        req.auth = {
            userId: plain.userId,
            companyID: plain.companyID,
            role: plain.role,
            permissions,
            user: plain,
        };
        next();
    } catch (err) {
        console.error('authenticate error:', err.message);
        return res.status(500).json({
            success: false,
            status: false,
            message: 'Authentication failed',
        });
    }
};

/** Optional auth — attaches req.auth if token present */
exports.optionalAuth = async (req, res, next) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ') && !req.headers['x-access-token']) {
        return next();
    }
    return exports.authenticate(req, res, next);
};

/**
 * Require one of the given roles (legacy string role on user table).
 * requireRoles('super_admin') → only super_admin
 * requireRoles('admin') → admin, company_admin, AND super_admin
 * requireRoles('company_admin') → admin, company_admin (not super_admin via this alias alone)
 */
exports.requireRoles = (...roles) => (req, res, next) => {
    if (!req.auth) {
        return res.status(401).json({ success: false, status: false, message: 'Authentication required' });
    }
    const role = String(req.auth.role || '').toLowerCase();
    const normalized = roles.map((r) => String(r).toLowerCase());
    const aliases = {
        admin: ['admin', 'company_admin', 'super_admin'],
        super_admin: ['super_admin'],
        company_admin: ['admin', 'company_admin'],
        manager: ['manager', 'admin', 'company_admin', 'super_admin'],
        staff: ['staff', 'user', 'manager', 'admin', 'company_admin', 'super_admin'],
    };

    const allowed = normalized.some((wanted) => {
        if (role === wanted) return true;
        const group = aliases[wanted] || [wanted];
        return group.includes(role);
    });

    if (!allowed) {
        return res.status(403).json({
            success: false,
            status: false,
            message: 'Forbidden: insufficient role',
        });
    }
    next();
};

/**
 * Ensure requested company matches authenticated user's company
 * unless SUPER_ADMIN / role includes platform access.
 * Reads company from params/query/body but validates against session.
 * Always sets req.companyID to scoped/validated value.
 */
exports.requireCompanyAccess = (req, res, next) => {
    if (!req.auth) {
        return res.status(401).json({ success: false, status: false, message: 'Authentication required' });
    }

    const role = String(req.auth.role || '').toLowerCase();
    if (role === 'super_admin') {
        const requested =
            req.params.companyID ||
            req.params.companyId ||
            req.query.companyID ||
            req.query.companyId ||
            req.body?.companyID ||
            req.body?.companyId;
        req.companyID = requested != null && requested !== ''
            ? requested
            : exports.getAuthCompanyID(req);
        return next();
    }

    const requested =
        req.params.companyID ||
        req.params.companyId ||
        req.query.companyID ||
        req.query.companyId ||
        req.body?.companyID ||
        req.body?.companyId;

    if (requested == null || requested === '') {
        req.companyID = exports.getAuthCompanyID(req) ?? req.auth.companyID;
        return next();
    }

    if (String(requested) !== String(req.auth.companyID)) {
        return res.status(403).json({
            success: false,
            status: false,
            message: 'Forbidden: company data isolation',
        });
    }

    req.companyID = req.auth.companyID;
    next();
};
