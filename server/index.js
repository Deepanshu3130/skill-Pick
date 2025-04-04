require('dotenv').config();
const { connect } = require('./config/database');
const cookieParser = require('cookie-parser');
const courseRoute = require('./Routes/courseDataRoute')
const filterRoute = require('./Routes/FilterRoutes')
const cors = require('cors');
const { app, server, io, getReceiverSocketId } = require('./config/socket');
const express = require('express');
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/v1/courseData', courseRoute);
app.use('/api/v1/filter', filterRoute);
app.get('/', (req, res) => res.send('Your app is running here'));
connect();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

 module.exports = { io, app, server, getReceiverSocketId };
