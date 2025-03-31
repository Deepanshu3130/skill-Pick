const mongoose = require('mongoose');
const details = new mongoose.Schema(
  {
    platform :{
        type:String,
        required:true  
    },
    
    provider:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        
    },
    imageUrl: {
        type: String,
        required: true
    },
    duration: {
        type: String,
       
    },
    lectures: {
        type: String,     
    },
 
    link: {
        type: String,
        required: true
    },

    type :{
        type:String,
        required:true,
        // enum:["free" , "paid"]
    },

    rating :{
        type:String,
        
    },
    reviews:{
        type:String,
    },
    skillPickRating:{
        type:Number,

    },
    level :{
        type:String,
        required:true,
        
    },
    query:{
        type:String,
        required:true
    }
  }
);
module.exports = mongoose.model('courseDetail', details);

