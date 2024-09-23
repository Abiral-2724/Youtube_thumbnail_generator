// File: controllers/thumbnailController.js
const dotenv = require('dotenv');
const axios = require('axios');
const Thumbnail = require('../models/Thumbnail.model.js');
const User = require('../models/user.model.js') ;
dotenv.config({});
const apiKey = process.env.API_KEY ;

const generateThumbnail = async (req, res) => {
  const { youtubeUrl, userId } = req.body;

  if (!youtubeUrl || !userId) {
    return res.status(400).json({ error: 'YouTube URL is required !!' });
  }

  try {
    const videoId = extractVideoId(youtubeUrl);
    
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const apiUrl = `${process.env.API_URL}${videoId}&key=${process.env.API_KEY}`;
    
    const response = await axios.get(apiUrl);
    
    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const thumbnails = response.data.items[0].snippet.thumbnails;
    const thumbnailUrls = Object.values(thumbnails).map(thumb => thumb.url);

    console.log(thumbnailUrls) ;

    const newThumbnail = new Thumbnail({
      userId,
      youtubeUrl,
      thumbnailUrl: thumbnailUrls,
      videoId
    });

    // Update user's personalThumbnail array
    await User.findByIdAndUpdate(userId, {
        $push: {
          personalThumbnail: {
            url: thumbnailUrls[thumbnailUrls.length - 1], // Use the highest quality thumbnail
            createdAt: new Date()
          }
        }
      });
      const updatedUser = await User.findById(userId);

    await newThumbnail.save();

    res.json({ thumbnailUrls, videoId ,user : updatedUser});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the thumbnail' });
  }
};

function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}


 // Assuming you have a Thumbnail model

// Get all thumbnails
const getAllThumbnails = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find().sort({ generatedAt: -1 });
    return res.status(200).json(thumbnails);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching thumbnails",
      error: error.message,
    });
  }
};

// Search thumbnails by YouTube URL
const searchThumbnails = async (req, res) => {
    const { url } = req.query; // Get the YouTube URL from the query string
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
  
    try {
      // Extract video ID from the URL (assuming you are storing just the video ID)
      const videoId = extractVideoId(url);
      
      // Search for thumbnails using the videoId
      const thumbnails = await Thumbnail.find({ videoId }).sort({ generatedAt: -1 });
  
      if (!thumbnails.length) {
        return res.status(404).json({ message: 'No thumbnails found for this URL' });
      }
  
      res.status(200).json(thumbnails); // Return the matching thumbnails
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ error: 'An error occurred while searching for thumbnails' });
    }
  };
  
 
  const getUserThumbnails = async (req, res) => {
    const userId = req.params.userId; // Assuming you'll pass the userId as a route parameter
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Get the personal thumbnails from the user object
      const personalThumbnails = user.personalThumbnail || [];
  
      // If you want to include more details, you can fetch the full thumbnail documents
      const thumbnailDetails = await Thumbnail.find({ userId: userId }).sort({ generatedAt: -1 });
  
      // Combine personal thumbnails with full details
      const combinedThumbnails = personalThumbnails.map(personalThumb => {
        const fullDetails = thumbnailDetails.find(detail => 
          detail.thumbnailUrl.includes(personalThumb.url)
        );
        return {
          ...personalThumb.toObject(),
          ...fullDetails?.toObject()
        };
      });
  
      res.status(200).json(combinedThumbnails);
    } catch (error) {
      console.error('Error fetching user thumbnails:', error);
      res.status(500).json({ error: 'An error occurred while fetching user thumbnails' });
    }
  };
  

// Export the controller functions
module.exports = {
  getAllThumbnails,
  searchThumbnails,
  generateThumbnail,
  getUserThumbnails,

};
