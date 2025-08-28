const GameSession = require('../models/GameSession');

exports.startSession = async (req, res) => {
  try {
    const { difficulty, product } = req.body;
    console.log(`Starting session with difficulty: ${difficulty}, product: ${product}`);
    if (!difficulty || !product) {
      console.log(`the difficulty is ${difficulty} and the product is ${product}`);
      return res.status(400).json({ error: 'Missing difficulty or product' });
    }
    const session = new GameSession({
      player: req.user.id,
      difficulty,
      product,
      startedAt: new Date(),
      steps: [],
      score: 0,
      success: false
    });
    await session.save();
    res.status(201).json({ sessionId: session._id, message: 'Session started' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.player.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addStep = async (req, res) => {
  try {
    const { step } = req.body;
    if (!step) return res.status(400).json({ error: 'Step is required' });

    const session = await GameSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.player.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (session.success) {
      return res.status(400).json({ error: 'Session already completed' });
    }

    session.steps.push(step);
    await session.save();
    res.json({ message: 'Step added', steps: session.steps });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { score, timeSpent, success } = req.body;
    if (score == null || timeSpent == null || success == null) {
      return res.status(400).json({ error: 'Missing score, timeSpent or success' });
    }

    const session = await GameSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.player.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (session.success) {
      return res.status(400).json({ error: 'Session already completed' });
    }

    session.endedAt = new Date();
    session.score = score;
    session.timeSpent = timeSpent;
    session.success = success;

    await session.save();
    res.json({ message: 'Session ended', session });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
