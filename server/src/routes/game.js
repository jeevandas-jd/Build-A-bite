const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const { authenticate } = require('../controllers/auth.controller');

router.post('/start', authenticate, gameController.startSession);
router.get('/session/:id', authenticate, gameController.getSession);
router.post('/session/:id/step', authenticate, gameController.addStep);
router.post('/session/:id/end', authenticate, gameController.endSession);

module.exports = router;
