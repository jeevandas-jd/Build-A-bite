const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { authenticate } = require('../controllers/auth.controller');

// Fetch player profile by ID
router.get('/:id', authenticate, playerController.getPlayer);

// Update current player profile (self-update)
router.put('/:id', authenticate, playerController.updatePlayer);

// Delete player profile (admin-only, optional)
router.delete('/:id', authenticate, playerController.deletePlayer);

module.exports = router;
