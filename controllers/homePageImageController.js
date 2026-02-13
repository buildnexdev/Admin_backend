const HomePageImage = require('../models/homePageImage');

// POST /home-page/upload-image
exports.uploadHomePageImage = async (req, res) => {
    try {
        // Handle file from multer
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: 'Image file is required'
            });
        }

        const { category, companyId, companyID, userId } = req.body;

        const finalCategory = Array.isArray(category) ? category[0] : category;
        const finalCompanyIdRaw = companyId !== undefined ? companyId : companyID;
        const finalCompanyId = Array.isArray(finalCompanyIdRaw) ? finalCompanyIdRaw[0] : finalCompanyIdRaw;
        const finalUserIdRaw = userId;
        const finalUserId = Array.isArray(finalUserIdRaw) ? finalUserIdRaw[0] : finalUserIdRaw;

        if (!finalCategory || !finalCompanyId || !finalUserId) {
            return res.status(400).json({
                status: false,
                message: 'category, companyId and userId are required'
            });
        }

        const now = new Date();

        const payload = {
            imageUrl: req.file.filename,
            category: finalCategory,
            companyID: parseInt(finalCompanyId, 10),
            userId: parseInt(finalUserId, 10),
            isActive: 1,
            createdOn: now,
            updatedOn: now
        };

        const data = await HomePageImage.create(payload);

        return res.status(201).json({
            status: true,
            message: 'Home page image uploaded successfully',
            data
        });
    } catch (error) {
        console.error('Error uploading home page image:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// GET /home-page/images
exports.getHomePageImages = async (req, res) => {
    try {
        const data = await HomePageImage.findAll({
            where: { isActive: 1 }
        });

        return res.status(200).json({
            status: true,
            message: 'Images fetched successfully',
            data
        });
    } catch (error) {
        console.error('Error fetching home page images:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch images',
            error: error.message
        });
    }
};

