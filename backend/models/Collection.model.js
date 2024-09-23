const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnails: [{
    type: [String], // This makes it an array of strings
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update the 'updatedAt' field
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;