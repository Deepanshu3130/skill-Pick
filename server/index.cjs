require('dotenv').config();
const { connect } = require('./config/database');
const cookieParser = require('cookie-parser');
const courseRoute = require('./Routes/courseDataRoute')
const filterRoute = require('./Routes/FilterRoutes')
const path = require('path');
const cors = require('cors');
const { app, server, io, getReceiverSocketId } = require('./config/socket');
const express = require('express');
const {cloudinaryConnect} = require('./config/cloudinay');
const fileUpload = require('express-fileupload');



app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV==="production"? "https://skill-pick-1-bnio.onrender.com":'http://localhost:5173',
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
 if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));	
	});	
}


connect();
cloudinaryConnect();

const PORT = process.env.NODE_ENV=== "production"? process.env.PORT : 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

 module.exports = { io, app, server, getReceiverSocketId };
