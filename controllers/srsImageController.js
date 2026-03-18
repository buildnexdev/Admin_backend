const SrsImage = require('../models/srsImage');

/**
 * GET /srs-images/all - Get all SRS images (no filters)
 */
exports.getAllSrsImages = async (req, res) => {
    try {
        const rows = await SrsImage.findAll({
            order: [['createdAt', 'DESC']]
        });
        const data = rows.map(r => {
            const json = r.toJSON();
            const { imageUrl: _u, ...rest } = json;
            const images = r.imageUrl && r.imageUrl.length ? r.imageUrl : [];
            return { ...rest, images };
        });
        res.json({ success: true, data, total: data.length });
    } catch (error) {
        console.error('getAllSrsImages error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /srs-images?companyID=1&userId=1
 */
exports.getSrsImages = async (req, res) => {
    try {
        const { companyID, userId } = req.query;
        const where = {};
        if (companyID !== undefined && companyID !== '') where.companyID = companyID;
        if (userId !== undefined && userId !== '') where.userId = userId;
        const rows = await SrsImage.findAll({
            where: Object.keys(where).length ? where : {},
            order: [['createdAt', 'DESC']]
        });
        const data = rows.map(r => {
            const json = r.toJSON();
            const { imageUrl: _u, ...rest } = json;
            const images = r.imageUrl && r.imageUrl.length ? r.imageUrl : [];
            return { ...rest, images };
        });
        const total = data.length;
        res.json({ success: true, data, total });
    } catch (error) {
        console.error('getSrsImages error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /srs-images/:id
 */
exports.getSrsImageById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const row = await SrsImage.findByPk(id);
        if (!row) {
            return res.status(404).json({ success: false, message: 'SRS image not found' });
        }
        const json = row.toJSON();
        const { imageUrl: _u, ...rest } = json;
        const data = { ...rest, images: row.imageUrl && row.imageUrl.length ? row.imageUrl : [] };
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /srs-images - add one content row with multiple images (title, disc, location, images array)
 */
exports.addSrsImage = async (req, res) => {
    try {
        const body = req.body || {};
        const companyID = body.companyID;
        const userId = body.userId;

        if (!companyID) {
            return res.status(400).json({ success: false, message: 'companyID is required' });
        }

        const companyIdNum = parseInt(companyID, 10);
        const userIdNum = userId !== undefined && userId !== '' ? parseInt(userId, 10) : null;

        const imageUrls = [];
        if (req.files && req.files.length) {
            req.files.forEach(f => imageUrls.push(f.filename));
        } else if (req.file) {
            imageUrls.push(req.file.filename);
        }
        if (Array.isArray(body.images) && body.images.length) {
            imageUrls.push(...body.images);
        } else if (Array.isArray(body.imagePaths) && body.imagePaths.length) {
            imageUrls.push(...body.imagePaths);
        } else if (Array.isArray(body.imageUrl) && body.imageUrl.length) {
            imageUrls.push(...body.imageUrl);
        } else if (body.imagePath || body.imageUrl || body.image) {
            imageUrls.push(body.imagePath || body.imageUrl || body.image);
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image is required (files or images/imagePaths array)' });
        }

        const title = body.title != null ? String(body.title) : null;
        const disc = body.disc != null ? String(body.disc) : null;
        const location = body.location != null ? String(body.location) : null;

        const row = await SrsImage.create({
            title,
            disc,
            location,
            imageUrl: imageUrls,
            companyID: companyIdNum,
            userId: userIdNum
        });
        const json = row.toJSON();
        const { imageUrl: _u, ...rest } = json;
        const data = { ...rest, images: row.imageUrl && row.imageUrl.length ? row.imageUrl : [] };
        res.status(201).json({ success: true, message: 'SRS image added successfully', data });
    } catch (error) {
        console.error('addSrsImage error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * PUT /srs-images/:id - update one row (title, disc, location, images array all in this row)
 */
exports.updateSrsImage = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const body = req.body || {};
        const updateData = {};
        if (body.title !== undefined) updateData.title = body.title === '' ? null : body.title;
        if (body.disc !== undefined) updateData.disc = body.disc === '' ? null : body.disc;
        if (body.location !== undefined) updateData.location = body.location === '' ? null : body.location;
        if (body.companyID !== undefined) updateData.companyID = parseInt(body.companyID, 10);
        if (body.userId !== undefined) updateData.userId = body.userId === '' ? null : parseInt(body.userId, 10);
        if (body.isActive !== undefined && body.isActive !== null && body.isActive !== '') {
            const v = body.isActive;
            updateData.isActive = (v === 0 || v === '0' || v === false || String(v).toLowerCase() === 'false') ? 0 : 1;
        }
        const file = req.file || (req.files && req.files[0]);
        if (Array.isArray(body.images) && body.images.length > 0) {
            updateData.imageUrl = body.images;
        } else if (file) {
            const existingRow = await SrsImage.findByPk(id);
            const existing = existingRow && existingRow.imageUrl && existingRow.imageUrl.length ? existingRow.imageUrl : [];
            updateData.imageUrl = [...existing, file.filename];
        } else if (body.imagePath !== undefined || body.imageUrl !== undefined || body.image !== undefined) {
            updateData.imageUrl = body.imagePath || body.imageUrl || body.image;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }
        const row = await SrsImage.findByPk(id);
        if (!row) {
            return res.status(404).json({ success: false, message: 'SRS image not found' });
        }
        await row.update(updateData);
        const json = row.toJSON();
        const { imageUrl: _u, ...rest } = json;
        const data = { ...rest, images: row.imageUrl && row.imageUrl.length ? row.imageUrl : [] };
        res.json({ success: true, message: 'SRS image updated successfully', data });
    } catch (error) {
        console.error('updateSrsImage error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * DELETE /srs-images/:id
 */
exports.deleteSrsImage = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const row = await SrsImage.findByPk(id);
        if (!row) {
            return res.status(404).json({ success: false, message: 'SRS image not found' });
        }
        await row.destroy();
        res.json({ success: true, message: 'SRS image deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
