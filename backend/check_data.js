const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Application = require('./backend/models/Application');

dotenv.config({ path: './backend/.env' });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Application.countDocuments();
        console.log(`Total Applications in DB: ${count}`);

        const recent = await Application.find().sort('-appliedAt').limit(5);
        console.log('Recent Applications:', JSON.stringify(recent, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkData();
