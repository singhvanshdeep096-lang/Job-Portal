import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';
import { 
    Briefcase, Users, CheckCircle, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const EmployerDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/employer/dashboard`);
                setMetrics(res.data.data);
            } catch (err) {
                console.error('Error fetching employer metrics', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchMetrics();
    }, [user]);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading dashboard...</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="container dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Welcome back, {user.name}</h1>
                    <p>Here's what's happening with your recruitment today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => window.location.href='/jobs'}>Manage Jobs</button>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard 
                    icon={<Briefcase />} 
                    label="Active Jobs" 
                    value={metrics?.activeJobs || 0} 
                    trend="Jobs currently open"
                    variant="primary"
                />
                <StatCard 
                    icon={<Users />} 
                    label="Total Applications" 
                    value={metrics?.totalApplications || 0} 
                    trend="Combined interest"
                    variant="success"
                />
                <StatCard 
                    icon={<CheckCircle />} 
                    label="Shortlisted" 
                    value={metrics?.shortlisted || 0} 
                    trend="Ready to interview"
                    variant="warning"
                />
                <StatCard 
                    icon={<Clock />} 
                    label="Pending Review" 
                    value={(metrics?.totalApplications - metrics?.shortlisted - metrics?.hired) || 0} 
                    trend="Needs attention"
                    variant="danger"
                />
            </div>

            <div className="charts-grid">
                <div className="card chart-card">
                    <h3>Applications per Job</h3>
                    <div className="chart-container" style={{ height: '300px', marginTop: '1.5rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.applicationsPerJob || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="title" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>Hiring Funnel</h3>
                    <div className="chart-container" style={{ height: '300px', marginTop: '1.5rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Shortlisted', value: metrics?.shortlisted || 0 },
                                        { name: 'Hired', value: metrics?.hired || 0 },
                                        { name: 'Pending', value: (metrics?.totalApplications - metrics?.shortlisted - metrics?.hired) || 0 }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {COLORS.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, variant }) => (
    <motion.div 
        className={`card stat-card ${variant}`}
        whileHover={{ y: -5 }}
    >
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <p className="stat-label">{label}</p>
            <h2 className="stat-value">{value}</h2>
            <p className="stat-trend">{trend}</p>
        </div>
    </motion.div>
);

export default EmployerDashboard;
