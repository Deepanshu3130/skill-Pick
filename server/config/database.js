const mongoose = require('mongoose');
require('dotenv').config();
exports.connect = ()=>{
    mongoose.connect(process.env.dataBase_url ,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('Database connected');
    })
    .catch((error)=>{
        console.log('Error connecting to the database');
        console.log(error.message);
        process.exit(1);
    })
}