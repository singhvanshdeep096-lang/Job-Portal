const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
    getApplications, 
    getApplication, 
    updateApplicationStatus
} = require('../controllers/applications');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('employer', 'admin'));

router.route('/')
    .get(getApplications);

router.route('/:id')
    .get(getApplication)
    .put(updateApplicationStatus);

module.exports = router;
