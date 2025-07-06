const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  expenses: [{
    description: String,
    amount: Number,
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    splitAmong: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('group', GroupSchema);
