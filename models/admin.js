const mongoose = require('mongoose');

const adminShema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Admin',adminShema);