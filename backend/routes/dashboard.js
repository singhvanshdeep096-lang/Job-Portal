const express = require('express');
const { getMetrics } = require('../controllers/dashboard');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/metrics', authorize('employer', 'admin'), getMetrics);

module.exports = router;
