const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., Food, Travel, etc.
  splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('expense', ExpenseSchema);
