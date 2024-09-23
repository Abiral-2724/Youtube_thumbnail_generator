const dotenv = require('dotenv');
const axios = require('axios');
const Collection = require('../models/Collection.model.js');
const Thumbnail = require('../models/Thumbnail.model.js');
const mongoose = require('mongoose');

dotenv.config();

const apiKey = process.env.API_KEY;
const apiUrl = process.env.API_URL;

const CollectionController = {
  // Create a new collection
  async createCollection(req, res) {
    try {
      const { name, userId } = req.body;
      const newCollection = new Collection({
        name,
        userId,
        thumbnails: []
      });
      await newCollection.save();
      res.status(201).json(newCollection);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Fetch all collections
  async getAllCollections(req, res) {
    try {
      const collections = await Collection.find();
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

 // Fetch collections by user ID
 async getCollections(req, res) {
    try {
      const { userId } = req.params; // Get userId from URL path parameter
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const collections = await Collection.find({ userId: userId});
      
      if (!collections.length) {
        return res.status(404).json({ message: 'No collections found for this user' });
      }
      
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Delete a collection
  async deleteCollection(req, res) {
    try {
      const collection = await Collection.findByIdAndDelete(req.params.id);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a thumbnail to a collection and store in Thumbnail model
  async addThumbnail(req, res) {
    const { collectionId, youtubeUrl, userId } = req.body;

    if (!youtubeUrl || !collectionId || !userId) {
      return res.status(400).json({ error: 'YouTube URL, Collection ID, and User ID are required' });
    }

    try {
      const videoId = extractVideoId(youtubeUrl);
      
      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }

      const fullApiUrl = `${apiUrl}${videoId}&key=${apiKey}`;
      
      const response = await axios.get(fullApiUrl);
      
      if (response.data.items.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const thumbnails = response.data.items[0].snippet.thumbnails;
      const thumbnailUrls = Object.values(thumbnails).map(thumb => thumb.url);

      const thumbnailToStore = thumbnailUrls[4] || thumbnailUrls[thumbnailUrls.length - 1];

      const updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        { $push: { thumbnails: thumbnailToStore } },
        { new: true }
      );

      if (!updatedCollection) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      const newThumbnail = new Thumbnail({
        userId,
        youtubeUrl,
        thumbnailUrl: thumbnailUrls,
        videoId
      });

      await newThumbnail.save();

      res.status(200).json({
        message: 'Thumbnail added successfully',
        collection: updatedCollection,
        thumbnail: newThumbnail
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while adding the thumbnail' });
    }
  },

  // Download collection (returns URLs for now)
  async downloadCollection(req, res) {
    try {
      const collection = await Collection.findById(req.params.id);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      // For now, we're just returning the thumbnail URLs
      // In a real-world scenario, you might want to generate a zip file or use a file hosting service
      res.status(200).json({ thumbnails: collection.thumbnails });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Search collections by YouTube URL
  // Search collections by name
  async searchCollections(req, res) {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Collection name is required for search' });
    }
  
    try {
      // Search for collections with names that match the query (case-insensitive)
      const collections = await Collection.find({ 
        name: { $regex: name, $options: 'i' } 
      }).sort({ updatedAt: -1 });
  
      if (!collections.length) {
        return res.status(404).json({ message: 'No collections found matching the given name' });
      }
  
      res.status(200).json({ collections });
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ error: 'An error occurred while searching for collections' });
    }
  },
  async getThumbnailsForCollection(req, res) {
    try {
      const { id } = req.params;

      // Fetch the collection by ID
      const collection = await Collection.findById({_id:id});

      // Check if the collection exists
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }

      // Assuming collection has a 'thumbnails' field which is an array of URLs or references
      const thumbnails = collection.thumbnails;

      
      // Return the thumbnails
      return res.status(200).json({ thumbnails });
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching thumbnails for the collection',
        error: error.message,
      });
    }
  },
  
};

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

module.exports = CollectionController;