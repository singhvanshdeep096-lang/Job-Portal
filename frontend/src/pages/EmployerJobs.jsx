import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Search, Filter, Edit, Trash2, MapPin, IndianRupee, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';
import './JobManagement.css';

const EmployerJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const { user } = useAuth();
    const toast = useToast();

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/employer/jobs`);
            setJobs(res.data.data);
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
                await axios.delete(`${API_BASE_URL}/employer/jobs/${id}`);
                setJobs(jobs.filter(job => job._id !== id));
                toast.success('Job posting deleted successfully');
            } catch (err) {
                toast.error('Failed to delete job');
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
                <span><IndianRupee size={14} /> {job.salary}</span>
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
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.salary.trim()) newErrors.salary = 'Salary range is required';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        else if (new Date(formData.deadline) < new Date()) newErrors.deadline = 'Deadline must be in the future';
        if (!formData.skillsRequired) newErrors.skillsRequired = 'At least one skill is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        // ...
        
        const processedData = {
            ...formData,
            skillsRequired: typeof formData.skillsRequired === 'string' 
                ? formData.skillsRequired.split(',').map(s => s.trim()) 
                : formData.skillsRequired
        };

        try {
            if (job) {
                await axios.put(`${API_BASE_URL}/employer/jobs/${job._id}`, processedData);
                toast.success('Job posting updated!');
            } else {
                await axios.post(`${API_BASE_URL}/employer/jobs`, processedData);
                toast.success('New job posted successfully!');
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
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
                        <label>Job Title <span className="required-star">*</span></label>
                        <input 
                            type="text" 
                            className={errors.title ? 'invalid' : ''}
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({...formData, title: e.target.value});
                                if (errors.title) setErrors({...errors, title: null});
                            }}
                        />
                        {errors.title && <span className="error-text"><AlertCircle size={12} /> {errors.title}</span>}
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Location <span className="required-star">*</span></label>
                            <input 
                                type="text" 
                                className={errors.location ? 'invalid' : ''}
                                value={formData.location}
                                onChange={(e) => {
                                    setFormData({...formData, location: e.target.value});
                                    if (errors.location) setErrors({...errors, location: null});
                                }}
                            />
                            {errors.location && <span className="error-text"><AlertCircle size={12} /> {errors.location}</span>}
                        </div>
                        <div className="input-group">
                            <label>Salary Range <span className="required-star">*</span></label>
                            <div className="input-with-icon">
                                <IndianRupee size={16} className="input-icon-left" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. 5L - 8L"
                                    className={errors.salary ? 'invalid pl-10' : 'pl-10'}
                                    value={formData.salary}
                                    onChange={(e) => {
                                        setFormData({...formData, salary: e.target.value});
                                        if (errors.salary) setErrors({...errors, salary: null});
                                    }}
                                />
                            </div>
                            {errors.salary && <span className="error-text"><AlertCircle size={12} /> {errors.salary}</span>}
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Skills Required (comma separated) <span className="required-star">*</span></label>
                        <input 
                            type="text" 
                            className={errors.skillsRequired ? 'invalid' : ''}
                            value={formData.skillsRequired}
                            onChange={(e) => {
                                setFormData({...formData, skillsRequired: e.target.value});
                                if (errors.skillsRequired) setErrors({...errors, skillsRequired: null});
                            }}
                        />
                        {errors.skillsRequired && <span className="error-text"><AlertCircle size={12} /> {errors.skillsRequired}</span>}
                    </div>
                    <div className="input-group">
                        <label>Description <span className="required-star">*</span></label>
                        <textarea 
                            rows="4"
                            className={errors.description ? 'invalid' : ''}
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({...formData, description: e.target.value});
                                if (errors.description) setErrors({...errors, description: null});
                            }}
                        ></textarea>
                        {errors.description && <span className="error-text"><AlertCircle size={12} /> {errors.description}</span>}
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
                            <label>Application Deadline <span className="required-star">*</span></label>
                            <input 
                                type="date" 
                                className={errors.deadline ? 'invalid' : ''}
                                value={formData.deadline ? formData.deadline.split('T')[0] : ''}
                                onChange={(e) => {
                                    setFormData({...formData, deadline: e.target.value});
                                    if (errors.deadline) setErrors({...errors, deadline: null});
                                }}
                            />
                            {errors.deadline && <span className="error-text"><AlertCircle size={12} /> {errors.deadline}</span>}
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

export default EmployerJobs;
