const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configure AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Helps resolve ENOTFOUND DNS issues by using s3.region.amazonaws.com/bucket
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        // acl: 'public-read', // Removed because bucket configuration does not allow ACLs (Bucket Owner Enforced)
        contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content-type
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log('Generating S3 key for:', file.originalname);
            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\s+/g, '_');

            // Log body for debugging
            console.log('Fields received in body during key generation:', Object.keys(req.body));

            // Resolve companyID from all available sources
            let companyID = req.body?.companyID || req.body?.companyId ||
                            req.query?.companyID || req.query?.companyId ||
                            req.params?.companyID || req.params?.companyId ||
                            req.headers?.['x-company-id'] || req.headers?.['company-id'] ||
                            req.auth?.companyID;

            // If still not found, try decoding JWT from Authorization header if present
            if (!companyID && req.headers?.authorization) {
                try {
                    const token = req.headers.authorization.replace(/^Bearer\s+/i, '');
                    const jwt = require('jsonwebtoken');
                    const decoded = jwt.decode(token);
                    if (decoded && (decoded.companyID || decoded.companyId)) {
                        companyID = decoded.companyID || decoded.companyId;
                    }
                } catch (e) {
                    // Ignore decode errors
                }
            }

            const typeval = String(req.body?.typeval || '').toLowerCase();
            const category = String(req.body?.category || '').toLowerCase();
            const companyName = String(req.body?.companyName || req.body?.company || req.query?.companyName || '').toLowerCase();

            // Detect if this upload is for Sai Builders (Company ID 2 or references saibuilder)
            const isSaiBuilders = String(companyID).trim() === '2' ||
                                  companyName.includes('sai') ||
                                  typeval.includes('saibuilder') ||
                                  typeval.includes('company-2') ||
                                  typeval.includes('company/company-2') ||
                                  category.includes('saibuilder');

            if (isSaiBuilders) {
                const key = `saibuilders/${timestamp}-${originalName}`;
                console.log(`[S3 Upload] Uploading to Sai Builders S3 folder: ${key}`);
                return cb(null, key);
            }

            let folder = req.body.typeval || req.body.category || 'general';

            // If folder already starts with 'uploads', don't prepend it
            if (folder && folder.toString().startsWith('uploads')) {
                cb(null, `${folder}/${timestamp}-${originalName}`);
            } else {
                cb(null, `uploads/${folder || 'general'}/${timestamp}-${originalName}`);
            }
        }
    })
});
module.exports = upload;
