const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./config/db.config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files and assets (e.g. brand logo)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const PORT = process.env.PORT || 5000;

// Routes
const usersRoutes = require('./routes/users');
const homePageImageRoutes = require('./routes/homePageImages');
const contentRoutes = require('./routes/content');
const activeRoutes = require('./routes/active');
const quotationRoutes = require('./routes/quotation');
const commonRoutes = require('./routes/common');
const bannersRoutes = require('./routes/banners');
const menuRoutes = require('./routes/menu');
const categoryRoutes = require('./routes/category');

app.use('/users', usersRoutes);
app.use('/active', activeRoutes);
app.use('/quotation', quotationRoutes);
app.use('/home-page', homePageImageRoutes);
app.use('/content', contentRoutes);
app.use('/_common', commonRoutes); // Keep this for backward compatibility if any
app.use('/', commonRoutes); // Add this to support the root-level call
app.use('/banners', bannersRoutes);
// menu routes
app.use('/menu', menuRoutes);
app.use('/category', categoryRoutes);

// Root endpoint - show Buildnex brand image
app.get('/', (req, res) => {
    const buildnexLogo = path.join(__dirname, 'assets', 'buildnex-logo.png');
    const publicLogo = path.join(__dirname, 'public', 'logo.png');
    if (fs.existsSync(buildnexLogo)) {
        return res.sendFile(buildnexLogo);
    }
    if (fs.existsSync(publicLogo)) {
        return res.sendFile(publicLogo);
    }
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Buildnex</title>
<style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;}
img{max-width:95%;max-height:95vh;object-fit:contain;}</style></head>
<body><img src="/assets/buildnex-logo.png" alt="Buildnex" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%2280%22%3E%3Crect fill=%22%231e3a5f%22 width=%22280%22 height=%2280%22 rx=%2212%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22sans-serif%22 font-size=%2224%22 font-weight=%22bold%22%3EBuildnex%3C/text%3E%3C/svg%3E'"></body></html>`;
    res.type('html').send(html);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Debug exit handlers
process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Keep-alive mechanism
setInterval(() => {
    console.log('Heartbeat - watching for process exit');
}, 1000000);
