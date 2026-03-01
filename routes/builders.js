const express = require('express');
const upload = require('../middleware/upload');
const {
    uploadProject,
    getProjects
} = require('../controllers/builderProjectController');

const router = express.Router();

// Quick check that /builders is mounted (GET /builders)
router.get('/', (req, res) => {
    res.json({ message: 'Builders API', upload: 'POST /builders/upload-project' });
});

// Accept one file with any field name (file, image, imageUrl, etc.)
router.post('/upload-project', upload.any(), uploadProject);

// GET /builders/projects
router.get('/projects', getProjects);

module.exports = router;
