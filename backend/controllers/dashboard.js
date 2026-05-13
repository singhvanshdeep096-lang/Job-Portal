const Job = require('../models/Job');
const Application = require('../models/Application');


// @desc    Get dashboard metrics for employer
// @route   GET /api/v1/dashboard/metrics
// @access  Private
exports.getMetrics = async (req, res) => {
    try {
        const employerId = req.user.id;

        // Total active jobs
        const totalJobs = await Job.countDocuments({ employer: employerId });
        const activeJobs = await Job.countDocuments({ employer: employerId, status: 'active' });

        // Total applications for this employer's jobs
        const jobs = await Job.find({ employer: employerId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
        const shortlisted = await Application.countDocuments({ 
            job: { $in: jobIds }, 
            status: 'Shortlisted' 
        });
        const hired = await Application.countDocuments({ 
            job: { $in: jobIds }, 
            status: 'Hired' 
        });

        // Applications per job (for charts)
        const applicationsPerJob = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: '$job', count: { $sum: 1 } } },
            { $lookup: { from: 'jobs', localField: '_id', foreignField: '_id', as: 'jobInfo' } },
            { $unwind: '$jobInfo' },
            { $project: { title: '$jobInfo.title', count: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                activeJobs,
                totalApplications,
                shortlisted,
                hired,
                applicationsPerJob
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


