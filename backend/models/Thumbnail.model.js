const mongoose = require('mongoose');

const thumbnailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: [String], // This makes it an array of strings
    required: true
  }
,  
  videoId:{
    type:String
  }
  ,
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

const Thumbnail = mongoose.model('Thumbnail', thumbnailSchema);

module.exports = Thumbnail;
