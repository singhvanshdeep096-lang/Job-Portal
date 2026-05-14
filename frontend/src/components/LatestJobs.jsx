import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const LatestJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/jobs?limit=5&sort=-createdAt`);
                setJobs(res.data.data);
            } catch (err) {
                console.error('Error fetching latest jobs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="loading-state-mini">Loading latest jobs...</div>;

    return (
        <div className="latest-jobs-container">
            <div className="section-header">
                <h3>Latest Job Openings</h3>
                <Link to="/jobs" className="link-primary">See All Jobs</Link>
            </div>
            <div className="jobs-feed">
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <div key={job._id} className="job-feed-item card glass">
                            <div className="job-feed-main">
                                <div className="company-badge">
                                    {job.company?.name?.charAt(0)}
                                </div>
                                <div className="job-feed-info">
                                    <h4>{job.title}</h4>
                                    <p className="company-name">{job.company?.name}</p>
                                    <div className="job-feed-meta">
                                        <span><MapPin size={12} /> {job.location}</span>
                                        <span><DollarSign size={12} /> {job.salary}</span>
                                        <span><Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="job-feed-actions">
                                <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                                    View & Apply <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-mini">No jobs available at the moment.</div>
                )}
            </div>
        </div>
    );
};

export default LatestJobs;
