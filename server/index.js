require('dotenv').config();
const { connect } = require('./config/database');
const cookieParser = require('cookie-parser');
const courseRoute = require('./Routes/courseDataRoute')
const filterRoute = require('./Routes/FilterRoutes')
const cors = require('cors');
const { app, server, io, getReceiverSocketId } = require('./config/socket');
const express = require('express');
const {cloudinaryConnect} = require('./config/cloudinay');
const fileUpload = require('express-fileupload');   
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

app.use('/api/v1/courseData', courseRoute);
// app.use('/api/v1/filter', filterRoute);
app.get('/', (req, res) => res.send('Your app is running here'));


connect();
cloudinaryConnect();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

 module.exports = { io, app, server, getReceiverSocketId };
