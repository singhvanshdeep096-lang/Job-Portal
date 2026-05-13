const express = require('express');
const {
    getDashboard,
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    getCandidateApplications,
    updateApplicationStatus
} = require('../controllers/employer');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('employer', 'admin'));

router.get('/dashboard', getDashboard);
router.get('/jobs', getJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getCandidateApplications);
router.put('/applications/:id', updateApplicationStatus);

module.exports = router;
