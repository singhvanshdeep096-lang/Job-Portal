const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer',
        required: true
    },
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate bookmarks
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
