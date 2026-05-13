const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a company name'],
        unique: true
    },
    description: String,
    website: String,
    logo: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    employer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', companySchema);
