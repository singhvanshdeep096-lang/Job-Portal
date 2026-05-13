const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// DASHBOARD
exports.getDashboard = async (req, res) => {
    try {
        const employerId = req.user.id;
        const totalJobs = await Job.countDocuments({ employer: employerId });
        const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });
        
        const jobs = await Job.find({ employer: employerId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
        const shortlisted = await Application.countDocuments({ job: { $in: jobIds }, status: 'Shortlisted' });
        const hired = await Application.countDocuments({ job: { $in: jobIds }, status: 'Hired' });

        const applicationsPerJob = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: '$job', count: { $sum: 1 } } },
            { $lookup: { from: 'jobs', localField: '_id', foreignField: '_id', as: 'jobInfo' } },
            { $unwind: '$jobInfo' },
            { $project: { title: '$jobInfo.title', count: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: { totalJobs, activeJobs, totalApplications, shortlisted, hired, applicationsPerJob }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// JOBS MANAGEMENT
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });
        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        req.body.employer = req.user.id;
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, employer: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.status(200).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// APPLICATIONS MANAGEMENT
exports.getCandidateApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id }).select('_id');
        const jobIds = jobs.map(j => j._id);
        const applications = await Application.find({ job: { $in: jobIds } }).populate('job', 'title');
        res.status(200).json({ success: true, data: applications });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
