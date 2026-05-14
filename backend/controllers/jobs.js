const Job = require('../models/Job');
const Company = require('../models/Company');
const Notification = require('../models/Notification');
const Employer = require('../models/Employer');


// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        let query;

        // Search/Filter logic
        const queryObj = { ...req.query };
        const excludeFields = ['select', 'sort', 'page', 'limit'];
        excludeFields.forEach(param => delete queryObj[param]);

        // Advanced filter (e.g., status, type)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Job.find(JSON.parse(queryStr)).populate('company', 'name logo');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const jobs = await query;

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company');

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private (Employer)
exports.createJob = async (req, res) => {
    try {
        // Add employer to req.body
        req.body.employer = req.user.id;

        // Check for company
        const company = await Company.findOne({ employer: req.user.id });

        if (!company) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please create a company profile first' 
            });
        }

        req.body.company = company._id;

        const job = await Job.create(req.body);

        // Notify all employees
        const employees = await Employer.find({ role: 'employee' });
        
        const notifications = employees.map(emp => ({
            recipient: emp._id,
            sender: req.user.id,
            type: 'job_posted',
            title: 'New Job Posted',
            message: `${company.name} has posted a new position: ${job.title}`,
            job: job._id
        }));

        await Notification.insertMany(notifications);

        // Real-time notification via Socket.io
        const io = req.app.get('socketio');
        if (io) {
            io.to('employee').emit('new_job_notification', {
                title: 'New Job Posted',
                message: `${company.name} has posted a new position: ${job.title}`,
                jobId: job._id,
                companyName: company.name
            });
        }

        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private (Employer)
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure user is job owner
        if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Employer)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure user is job owner
        if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


