const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title']
    },
    description: {
        type: String,
        required: [true, 'Please add a job description']
    },
    skillsRequired: [String],
    location: String,
    salary: String,
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    deadline: Date,
    status: {
        type: String,
        enum: ['active', 'expired', 'closed'],
        default: 'active'
    },
    employer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
