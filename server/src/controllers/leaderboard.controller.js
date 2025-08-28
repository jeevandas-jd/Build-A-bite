const Score = require('../models/Score');

// GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ score: -1, date: 1 })
      .limit(10)
      .populate('player', 'name');
    res.json(topScores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/leaderboard
exports.submitScore = async (req, res) => {
  try {
    const { score, difficulty, product, sessionId } = req.body;
    if (score == null || !difficulty || !product) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newScore = new Score({
      player: req.user.id,
      gameSession: sessionId,
      score,
      difficulty,
      product,
      date: new Date(),
    });
    await newScore.save();
    res.status(201).json({ message: 'Score submitted', score: newScore });
  } catch (err) {
    res.status(400).json({ error: 'Submission failed' });
  }
};

// GET /api/leaderboard/player/:id
exports.getPlayerScores = async (req, res) => {
  try {
    const scores = await Score.find({ player: req.params.id })
      .sort({ score: -1, date: 1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
