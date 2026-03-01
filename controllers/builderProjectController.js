const BuilderProject = require('../models/builderProject');

// POST /builders/upload-project
exports.uploadProject = async (req, res) => {
    try {
        const { title, description, category, companyId, companyID, userId } = req.body;

        const finalTitle = Array.isArray(title) ? title[0] : title;
        const finalDescription = description !== undefined
            ? (Array.isArray(description) ? description[0] : description)
            : null;
        const finalCategory = Array.isArray(category) ? category[0] : category;
        const finalCompanyIdRaw = companyId !== undefined ? companyId : companyID;
        const finalCompanyId = Array.isArray(finalCompanyIdRaw) ? finalCompanyIdRaw[0] : finalCompanyIdRaw;
        const finalUserId = Array.isArray(userId) ? userId[0] : userId;

        if (!finalTitle || !finalCategory || !finalCompanyId || !finalUserId) {
            return res.status(400).json({
                status: false,
                message: 'title, category, companyId and userId are required'
            });
        }

        const now = new Date();

        // upload.any() puts files in req.files (array); use first file if present
        const file = (req.files && req.files.length) ? req.files[0] : null;

        const payload = {
            title: finalTitle,
            description: finalDescription || '',
            category: finalCategory,
            companyID: parseInt(finalCompanyId, 10),
            userId: parseInt(finalUserId, 10),
            fileUrl: file ? file.filename : null,
            isActive: 1,
            createdOn: now,
            updatedOn: now
        };

        const data = await BuilderProject.create(payload);

        return res.status(201).json({
            status: true,
            message: 'Project uploaded successfully',
            data
        });
    } catch (error) {
        console.error('Error uploading builder project:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// GET /builders/projects
exports.getProjects = async (req, res) => {
    try {
        const data = await BuilderProject.findAll({
            where: { isActive: 1 }
        });

        return res.status(200).json({
            status: true,
            message: 'Projects fetched successfully',
            data
        });
    } catch (error) {
        console.error('Error fetching builder projects:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};
