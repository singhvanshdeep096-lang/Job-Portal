const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer', // Since Employer model handles both roles
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer'
    },
    type: {
        type: String,
        enum: ['job_posted', 'application_received', 'status_update'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
