const express = require('express');
const { getCompany, upsertCompany, uploadLogo } = require('../controllers/company');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('employer', 'admin'));

router.route('/')
    .get(getCompany)
    .post(upsertCompany);

router.post('/logo', upload.single('logo'), uploadLogo);

module.exports = router;
