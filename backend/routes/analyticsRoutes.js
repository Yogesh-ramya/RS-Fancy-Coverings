const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Track overall site visit
router.post('/track', analyticsController.trackVisit);

// Track specific product view
router.post('/product/:id/view', analyticsController.trackProductView);

// Get analytics stats for dashboard
router.get('/stats', analyticsController.getStats);

module.exports = router;
