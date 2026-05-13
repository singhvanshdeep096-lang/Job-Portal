const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Get applications for employer's jobs
// @route   GET /api/v1/applications
// @access  Private (Employer)
exports.getApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });
        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title');

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single application
// @route   GET /api/v1/applications/:id
// @access  Private (Employer)
exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update application status
// @route   PUT /api/v1/applications/:id
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res) => {
    try {
        let application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        application = await Application.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
