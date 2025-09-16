const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
//const { authenticate } = require('../controllers/auth.controller');

// Fetch player profile by ID
router.get('/:id', playerController.getPlayer);

// Update current player profile (self-update)
router.put('/:id', playerController.updatePlayer);

// Delete player profile (admin-only, optional)
router.delete('/:id', playerController.deletePlayer);


router.get('/all',playerController.getAllPlayers);
module.exports = router;
