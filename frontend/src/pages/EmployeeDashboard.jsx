import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Bookmark, Bell, ChevronRight, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';
import LatestJobs from '../components/LatestJobs';

const EmployeeDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/employee/dashboard`);
                setStats(res.data.data);
            } catch (err) {
                console.error('Error fetching dashboard stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const data = [
        { name: 'Mon', apps: 2 },
        { name: 'Tue', apps: 5 },
        { name: 'Wed', apps: 3 },
        { name: 'Thu', apps: 8 },
        { name: 'Fri', apps: 6 },
        { name: 'Sat', apps: 2 },
        { name: 'Sun', apps: 4 },
    ];

    if (loading) return <div className="loading-spinner">Loading Dashboard...</div>;

    return (
        <div className="dashboard-container container">
            <header className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, <span className="text-gradient">{user?.name}</span>!</h1>
                    <p>Here's what's happening with your job search today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-icon">
                        <Bell size={20} />
                        <span className="notification-dot"></span>
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard 
                    icon={<Briefcase size={24} color="#6366f1" />} 
                    title="Applied Jobs" 
                    value={stats?.appliedCount || 0} 
                    trend="+12%"
                    color="indigo"
                />
                <StatCard 
                    icon={<Bookmark size={24} color="#f59e0b" />} 
                    title="Saved Jobs" 
                    value={stats?.savedCount || 0} 
                    trend="+5%"
                    color="amber"
                />
                <StatCard 
                    icon={<TrendingUp size={24} color="#10b981" />} 
                    title="Profile Views" 
                    value="128" 
                    trend="+24%"
                    color="emerald"
                />
                <StatCard 
                    icon={<CheckCircle size={24} color="#8b5cf6" />} 
                    title="Interviews" 
                    value="3" 
                    trend="New"
                    color="violet"
                />
            </div>

            <div className="dashboard-main-grid">
                <section className="chart-section card glass">
                    <div className="card-header">
                        <h3>Application Activity</h3>
                        <select className="select-sm">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="apps" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="recent-apps-section card glass">
                    <div className="card-header">
                        <h3>Recent Applications</h3>
                        <Link to="/applications" className="link-primary">View All</Link>
                    </div>
                    <div className="recent-list">
                        {stats?.recentApplications?.length > 0 ? (
                            stats.recentApplications.map(app => (
                                <div key={app._id} className="recent-item">
                                    <div className="item-icon">
                                        <Briefcase size={18} />
                                    </div>
                                    <div className="item-info">
                                        <h4>{app.job?.title}</h4>
                                        <p>{app.job?.company?.name || 'Company Name'}</p>
                                    </div>
                                    <div className="item-meta">
                                        <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                                        <span className="time"><Clock size={12} /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-mini">No recent applications</div>
                        )}
                    </div>
                </section>
            </div>

            <section className="recommended-section">
                <LatestJobs />
            </section>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend, color }) => (
    <motion.div 
        className={`stat-card card glass border-${color}`}
        whileHover={{ y: -5 }}
    >
        <div className="stat-icon-wrapper">
            {icon}
        </div>
        <div className="stat-content">
            <p className="stat-title">{title}</p>
            <h2 className="stat-value">{value}</h2>
            <span className={`stat-trend ${trend.startsWith('+') ? 'positive' : ''}`}>{trend}</span>
        </div>
    </motion.div>
);

export default EmployeeDashboard;
