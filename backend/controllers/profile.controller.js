const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as needed

// Get user profile data
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const thumbnailCount = user.personalThumbnail.length;

    const profileData = {
      ...user.toObject(),
      thumbnailCount,
    };

    res.json(profileData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's thumbnail analytics
router.get('/thumbnail-analytics', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thumbnailCreationDates = user.personalThumbnail.map(thumbnail => thumbnail.createdAt);

    const analytics = thumbnailCreationDates.reduce((acc, date) => {
      if (date >= sixMonthsAgo) {
        const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
        acc[monthKey] = (acc[monthKey] || 0) + 1;
      }
      return acc;
    }, {});

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedAnalytics = Object.entries(analytics).map(([key, value]) => ({
      name: monthNames[parseInt(key.split('-')[1]) - 1],
      thumbnails: value
    })).sort((a, b) => new Date(a.name) - new Date(b.name));

    res.json(formattedAnalytics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new thumbnail URL
router.post('/add-thumbnail', async (req, res) => {
  try {
    const { userId, thumbnailUrl } = req.body;
    if (!userId || !thumbnailUrl) {
      return res.status(400).json({ msg: 'User ID and Thumbnail URL are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.personalThumbnail.push({
      url: thumbnailUrl,
      createdAt: new Date()
    });
    await user.save();

    res.json(user.personalThumbnail);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Remove a thumbnail URL
router.delete('/remove-thumbnail', async (req, res) => {
  try {
    const { userId, index } = req.body;
    if (!userId || index === undefined) {
      return res.status(400).json({ msg: 'User ID and thumbnail index are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (index < 0 || index >= user.personalThumbnail.length) {
      return res.status(400).json({ msg: 'Invalid thumbnail index' });
    }

    user.personalThumbnail.splice(index, 1);
    await user.save();

    res.json(user.personalThumbnail);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;