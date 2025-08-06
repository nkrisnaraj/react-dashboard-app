const express = require('express');
const ComponentsController = require('../controllers/componentsController');

const router = express.Router();

// GET /api/components - Get component data
router.get('/components', ComponentsController.getComponents);

// POST /api/components - Save component data
router.post('/components', ComponentsController.saveComponents);

// GET /api/health - Health check
router.get('/health', ComponentsController.healthCheck);

module.exports = router;
