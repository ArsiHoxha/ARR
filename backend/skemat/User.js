const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    displayName: String,
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
