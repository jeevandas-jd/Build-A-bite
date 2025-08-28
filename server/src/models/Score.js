// models/Score.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  gameSession: { type: Schema.Types.ObjectId, ref: 'GameSession' },
  product: { type: String },
  score: { type: Number, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'expert'] },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
