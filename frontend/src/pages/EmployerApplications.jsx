import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const EmployerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { user } = useAuth();

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/applications`);
            setApplications(res.data.data);
        } catch (err) {
            console.error('Error fetching applications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchApplications();
    }, [user]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/applications/${id}`, { status: newStatus });
            setApplications(applications.map(app => 
                app._id === id ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredApplications = filter === 'All' 
        ? applications 
        : applications.filter(app => app.status === filter);

    return (
        <div className="container applications-page">
            <header className="page-header">
                <div>
                    <h1>Candidate Applications</h1>
                    <p>Manage and review candidates applying for your open roles</p>
                </div>
            </header>

            <div className="filter-tabs card">
                {['All', 'Pending', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'].map(tab => (
                    <button 
                        key={tab}
                        className={`tab-btn ${filter === tab ? 'active' : ''}`}
                        onClick={() => setFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-state" style={{ textAlign: 'center', padding: '4rem' }}>Loading applications...</div>
            ) : (
                <div className="applications-table-container card">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Applied For</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map(app => (
                                    <tr key={app._id}>
                                        <td>
                                            <div className="candidate-info">
                                                <div className="avatar">{app.candidateName?.charAt(0) || 'U'}</div>
                                                <div>
                                                    <div className="candidate-name">{app.candidateName}</div>
                                                    <div className="candidate-email">{app.candidateEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="job-applied" style={{ fontWeight: '600' }}>{app.job?.title}</div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="app-actions">
                                                <select 
                                                    value={app.status}
                                                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shortlisted">Shortlisted</option>
                                                    <option value="Interviewing">Interviewing</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Hired">Hired</option>
                                                </select>
                                                {app.resume && (
                                                    <a href={`${API_BASE_URL.replace('/api/v1', '')}/${app.resume}`} target="_blank" rel="noopener noreferrer" className="btn-icon" title="View Resume">
                                                        <FileText size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-table" style={{ textAlign: 'center', padding: '4rem' }}>No applications found in this category.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployerApplications;
