const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/v1/skills
// @access  Public
exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort('name');
        res.status(200).json({ success: true, count: skills.length, data: skills });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create new skill
// @route   POST /api/v1/skills
// @access  Private (Admin)
exports.createSkill = async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json({ success: true, data: skill });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update skill
// @route   PUT /api/v1/skills/:id
// @access  Private (Admin)
exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        res.status(200).json({ success: true, data: skill });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete skill
// @route   DELETE /api/v1/skills/:id
// @access  Private (Admin)
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        await skill.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
