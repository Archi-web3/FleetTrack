const express = require('express');
const router = express.Router();
const pushController = require('../controllers/push.controller');

// GET /api/push/vapid-key
router.get('/vapid-key', pushController.getVapidKey);

// POST /api/push/subscribe
router.post('/subscribe', pushController.subscribe);

module.exports = router;
