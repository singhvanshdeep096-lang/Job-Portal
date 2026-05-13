import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter, Edit, Trash2, MapPin, DollarSign, Calendar, MoreVertical, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const { user } = useAuth();

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/jobs`);
            // Filter only this employer's jobs
            const myJobs = res.data.data.filter(job => job.employer === user._id);
            setJobs(myJobs);
        } catch (err) {
            console.error('Error fetching jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`${API_BASE_URL}/jobs/${id}`);
                setJobs(jobs.filter(job => job._id !== id));
            } catch (err) {
                alert('Failed to delete job');
            }
        }
    };

    const handleEdit = (job) => {
        setCurrentJob(job);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setCurrentJob(null);
        setShowModal(true);
    };

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container job-management-page">
            <header className="page-header">
                <div>
                    <h1>Manage Job Postings</h1>
                    <p>Create and monitor your active job openings</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={20} /> Post New Job
                </button>
            </header>

            <div className="filter-bar card">
                <div className="search-group">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search jobs by title or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-actions">
                    <button className="btn btn-outline btn-sm">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading your jobs...</div>
            ) : (
                <div className="jobs-list">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <JobCard 
                                key={job._id} 
                                job={job} 
                                onEdit={() => handleEdit(job)} 
                                onDelete={() => handleDelete(job._id)} 
                            />
                        ))
                    ) : (
                        <div className="empty-state card">
                            <Briefcase size={48} />
                            <h3>No jobs found</h3>
                            <p>You haven't posted any jobs yet or none match your search.</p>
                            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>Post Your First Job</button>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <JobModal 
                        job={currentJob} 
                        onClose={() => setShowModal(false)} 
                        onSuccess={fetchJobs} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const JobCard = ({ job, onEdit, onDelete }) => (
    <motion.div 
        className="card job-card-wide"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
    >
        <div className="job-info-main">
            <div className="job-title-row">
                <h3>{job.title}</h3>
                <span className={`status-badge ${job.status}`}>{job.status}</span>
            </div>
            <div className="job-meta">
                <span><MapPin size={14} /> {job.location}</span>
                <span><DollarSign size={14} /> {job.salary}</span>
                <span><Calendar size={14} /> Expires: {new Date(job.deadline).toLocaleDateString()}</span>
            </div>
            <div className="job-skills">
                {job.skillsRequired.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                ))}
            </div>
        </div>
        <div className="job-actions">
            <button className="btn-icon" onClick={onEdit} title="Edit Job">
                <Edit size={18} />
            </button>
            <button className="btn-icon btn-icon-danger" onClick={onDelete} title="Delete Job">
                <Trash2 size={18} />
            </button>
        </div>
    </motion.div>
);

const JobModal = ({ job, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(job || {
        title: '',
        description: '',
        location: '',
        salary: '',
        deadline: '',
        skillsRequired: '',
        type: 'Full-time'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Format skills as array
        const processedData = {
            ...formData,
            skillsRequired: typeof formData.skillsRequired === 'string' 
                ? formData.skillsRequired.split(',').map(s => s.trim()) 
                : formData.skillsRequired
        };

        try {
            if (job) {
                await axios.put(`${API_BASE_URL}/jobs/${job._id}`, processedData);
            } else {
                await axios.post(`${API_BASE_URL}/jobs`, processedData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <motion.div 
                className="modal-content card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <div className="modal-header">
                    <h2>{job ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="job-form">
                    <div className="input-group">
                        <label>Job Title</label>
                        <input 
                            type="text" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Location</label>
                            <input 
                                type="text" 
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <label>Salary Range</label>
                            <input 
                                type="text" 
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                required 
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Skills Required (comma separated)</label>
                        <input 
                            type="text" 
                            value={formData.skillsRequired}
                            onChange={(e) => setFormData({...formData, skillsRequired: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea 
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required 
                        ></textarea>
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Job Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Application Deadline</label>
                            <input 
                                type="date" 
                                value={formData.deadline ? formData.deadline.split('T')[0] : ''}
                                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                required 
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Job Posting'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default JobManagement;
