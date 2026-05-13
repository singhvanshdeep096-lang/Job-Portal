const Company = require('../models/Company');

// @desc    Get current employer's company
// @route   GET /api/v1/company
// @access  Private
exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findOne({ employer: req.user.id });

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company profile not found' });
        }

        res.status(200).json({ success: true, data: company });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create or update company profile
// @route   POST /api/v1/company
// @access  Private
exports.upsertCompany = async (req, res) => {
    try {
        req.body.employer = req.user.id;

        let company = await Company.findOne({ employer: req.user.id });

        if (company) {
            // Update
            company = await Company.findOneAndUpdate(
                { employer: req.user.id },
                req.body,
                { new: true, runValidators: true }
            );
            return res.status(200).json({ success: true, data: company });
        }

        // Create
        company = await Company.create(req.body);
        res.status(201).json({ success: true, data: company });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
