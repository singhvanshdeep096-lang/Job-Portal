const Job = require('../models/Job');

const checkJobExpiry = async () => {
    try {
        const now = new Date();
        const result = await Job.updateMany(
            { 
                deadline: { $lt: now }, 
                status: 'active' 
            },
            { 
                $set: { status: 'expired' } 
            }
        );
        if (result.modifiedCount > 0) {
            console.log(`Updated ${result.modifiedCount} jobs to expired status.`);
        }
    } catch (err) {
        console.error('Error checking job expiry:', err.message);
    }
};

module.exports = checkJobExpiry;
