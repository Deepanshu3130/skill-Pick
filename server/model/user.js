const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    firstName:{ 
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    // password:{
    //     type: String,
    //     required: true,
    //     minlengthg: 6.

    // },
    profilePicture:{ 
        type: String,
        default: ''
    },
    

}, {timestamps: true});
module.exports = mongoose.model('User', userSchema);
