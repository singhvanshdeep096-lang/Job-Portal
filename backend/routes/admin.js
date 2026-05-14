const express = require('express');
const {
    getEmployers,
    getEmployer,
    updateEmployer,
    deleteEmployer
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/employers', getEmployers);
router.get('/employers/:id', getEmployer);
router.put('/employers/:id', updateEmployer);
router.delete('/employers/:id', deleteEmployer);

module.exports = router;
