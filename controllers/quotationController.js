const Quotation = require('../models/quotation');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /quotation - Create a new quotation
 * Body: category, client_name, companyID, userId, price, project_details
 */
exports.createQuotation = async (req, res) => {
    try {
        const body = req.body || {};
        const category = body.category;
        const client_name = body.client_name;
        const companyID = body.companyID;
        const userId = body.userId;
        const price = body.price !== undefined && body.price !== '' ? parseFloat(body.price) : null;
        const project_details = body.project_details;

        if (!companyID) {
            return res.status(400).json({ success: false, message: 'companyID is required' });
        }

        const quotation = await Quotation.create({
            category: category || null,
            client_name: client_name || null,
            companyID: parseInt(companyID, 10),
            userId: userId !== undefined && userId !== '' ? parseInt(userId, 10) : null,
            price,
            project_details: project_details || null,
            token: uuidv4()
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const viewLink = `${baseUrl}/quotation/${quotation.token}/view`;

        res.status(201).json({
            success: true,
            message: 'Quotation created successfully',
            data: quotation,
            viewLink
        });
    } catch (error) {
        console.error('createQuotation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /quotation/view/:id - Client clicks this link (share via WhatsApp etc.)
 * Increments link_click_count and returns the quotation
 */
exports.viewQuotation = async (req, res) => {
    try {
        const token = req.params.id;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Invalid quotation token' });
        }

        const quotation = await Quotation.findOne({ where: { token } });
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }

        await quotation.increment('link_click_count');

        const updated = await Quotation.findOne({ where: { token } });
        res.json({
            success: true,
            data: updated,
            message: 'View recorded'
        });
    } catch (error) {
        console.error('viewQuotation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /quotation?companyID=1&userId=1&category=Builders - List quotations with optional filters
 */
exports.getQuotationsByQuery = async (req, res) => {
    try {
        const { companyID, userId, category } = req.query;
        const where = {};
        if (companyID !== undefined && companyID !== '') where.companyID = companyID;
        if (userId !== undefined && userId !== '') where.userId = userId;
        if (category !== undefined && category !== '') where.category = category;
        const quotations = await Quotation.findAll({
            where: Object.keys(where).length ? where : undefined,
            order: [['createdAt', 'DESC']]
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const dataWithLinks = quotations.map(q => ({
            ...q.toJSON(),
            link: `${baseUrl}/quotation/${q.token}/view`
        }));

        res.json({ success: true, data: dataWithLinks });
    } catch (error) {
        console.error('getQuotationsByQuery error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /quotation/list/:companyID - List all quotations for a company (admin)
 */
exports.listQuotations = async (req, res) => {
    try {
        const companyID = req.params.companyID;
        const quotations = await Quotation.findAll({
            where: { companyID },
            order: [['createdAt', 'DESC']]
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const dataWithLinks = quotations.map(q => ({
            ...q.toJSON(),
            link: `${baseUrl}/quotation/${q.token}/view`
        }));

        res.json({ success: true, data: dataWithLinks });
    } catch (error) {
        console.error('listQuotations error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /quotation/:id/stats - Get view count for UI (e.g. localhost:5173/quotation/1)
 * Returns count so frontend can display "viewed X times"
 */
// exports.getQuotationStats = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id, 10);
//         if (isNaN(id)) {
//             return res.status(400).json({ success: false, message: 'Invalid quotation id' });
//         }
//         const quotation = await Quotation.findByPk(id, {
//             attributes: ['id', 'link_click_count']
//         });
//         if (!quotation) {
//             return res.status(404).json({ success: false, message: 'Quotation not found' });
//         }
//         const count = quotation.link_click_count != null ? quotation.link_click_count : 0;
//         res.json({
//             success: true,
//             count,
//             link_click_count: count,
//             viewCount: count
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

/**
 * GET /quotation/:id - Get single quotation by id (admin / fallback for UI)
 * Includes link_click_count so frontend can use it if /stats fails
 */
// exports.getQuotationById = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id, 10);
//         const quotation = await Quotation.findByPk(id);
//         if (!quotation) {
//             return res.status(404).json({ success: false, message: 'Quotation not found' });
//         }
//         res.json({ success: true, data: quotation });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

exports.getQuotationStats = async (req, res) => {
    try {
        const param = req.params.id;  // could be token string or numeric id
        const isNumeric = /^\d+$/.test(param);

        const quotation = isNumeric
            ? await Quotation.findByPk(parseInt(param, 10), { attributes: ['id', 'link_click_count'] })
            : await Quotation.findOne({ where: { token: param }, attributes: ['id', 'link_click_count'] });

        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }
        const count = quotation.link_click_count ?? 0;
        res.json({ success: true, count, link_click_count: count, viewCount: count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** GET /quotation/stats/:token - Stats by token only (use this from frontend to avoid 404) */
exports.getQuotationStatsByToken = async (req, res) => {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }
        const quotation = await Quotation.findOne({
            where: { token },
            attributes: ['id', 'token', 'link_click_count']
        });
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }
        const count = quotation.link_click_count ?? 0;
        res.json({ success: true, count, link_click_count: count, viewCount: count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getQuotationById = async (req, res) => {
    try {
        const param = req.params.id;
        const isNumeric = /^\d+$/.test(param);

        const quotation = isNumeric
            ? await Quotation.findByPk(parseInt(param, 10))
            : await Quotation.findOne({ where: { token: param } });

        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const dataWithLink = {
            ...quotation.toJSON(),
            link: `${baseUrl}/quotation/${quotation.token}/view`
        };

        res.json({ success: true, data: dataWithLink });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * PUT /quotation/:id - Update quotation
 */
exports.updateQuotation = async (req, res) => {
    try {
        const param = req.params.id;
        const isNumeric = /^\d+$/.test(param);
        const where = isNumeric ? { id: parseInt(param, 10) } : { token: param };

        const [updated] = await Quotation.update(req.body, { where });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Quotation not found or no changes made' });
        }

        const quotation = await Quotation.findOne({ where });
        res.json({ success: true, message: 'Quotation updated successfully', data: quotation });
    } catch (error) {
        console.error('updateQuotation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * DELETE /quotation/:id - Delete quotation
 */
exports.deleteQuotation = async (req, res) => {
    try {
        const param = req.params.id;
        const isNumeric = /^\d+$/.test(param);
        const where = isNumeric ? { id: parseInt(param, 10) } : { token: param };

        const deleted = await Quotation.destroy({ where });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }

        res.json({ success: true, message: 'Quotation deleted successfully' });
    } catch (error) {
        console.error('deleteQuotation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
