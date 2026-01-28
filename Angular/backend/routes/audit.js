const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const auth = require('../middleware/authMiddleware');

const countryFilter = require('../middleware/countryFilter');

// GET /api/audit - List logs (Admin only)
router.get('/', auth(['Admin', 'SuperAdmin', 'Superviseur']), countryFilter, auditController.getLogs);

// DELETE /api/audit - Prune logs (SuperAdmin only)
router.delete('/', auth(['SuperAdmin']), auditController.pruneLogs);

module.exports = router;
