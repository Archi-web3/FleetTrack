const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const auth = require('../middleware/authMiddleware');

// GET /api/audit - List logs (Admin only)
router.get('/', auth(['Admin', 'SuperAdmin', 'Superviseur']), auditController.getLogs);

module.exports = router;
