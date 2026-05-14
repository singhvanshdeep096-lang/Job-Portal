const express = require('express');
const { getNotifications, markAsRead, markAllAsRead, deleteNotifications } = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All notification routes are protected

router.route('/')
    .get(getNotifications)
    .delete(deleteNotifications);

router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
