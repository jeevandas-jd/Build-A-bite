// models/Player.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },      // Optional: URL to Minecraft-style avatar
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
