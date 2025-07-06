const express = require('express');
const User = require('../model/model');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Ping test
router.get('/ping', (req, res) => {
  res.send('✅ Friends route is working');
});

// Get friend list
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', '_id email');
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Search users
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      email: { $regex: query, $options: 'i' },
      _id: { $ne: req.user._id }
    }).select('_id email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add friend
router.get('/all-users', async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const excludeIds = [req.user._id, ...currentUser.friends];

    const users = await User.find({ _id: { $nin: excludeIds } }).select('_id username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add/:friendId', auth, async (req, res) => {
  const { friendId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.json({ message: 'Friend added' });
  } catch (err) {
    console.error("Add friend error:", err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Remove friend
router.delete('/remove/:friendId', async (req, res) => {
  const { friendId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { friends: friendId } });
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
