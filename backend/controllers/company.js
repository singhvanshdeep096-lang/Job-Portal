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

// @desc    Upload company logo
// @route   POST /api/v1/company/logo
// @access  Private
exports.uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        let company = await Company.findOneAndUpdate(
            { employer: req.user.id },
            { logo: logoUrl },
            { new: true }
        );

        if (!company) {
            // Create if doesn't exist
            company = await Company.create({
                employer: req.user.id,
                name: 'Your Company',
                logo: logoUrl
            });
        }

        res.status(200).json({
            success: true,
            data: company
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
