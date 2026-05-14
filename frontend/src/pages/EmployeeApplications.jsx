import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const EmployeeApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/employee/applications`);
                setApplications(res.data.data);
            } catch (err) {
                console.error('Error fetching applications', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'status-pending';
            case 'shortlisted': return 'status-success';
            case 'rejected': return 'status-danger';
            case 'hired': return 'status-premium';
            default: return 'status-gray';
        }
    };

    return (
        <div className="applications-page container">
            <header className="page-header">
                <div>
                    <h1>My <span className="text-gradient">Applications</span></h1>
                    <p>Track the status of your job applications in real-time.</p>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">Updating your application statuses...</div>
            ) : applications.length > 0 ? (
                <div className="apps-list-container">
                    {applications.map((app, index) => (
                        <motion.div 
                            key={app._id} 
                            className="app-item-card card glass"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="app-main-info">
                                <div className="company-badge">
                                    {app.job?.company?.name?.charAt(0) || 'C'}
                                </div>
                                <div className="job-info">
                                    <h3>{app.job?.title}</h3>
                                    <p className="company-text">{app.job?.company?.name || 'Company Name'}</p>
                                    <div className="app-meta">
                                        <span><MapPin size={14} /> {app.job?.location}</span>
                                        <span><Clock size={14} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="app-status-info">
                                <div className={`status-pill ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </div>
                                <Link to={`/jobs/${app.job?._id}`} className="btn-icon" title="View Job Details">
                                    <ExternalLink size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="empty-state-large card glass">
                    <AlertCircle size={64} color="#94a3b8" />
                    <h2>No applications yet</h2>
                    <p>You haven't applied for any jobs. Start your journey today!</p>
                    <Link to="/jobs" className="btn btn-primary">Find Jobs</Link>
                </div>
            )}
        </div>
    );
};

export default EmployeeApplications;
