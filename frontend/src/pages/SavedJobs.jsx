import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, MapPin, Briefcase, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './SavedJobs.css';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/employee/saved-jobs`);
            setSavedJobs(res.data.data);
        } catch (err) {
            console.error('Error fetching saved jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const removeSavedJob = async (jobId) => {
        try {
            await axios.delete(`${API_BASE_URL}/employee/saved-jobs/${jobId}`);
            setSavedJobs(savedJobs.filter(item => item.job._id !== jobId));
        } catch (err) {
            alert('Failed to remove job');
        }
    };

    return (
        <div className="saved-jobs-page container">
            <header className="page-header">
                <div>
                    <h1>Saved <span className="text-gradient">Jobs</span></h1>
                    <p>Keep track of opportunities you're interested in.</p>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">Loading your saved jobs...</div>
            ) : savedJobs.length > 0 ? (
                <div className="saved-grid">
                    <AnimatePresence>
                        {savedJobs.map(item => (
                            <motion.div 
                                key={item._id} 
                                className="saved-card card glass"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="saved-card-body">
                                    <div className="company-info">
                                        <div className="company-logo-sm">
                                            {item.job.company?.name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h3>{item.job.title}</h3>
                                            <p>{item.job.company?.name || 'Company Name'}</p>
                                        </div>
                                    </div>
                                    <div className="job-meta-mini">
                                        <span><MapPin size={14} /> {item.job.location}</span>
                                        <span><Briefcase size={14} /> {item.job.type}</span>
                                    </div>
                                </div>
                                <div className="saved-card-footer">
                                    <button 
                                        className="btn-icon-danger" 
                                        onClick={() => removeSavedJob(item.job._id)}
                                        title="Remove from saved"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="footer-links">
                                        <Link to={`/jobs/${item.job._id}`} className="btn btn-primary btn-sm">
                                            Apply Now <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="empty-state-large card glass">
                    <Bookmark size={64} color="#94a3b8" />
                    <h2>No saved jobs yet</h2>
                    <p>Start browsing jobs and save the ones that catch your eye.</p>
                    <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
