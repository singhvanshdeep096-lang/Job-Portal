const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const checkJobExpiry = require('./utils/jobExpiry');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Make socket.io available in controllers
app.set('socketio', io);

// Route files
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');
const company = require('./routes/company');
const applications = require('./routes/applications');
const dashboard = require('./routes/dashboard');
const skills = require('./routes/skills');

const employer = require('./routes/employer');
const employee = require('./routes/employee');
const notifications = require('./routes/notifications');
const admin = require('./routes/admin');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/jobs', jobs);
app.use('/api/v1/company', company);
app.use('/api/v1/applications', applications);
app.use('/api/v1/dashboard', dashboard);
app.use('/api/v1/skills', skills);

app.use('/api/v1/employer', employer);
app.use('/api/v1/employee', employee);
app.use('/api/v1/notifications', notifications);
app.use('/api/v1/admin', admin);

// Basic route
app.get('/', (req, res) => {
    res.send('Recruitment Portal API is running...');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('join_role', (role) => {
        socket.join(role);
        console.log(`User joined ${role} room`);
    });

    socket.on('send_message', (data) => {
        // Emit to specific receiver
        io.to(data.receiverId).emit('new_message', data);
    });

    socket.on('notify_employer', (data) => {
        // data.employerId, data.message, data.type
        io.to(data.employerId).emit('notification', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Run job expiry check every hour
setInterval(checkJobExpiry, 3600000);
// Also run on startup
checkJobExpiry();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
