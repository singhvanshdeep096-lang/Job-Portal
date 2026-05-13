const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employer', // For now, simplified
        required: true
    },
    receiver: {
        type: String, // Candidate email or ID
        required: true
    },
    content: {
        type: String,
        required: true
    },
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
