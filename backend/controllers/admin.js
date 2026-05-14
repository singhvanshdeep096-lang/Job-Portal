const Employer = require('../models/Employer');
const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all employers
// @route   GET /api/v1/admin/employers
// @access  Private (Admin)
exports.getEmployers = async (req, res) => {
    try {
        const employers = await Employer.find({ role: 'employer' });
        res.status(200).json({ success: true, count: employers.length, data: employers });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single employer
// @route   GET /api/v1/admin/employers/:id
// @access  Private (Admin)
exports.getEmployer = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id);
        const company = await Company.findOne({ employer: req.params.id });

        if (!employer) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        res.status(200).json({ success: true, data: { employer, company } });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update employer
// @route   PUT /api/v1/admin/employers/:id
// @access  Private (Admin)
exports.updateEmployer = async (req, res) => {
    try {
        const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!employer) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        res.status(200).json({ success: true, data: employer });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete employer
// @route   DELETE /api/v1/admin/employers/:id
// @access  Private (Admin)
exports.deleteEmployer = async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id);

        if (!employer) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        // Delete associated data
        await Job.deleteMany({ employer: req.params.id });
        await Company.deleteMany({ employer: req.params.id });
        await employer.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
