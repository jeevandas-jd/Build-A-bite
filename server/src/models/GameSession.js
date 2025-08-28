// models/GameSession.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'expert'], required: true },
  product: { type: String, required: true },   // Product name
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  score: { type: Number, default: 0 },
  steps: [{ type: String }],                   // Steps/items selected
  timeSpent: { type: Number },                 // Duration in seconds
  success: { type: Boolean, default: false }
});
const GameSession = mongoose.model('GameSession', sessionSchema);
module.exports = GameSession;

//token
//user1:    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YThiZGMyNWJjMzQwNzM4Mjk1ODgxMCIsImlhdCI6MTc1NTg4OTExMSwiZXhwIjoxNzU1OTc1NTExfQ.OLb12Y3uVtlmVyPT6E3VCaBUh8sgMXcSUn1_2Jo1o3w",
