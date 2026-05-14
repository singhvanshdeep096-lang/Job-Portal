import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import EmployerDashboard from './pages/EmployerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerJobs from './pages/EmployerJobs';
import AdminSkills from './pages/AdminSkills';
import AdminEmployers from './pages/AdminEmployers';
import EmployerApplications from './pages/EmployerApplications';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import EmployerMessages from './pages/EmployerMessages';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import JobSearch from './pages/JobSearch';
import SavedJobs from './pages/SavedJobs';
import EmployeeApplications from './pages/EmployeeApplications';
import NotificationPage from './pages/NotificationPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading RecruitPortal...</p>
        </div>
      </div>
    );
  }

  const publicPaths = ['/', '/login', '/register'];
  const showNavbar = user && !publicPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          {/* Default/Landing Route */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Employee Routes */}
          <Route path="/jobs" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <JobSearch />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:id" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <JobDetails />
            </ProtectedRoute>
          } />

          <Route path="/employer-dashboard" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/employee-dashboard" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          <Route path="/saved-jobs" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <SavedJobs />
            </ProtectedRoute>
          } />

          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['employee', 'employer']}>
              {user?.role === 'employer' ? <EmployerApplications /> : <EmployeeApplications />}
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['employee', 'employer']}>
              {user?.role === 'employer' ? <Profile /> : <EmployeeProfile />}
            </ProtectedRoute>
          } />

          {/* Protected Employer Only Routes */}
          <Route path="/employer/jobs" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerJobs />
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute allowedRoles={['employee', 'employer']}>
              <EmployerMessages />
            </ProtectedRoute>
          } />

          {/* Admin Only Routes */}
          <Route path="/admin/skills" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSkills />
            </ProtectedRoute>
          } />

          <Route path="/admin/employers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEmployers />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['employee', 'employer']}>
              <NotificationPage />
            </ProtectedRoute>
          } />

          {/* Catch-all: Redirect unknown routes to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
