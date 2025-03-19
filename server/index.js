const express = require('express'); 
const {connect} = require('./config/database');
const courseRoute = require('./Routes/courseDataRoute');

const app = express();

const PORT = process.env.PORT ||3000; 
app.get('/',(req,res) =>{
    res.send('your app is running here');

})
connect();
app.use('/api/v1/courseData',courseRoute )

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

