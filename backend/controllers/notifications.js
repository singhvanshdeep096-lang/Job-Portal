const Notification = require('../models/Notification');

// @desc    Get all notifications for logged in user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort('-createdAt')
            .populate('sender', 'name')
            .populate('job', 'title');

        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        // Make sure user is recipient
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
// @desc    Delete all notifications
// @route   DELETE /api/v1/notifications
// @access  Private
exports.deleteNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user.id });
        res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
