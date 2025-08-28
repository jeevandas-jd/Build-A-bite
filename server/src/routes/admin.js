const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../controllers/auth.controller');

// All admin routes use authenticate middleware, plus admin check in controller:

router.get('/players', authenticate, adminController.getAllPlayers);
router.get('/attempts', authenticate, adminController.getAllAttempts);
router.get('/leaderboard', authenticate, adminController.downloadLeaderboard);

module.exports = router;
