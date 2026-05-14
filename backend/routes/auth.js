const express = require('express');
const { register, login, getMe, uploadAvatar } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
