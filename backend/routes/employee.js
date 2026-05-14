const express = require('express');
const {
    getProfile,
    updateProfile,
    applyForJob,
    getDashboardStats,
    saveJob,
    getSavedJobs,
    removeSavedJob,
    getApplications,
    addExperience,
    updateExperience,
    deleteExperience,
    uploadResume
} = require('../controllers/employee');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All employee routes are protected and restricted to 'employee' role
router.use(protect);
router.use(authorize('employee'));

router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

router.get('/dashboard', getDashboardStats);

router.post('/apply/:jobId', applyForJob);

router.route('/saved-jobs')
    .get(getSavedJobs);

router.route('/saved-jobs/:jobId')
    .post(saveJob)
    .delete(removeSavedJob);

router.get('/applications', getApplications);

// Experience routes
router.post('/experience', addExperience);
router.route('/experience/:expId')
    .put(updateExperience)
    .delete(deleteExperience);

// Resume upload route
router.post('/upload-resume', upload.single('resume'), uploadResume);

module.exports = router;
