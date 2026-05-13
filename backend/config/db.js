const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to bypass network restrictions
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4, // Force IPv4
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
