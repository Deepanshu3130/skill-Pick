


const mongoose = require("mongoose")

const queryModel = new mongoose.Schema({
    query :{
        type:String,
        require:true
    }

})
module.exports = mongoose.model('Query', queryModel);