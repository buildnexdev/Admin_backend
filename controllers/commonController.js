const upload = require('../middleware/upload');

exports.uploadImageToServer = (req, res) => {
    upload.single('photoimg')(req, res, async (err) => {
        if (err) {
            console.error('[UPLOAD ERROR]:', err);
            return res.status(500).json({
                status: false,
                message: err.message || 'Image upload failed',
                error: err.name || 'UploadError',
                code: err.Code || err.code || 'S3_ERROR'
            });
        }

        try {
            if (!req.file) {
                console.log('No file received');
                return res.status(400).json({
                    status: false,
                    message: 'No file uploaded'
                });
            }

            const fileUrl = req.file.location || `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            const fileKey = req.file.key || `uploads/${req.file.filename}`;

            console.log('File successfully uploaded:', fileUrl);

            return res.status(200).json({
                status: true,
                message: 'Image uploaded successfully',
                url: fileUrl,
                fileName: fileKey,
                originalName: req.file.originalname
            });
        } catch (error) {
            console.error('Error in uploadImageToServer post-processing:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    });
};
