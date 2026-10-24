require('dotenv').config();

// Normalize environment variable casing for Linux/Docker environments
if (!process.env.NODE_ENV && process.env.Node_ENV) {
    process.env.NODE_ENV = process.env.Node_ENV;
}
if (!process.env.dataBase_url && process.env.DATABASE_URL) {
    process.env.dataBase_url = process.env.DATABASE_URL;
}
if (!process.env.dataBase_url && process.env.MONGODB_URI) {
    process.env.dataBase_url = process.env.MONGODB_URI;
}

const { connect } = require('./config/database');
const cookieParser = require('cookie-parser');
const courseRoute = require('./Routes/courseDataRoute');
const topicRoute = require('./Routes/topicRoute');
const resourceRoute = require('./Routes/resourceRoute');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { app, server, io, getReceiverSocketId } = require('./config/socket');
const express = require('express');
const { cloudinaryConnect } = require('./config/cloudinay');
const fileUpload = require('express-fileupload');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'https://skill-pick-frontend.onrender.com',
    'https://skill-pick.onrender.com',
    'https://skill-pick-server.onrender.com',
    'https://skill-pick-3-bnio.onrender.com'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.trim().replace(/\/+$/, ''));
}

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const normalized = origin.trim().replace(/\/+$/, '');
        if (
            allowedOrigins.includes(normalized) ||
            normalized.startsWith('http://localhost:') ||
            normalized.startsWith('http://127.0.0.1:') ||
            normalized.endsWith('.onrender.com') ||
            normalized.includes('onrender.com')
        ) {
            return callback(null, true);
        }
        return callback(null, true); // Fallback to allow cross-origin
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Health check endpoint for Render / cloud deployment health monitors
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// API Routes
app.use('/api/v1/courseData', courseRoute);
app.use('/api', topicRoute);
app.use('/api/v1', topicRoute);
app.use('/api/resources', resourceRoute);
app.use('/api/v1/resources', resourceRoute);
app.use('/api', require('./Routes/homeStatsRoute'));

// Serve static frontend files in production if dist directory exists
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

connect();
cloudinaryConnect();

// Catch unexpected errors so the server logs exact details instead of dying silently
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} (0.0.0.0)`);
});

module.exports = { io, app, server, getReceiverSocketId };
