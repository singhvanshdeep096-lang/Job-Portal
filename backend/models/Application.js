const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    candidateName: {
        type: String,
        required: [true, 'Please add candidate name']
    },
    candidateEmail: {
        type: String,
        required: [true, 'Please add candidate email']
    },
    resume: {
        type: String, // Path to file
        required: [true, 'Please upload a resume']
    },
    status: {
        type: String,
        enum: ['Pending', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
