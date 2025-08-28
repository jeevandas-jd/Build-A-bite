const Player = require('../models/Player');
const GameSession = require('../models/GameSession');
const Score = require('../models/Score');

// Helper: Ensure user is admin
function requireAdmin(req, res) {
  if (!req.user.isAdmin) {
    res.status(403).json({ error: 'Admin only' });
    return false;
  }
  return true;
}

// GET /api/admin/players
exports.getAllPlayers = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const players = await Player.find().select('-passwordHash');
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/attempts
exports.getAllAttempts = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    // Return all GameSession docs - you can expand/modify for more details
    const sessions = await GameSession.find().populate('player', 'name email');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/leaderboard (downloadable)
exports.downloadLeaderboard = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const scores = await Score.find()
      .sort({ score: -1, date: 1 })
      .populate('player', 'name email');
    // Optionally format for CSV download
    res.json(scores); // Or send as CSV if needed
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
