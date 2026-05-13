const express = require('express');
const { 
    getSkills, 
    createSkill, 
    updateSkill, 
    deleteSkill 
} = require('../controllers/skills');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getSkills)
    .post(protect, authorize('admin'), createSkill);

router.route('/:id')
    .put(protect, authorize('admin'), updateSkill)
    .delete(protect, authorize('admin'), deleteSkill);

module.exports = router;
