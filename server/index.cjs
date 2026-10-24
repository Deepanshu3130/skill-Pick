require('dotenv').config();
const { connect } = require('./config/database');
const cookieParser = require('cookie-parser');
const courseRoute = require('./Routes/courseDataRoute');
const topicRoute = require('./Routes/topicRoute');
const resourceRoute = require('./Routes/resourceRoute');
const path = require('path');
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
    'https://skill-pick-3-bnio.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive in dev to prevent blocking
        }
    },
    credentials: true
}));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp",
	})
);

app.use('/api/v1/courseData', courseRoute);
app.use('/api', topicRoute);
app.use('/api/v1', topicRoute);
app.use('/api/resources', resourceRoute);
app.use('/api/v1/resources', resourceRoute);

connect();
cloudinaryConnect();

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 3000;
server.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});

module.exports = { io, app, server, getReceiverSocketId };
