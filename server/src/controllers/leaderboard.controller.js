const Score = require('../models/Score');
const Product = require('../models/Product');
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
    const { score, difficulty, product,accuracy, sessionId } = req.body;
    if (score == null || !difficulty || !product) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const productName=Product.findById(product).select('name');
    console.log(`product id: ${product}, product name: ${productName}`); 
    const newScore = new Score({
      player: req.user.id,
      gameSession: sessionId,
      score,
      accuracy,
      difficulty,
      productName,
      date: new Date(),
      timeToFinish: req.body.timeToFinish // in seconds
    });
    await newScore.save();
    res.status(201).json({ message: 'Score submitted', score: newScore });
    console.log(`New score submitted: Player ${req.user.id}, Score ${score}, Difficulty ${difficulty}, Product ${product}, Time to Finish ${req.body.timeToFinish}s`);
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
exports.clearAllScores = async (req, res) => {
  if (false) {
    return res.status(403).json({ error: 'Admin only' });
  }
  try {
    await Score.deleteMany({});
    res.json({ message: 'All scores cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
