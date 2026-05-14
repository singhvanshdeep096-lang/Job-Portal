import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    MapPin, DollarSign, Calendar, Briefcase, Clock,
    ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
                setJob(res.data.data);
            } catch (err) {
                console.error('Error fetching job details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading job details...</div>;
    if (!job) return <div className="container">Job not found.</div>;

    return (
        <div className="container job-details-page" style={{ padding: '3rem 1rem' }}>
            <Link to="/jobs" className="btn-back" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--secondary)' }}>
                <ChevronLeft size={20} /> Back to Jobs
            </Link>

            <div className="job-details-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="job-main-content">
                    <motion.div
                        className="card job-header-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="company-logo" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                {job.company?.name?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{job.title}</h1>
                                <p style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '600' }}>{job.company?.name}</p>
                            </div>
                        </div>

                        <div className="job-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem 0', borderTop: '1px solid var(--gray-100)' }}>
                            <div className="meta-item">
                                <MapPin size={18} color="var(--primary)" />
                                <div>
                                    <label>Location</label>
                                    <p>{job.location}</p>
                                </div>
                            </div>
                            <div className="meta-item">
                                <DollarSign size={18} color="var(--primary)" />
                                <div>
                                    <label>Salary Range</label>
                                    <p>{job.salary}</p>
                                </div>
                            </div>
                            <div className="meta-item">
                                <Briefcase size={18} color="var(--primary)" />
                                <div>
                                    <label>Job Type</label>
                                    <p>{job.type}</p>
                                </div>
                            </div>
                            <div className="meta-item">
                                <Clock size={18} color="var(--primary)" />
                                <div>
                                    <label>Deadline</label>
                                    <p>{new Date(job.deadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="card job-description-card" style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>About the Role</h3>
                            {user?.role === 'employee' && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        onClick={async () => {
                                            try {
                                                await axios.post(`${API_BASE_URL}/employee/saved-jobs/${id}`);
                                                alert('Job saved successfully!');
                                            } catch (err) {
                                                alert(err.response?.data?.message || 'Failed to save job');
                                            }
                                        }}
                                    >
                                        Save Job
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to apply for this job?')) {
                                                try {
                                                    await axios.post(`${API_BASE_URL}/employee/apply/${id}`, { resume: 'link_to_resume' });
                                                    alert('Application submitted successfully!');
                                                } catch (err) {
                                                    alert(err.response?.data?.message || 'Failed to apply');
                                                }
                                            }
                                        }}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="description-text" style={{ whiteSpace: 'pre-wrap', color: 'var(--gray-500)', lineHeight: '1.8' }}>
                            {job.description}
                        </div>

                        <h3 style={{ marginTop: '2.5rem' }}>Skills Required</h3>
                        <div className="job-skills" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                            {job.skillsRequired?.map(skill => (
                                <span key={skill} className="skill-tag" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
