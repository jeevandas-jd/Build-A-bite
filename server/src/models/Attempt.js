// models/Attempt.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attemptSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  gameSession: { type: Schema.Types.ObjectId, ref: 'GameSession' },
  event: { type: String, required: true },     // e.g., "step_selected", "completed", etc.
  timestamp: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed }        // Arbitrary event info
});

module.exports = mongoose.model('Attempt', attemptSchema);
