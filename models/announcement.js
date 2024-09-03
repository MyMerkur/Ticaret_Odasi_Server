const mongoose = require('mongoose');

const announcementShema = mongoose.Schema({
    announcement:{
        type:String,
        required:true
    },
    announcementDetail:{
        type:String,
        required:true
    },
    announcement2:{
        type:String,
        required:false
    },
    announcementDetail2:{
        type:String,
        required:false
    },
    announcement3:{
        type:String,
        required:false
    },
    announcementDetail3:{
        type:String,
        required:false
    },
    announcementImg:{
        type:String,
        required:false
    },
    announcementFile:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model('Announcement',announcementShema);