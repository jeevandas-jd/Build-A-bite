const Player = require('../models/Player');

// GET /api/player/:id
exports.getPlayer = async (req, res) => {
  try {
    // Only allow self or admin to view
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const player = await Player.findById(req.params.id).select('-passwordHash');
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/player/:id
exports.updatePlayer = async (req, res) => {
  try {
    // Only allow self or admin to update
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updates = req.body;
    // Prevent email or passwordHash updates here for safety
    delete updates.email;
    delete updates.passwordHash;
    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, updates, { new: true, select: '-passwordHash' });
    res.json({ message: 'Profile updated', player: updatedPlayer });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/player/:id
exports.deletePlayer = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
