
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
});

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema);
module.exports = UserModel;
