import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Briefcase, IndianRupee, Filter, Bookmark, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Jobs.css';

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        type: '',
        salary: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/jobs`);
                setJobs(res.data.data);
            } catch (err) {
                console.error('Error fetching jobs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleSearch = () => {
        // Trigger a re-filter or fresh fetch if needed
        // For now, filtering is done on the fly, so we just log or ensure focus
        console.log('Searching for:', searchTerm, filters);
    };

    const handleSaveJob = async (jobId) => {
        try {
            await axios.post(`${API_BASE_URL}/employee/saved-jobs/${jobId}`);
            alert('Job saved successfully! You can view it in your Saved Jobs section.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save job');
        }
    };

    const parseSalary = (salaryStr) => {
        if (!salaryStr) return 0;
        const clean = salaryStr.toLowerCase().replace(/[^\d.klm]/g, '');
        if (clean.includes('k')) {
            return parseFloat(clean.replace('k', '')) * 1000;
        }
        if (clean.includes('l')) {
            return parseFloat(clean.replace('l', '')) * 100000;
        }
        if (clean.includes('m')) {
            return parseFloat(clean.replace('m', '')) * 1000000;
        }
        return parseFloat(clean) || 0;
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesType = !filters.type || job.type === filters.type;
        
        let matchesSalary = true;
        if (filters.salary) {
            const salaryValue = parseSalary(job.salary);
            if (filters.salary === '₹3L - ₹6L') {
                matchesSalary = salaryValue >= 300000 && salaryValue <= 600000;
            } else if (filters.salary === '₹6L - ₹12L') {
                matchesSalary = salaryValue > 600000 && salaryValue <= 1200000;
            } else if (filters.salary === '₹12L+') {
                matchesSalary = salaryValue > 1200000;
            }
        }

        return matchesSearch && matchesLocation && matchesType && matchesSalary;
    });

    return (
        <div className="job-search-page container">
            <section className="search-hero">
                <h1>Find Your <span className="text-gradient">Dream Job</span></h1>
                <p>Browse thousands of job opportunities from top companies.</p>
                <div className="search-box card glass">
                    <div className="search-input">
                        <Search size={20} />
                        <input 
                            type="text" 
                            placeholder="Job title, keywords, or company..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="search-input border-left">
                        <MapPin size={20} />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleSearch}>Search Jobs</button>
                </div>
            </section>

            <div className="search-layout">
                <aside className="search-filters">
                    <div className="card glass">
                        <h3>Filters</h3>
                        <div className="filter-group">
                            <label>Job Type</label>
                            <select 
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                            >
                                <option value="">All Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Salary Range</label>
                            <select 
                                value={filters.salary}
                                onChange={(e) => setFilters({...filters, salary: e.target.value})}
                            >
                                <option value="">Any Salary</option>
                                <option>₹3L - ₹6L</option>
                                <option>₹6L - ₹12L</option>
                                <option>₹12L+</option>
                            </select>
                        </div>
                    </div>
                </aside>

                <main className="search-results">
                    <div className="results-header">
                        <p>Showing <strong>{filteredJobs.length}</strong> jobs</p>
                        <div className="sort-group">
                            <span>Sort by:</span>
                            <select className="select-sm">
                                <option>Most Recent</option>
                                <option>Salary (High to Low)</option>
                            </select>
                        </div>
                    </div>

                    <div className="jobs-list-vertical">
                        {loading ? (
                            <div className="loading-state">Finding jobs...</div>
                        ) : filteredJobs.length > 0 ? (
                            <AnimatePresence>
                                {filteredJobs.map((job, index) => (
                                    <motion.div 
                                        key={job._id} 
                                        className="job-card-wide card glass"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="job-card-content">
                                            <div className="company-logo">
                                                {job.company?.name?.charAt(0)}
                                            </div>
                                            <div className="job-info">
                                                <div className="job-title-row">
                                                    <h3>{job.title}</h3>
                                                    <button 
                                                        className="btn-bookmark"
                                                        onClick={() => handleSaveJob(job._id)}
                                                        title="Save Job"
                                                    >
                                                        <Bookmark size={18} />
                                                    </button>
                                                </div>
                                                <p className="company-name">{job.company?.name || 'Company Name'}</p>
                                                <div className="job-meta">
                                                    <span><MapPin size={14} /> {job.location}</span>
                                                    <span><Briefcase size={14} /> {job.type}</span>
                                                    <span><IndianRupee size={14} /> {job.salary}</span>
                                                </div>
                                                <div className="job-tags">
                                                    {job.skillsRequired?.slice(0, 3).map(skill => (
                                                        <span key={skill} className="skill-tag">{skill}</span>
                                                    ))}
                                                    {job.skillsRequired?.length > 3 && <span>+{job.skillsRequired.length - 3} more</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="job-card-actions">
                                            <Link to={`/jobs/${job._id}`} className="btn btn-outline">Details</Link>
                                            <Link to={`/jobs/${job._id}`} className="btn btn-primary">Apply Now</Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="empty-state card">
                                <h3>No jobs found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobSearch;
