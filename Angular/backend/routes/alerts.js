const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const authParams = require('../middleware/authMiddleware'); // Correction import

// Routes protégées par authentification
router.post('/', authParams, alertController.createAlert); // Admin créé
router.get('/', authParams, alertController.getAllAlerts); // Admin voit historique
router.get('/unread', authParams, alertController.getAlertsForVehicle); // e-logbook poll
router.post('/:id/read', authParams, alertController.markAsRead); // e-logbook confirme lecture

module.exports = router;
