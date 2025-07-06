const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/model');
const router = express.Router();

// Sign up with username only
router.post('/signup', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username required' });

  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username already exists' });

    user = await User.create({ username });
    res.json({ message: 'Signup successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login with username only
router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username required' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ user: { _id: user._id, username: user.username } }, 'TOP_SECRET', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
