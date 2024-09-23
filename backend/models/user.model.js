const mongoose = require('mongoose') ;

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true ,
    },
    email:{
        type:String,
        required:true ,
    },
    password:{
        type:String,
        required:true ,
    },
    confirmPassword:{
        type:String,
        required:true ,
    },
    gender:{
        type:String,
        enum:['Male' ,'Female' ,'Prefer not to say'] ,
        required:true,
    },
    youtubeChannelName:{
        type:String,
    },
    youtubeChannelLink:{
        type:String,
    },
    personalThumbnail: [{
        url: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
},{timestamps:true})

module.exports = mongoose.model('User' ,userSchema) ;