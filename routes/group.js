const express = require('express');
const Group = require('../model/GroupModel'); // use your actual path
const User = require('../model/model');  // to validate member IDs, if needed
const router = express.Router();

// Create group
router.post('/', async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = await Group.create({
      name,
      members: [...members, req.user._id]
    });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List groups where current user is a member
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add expense to group
router.post('/:groupId/expenses', async (req, res) => {
  const { groupId } = req.params;
  const { description, amount, splitAmong } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Validate user is part of the group
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not a member of the group' });
    }

    group.expenses.push({
      description,
      amount,
      paidBy: req.user._id,
      splitAmong
    });

    await group.save();
    res.json({ message: 'Expense added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
