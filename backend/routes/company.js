const express = require('express');
const { getCompany, upsertCompany } = require('../controllers/company');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('employer', 'admin'));

router.route('/')
    .get(getCompany)
    .post(upsertCompany);

module.exports = router;
