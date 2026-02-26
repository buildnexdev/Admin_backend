const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db.config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Routes
const usersRoutes = require('./routes/users');
const homePageImageRoutes = require('./routes/homePageImages');
const contentRoutes = require('./routes/content');
const commonRoutes = require('./routes/common');
const bannersRoutes = require('./routes/banners');

app.use('/users', usersRoutes);
app.use('/home-page', homePageImageRoutes);
app.use('/content', contentRoutes);
app.use('/_common', commonRoutes); // Keep this for backward compatibility if any
app.use('/', commonRoutes); // Add this to support the root-level call
app.use('/banners', bannersRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Node server running 🚀');
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
}, 60000);
