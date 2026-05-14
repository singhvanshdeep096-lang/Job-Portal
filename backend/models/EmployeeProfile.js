const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer', // Keeping the name Employer for now as it's the User model
        required: true,
        unique: true
    },
    personalDetails: {
        phone: String,
        address: String,
        bio: String,
        avatar: String
    },
    skills: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Skill'
    }],
    experience: [{
        title: String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String
    }],
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String
    }],
    resume: {
        url: String,
        publicId: String,
        fileName: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    savedJobs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Job'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EmployeeProfile', employeeProfileSchema);
