const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Employer = require('../models/Employer');

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
        
        // Find the company associated with this employer
        const company = await Company.findOne({ employer: req.user.id });
        if (!company) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please create a company profile first before posting jobs' 
            });
        }
        
        // Attach company ID to the job
        req.body.company = company._id;

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
        const application = await Application.findById(req.params.id).populate('job');
        
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Verify that the job belongs to this employer
        if (application.job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized to update this application' 
            });
        }

        application.status = req.body.status;
        await application.save();

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
// PROFILE MANAGEMENT
exports.getProfile = async (req, res) => {
    try {
        const employer = await Employer.findById(req.user.id);
        const company = await Company.findOne({ employer: req.user.id });
        
        res.status(200).json({
            success: true,
            data: {
                employer,
                company
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, companyName, description, website, address, contactPhone } = req.body;

        // Update Employer (User) details
        const employer = await Employer.findByIdAndUpdate(req.user.id, { name, email }, {
            new: true,
            runValidators: true
        });

        // Update or Create Company details
        let company = await Company.findOne({ employer: req.user.id });

        if (company) {
            company = await Company.findByIdAndUpdate(company._id, {
                name: companyName || company.name,
                description,
                website,
                address,
                contactPhone
            }, { new: true, runValidators: true });
        } else {
            company = await Company.create({
                name: companyName,
                description,
                website,
                address,
                contactPhone,
                employer: req.user.id
            });
        }

        res.status(200).json({
            success: true,
            data: { employer, company }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        // Delete all jobs by this employer
        await Job.deleteMany({ employer: req.user.id });
        
        // Delete company profile
        await Company.findOneAndDelete({ employer: req.user.id });

        // Delete Employer (User) account
        await Employer.findByIdAndDelete(req.user.id);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
