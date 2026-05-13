import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import EmployerDashboard from './pages/EmployerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerJobs from './pages/EmployerJobs';
import AdminSkills from './pages/AdminSkills';
import EmployerApplications from './pages/EmployerApplications';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import EmployerMessages from './pages/EmployerMessages';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<EmployerDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<EmployerJobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/admin/skills" element={<AdminSkills />} />
              <Route path="/applications" element={<EmployerApplications />} />
              <Route path="/messages" element={<EmployerMessages />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
