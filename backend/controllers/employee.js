const EmployeeProfile = require('../models/EmployeeProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Skill = require('../models/Skill');

// @desc    Get employee profile
// @route   GET /api/v1/employee/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        let profile = await EmployeeProfile.findOne({ user: req.user.id }).populate('skills');
        
        if (!profile) {
            // Create empty profile if not exists
            profile = await EmployeeProfile.create({ user: req.user.id });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update employee profile
// @route   PUT /api/v1/employee/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const profile = await EmployeeProfile.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        ).populate('skills');

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Apply for a job
// @route   POST /api/v1/employee/apply/:jobId
// @access  Private
exports.applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check for duplicate application
        const existingApp = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user.id
        });

        if (existingApp) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user.id,
            candidateName: req.user.name,
            candidateEmail: req.user.email,
            resume: req.body.resume, // In a real app, this would be from the profile or uploaded
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get employee dashboard stats
// @route   GET /api/v1/employee/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const appliedCount = await Application.countDocuments({ applicant: req.user.id });
        const savedCount = await SavedJob.countDocuments({ user: req.user.id });
        const recentApplications = await Application.find({ applicant: req.user.id })
            .populate('job')
            .sort('-appliedAt')
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                appliedCount,
                savedCount,
                recentApplications
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Bookmark a job
// @route   POST /api/v1/employee/saved-jobs/:jobId
// @access  Private
exports.saveJob = async (req, res) => {
    try {
        const saved = await SavedJob.create({
            user: req.user.id,
            job: req.params.jobId
        });
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Job already saved' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get saved jobs
// @route   GET /api/v1/employee/saved-jobs
// @access  Private
exports.getSavedJobs = async (req, res) => {
    try {
        const saved = await SavedJob.find({ user: req.user.id }).populate('job');
        res.status(200).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Remove saved job
// @route   DELETE /api/v1/employee/saved-jobs/:jobId
// @access  Private
exports.removeSavedJob = async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({
            user: req.user.id,
            job: req.params.jobId
        });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get employee's applications
// @route   GET /api/v1/employee/applications
// @access  Private
exports.getApplications = async (req, res) => {
    try {
        const apps = await Application.find({ applicant: req.user.id }).populate('job');
        res.status(200).json({ success: true, data: apps });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// EXPERIENCE CRUD
// @desc    Add experience to profile
// @route   POST /api/v1/employee/experience
// @access  Private
exports.addExperience = async (req, res) => {
    try {
        const profile = await EmployeeProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        profile.experience.unshift(req.body);
        await profile.save();

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update experience entry
// @route   PUT /api/v1/employee/experience/:expId
// @access  Private
exports.updateExperience = async (req, res) => {
    try {
        const profile = await EmployeeProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        const expIndex = profile.experience.findIndex(exp => exp._id.toString() === req.params.expId);
        if (expIndex === -1) {
            return res.status(404).json({ success: false, message: 'Experience entry not found' });
        }

        profile.experience[expIndex] = { ...profile.experience[expIndex], ...req.body };
        await profile.save();

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete experience entry
// @route   DELETE /api/v1/employee/experience/:expId
// @access  Private
exports.deleteExperience = async (req, res) => {
    try {
        const profile = await EmployeeProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.expId);
        await profile.save();

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Upload resume
// @route   POST /api/v1/employee/upload-resume
// @access  Private
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const profile = await EmployeeProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        profile.resume = {
            url: `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`,
            fileName: req.file.originalname,
            uploadedAt: Date.now()
        };

        await profile.save();

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
