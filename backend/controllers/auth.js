const Employer = require('../models/Employer');
const jwt = require('jsonwebtoken');

// @desc    Register employer
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await Employer.create({ name, email, password, role });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error('Registration Error:', err);
        let message = err.message;
        
        if (err.code === 11000) {
            message = 'This email is already registered.';
        }
        
        res.status(400).json({ success: false, message });
    }
};

// @desc    Login employer
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
    console.log('Login attempt:', req.body.email);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Login failed: Missing fields');
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const user = await Employer.findOne({ email }).select('+password');

        if (!user) {
            console.log('Login failed: User not found ->', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            console.log('Login failed: Password mismatch for ->', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log('Login successful for ->', email);
        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Login Error:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get current logged in employer
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await Employer.findById(req.user.id).populate('company');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    console.log('Token generated for user:', user.email);

    res.status(statusCode).json({
        success: true,
        token,
        role: user.role,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
