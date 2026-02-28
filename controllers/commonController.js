const upload = require('../middleware/upload');

exports.uploadImageToServer = [
    // Use the field name 'photoimg' as requested by the user
    (req, res, next) => {
        console.log('--- Upload Started ---');
        console.log('Timestamp:', new Date().toISOString());
        next();
    },
    upload.single('photoimg'),
    async (req, res) => {
        try {
            console.log('--- Upload Middleware Finished ---');
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

            // Return success with the file location
            return res.status(200).json({
                status: true,
                message: 'Image uploaded successfully',
                url: fileUrl,
                fileName: fileKey,
                originalName: req.file.originalname
            });
        } catch (error) {
            console.error('Error in uploadImageToServer:', error);
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    }
];
