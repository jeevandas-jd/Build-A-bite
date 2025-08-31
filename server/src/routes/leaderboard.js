const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');
const { authenticate } = require('../controllers/auth.controller');

// Get global leaderboard (top N scores)
router.get('/', leaderboardController.getLeaderboard);

// Submit a new score
router.post('/', authenticate, leaderboardController.submitScore);

// Get all of a specific player's scores
router.get('/player/:id', leaderboardController.getPlayerScores);

// (Admin only) Clear all scores - for testing purposes
//router.delete('/clear', leaderboardController.clearAllScores);

module.exports = router;
