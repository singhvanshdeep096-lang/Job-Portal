import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
    Briefcase, Users, CheckCircle, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass chart-tooltip">
                <p className="tooltip-label">{label}</p>
                <p className="tooltip-value">
                    <span className="dot" style={{ backgroundColor: payload[0].fill }}></span>
                    {payload[0].name}: <strong>{payload[0].value}</strong>
                </p>
            </div>
        );
    }
    return null;
};

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

    if (loading) return (
        <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading your insights...</p>
        </div>
    );

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
    const totalApps = metrics?.totalApplications || 0;

    return (
        <div className="container dashboard-page">
            <header className="dashboard-header">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, {user.name.split(' ')[0]}! Here's your hiring snapshot.</p>
                </motion.div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => window.location.href='/employer/jobs'}>
                        Post New Job
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard 
                    icon={<Briefcase size={24} />} 
                    label="Active Jobs" 
                    value={metrics?.activeJobs || 0} 
                    trend="Live listings"
                    variant="primary"
                    delay={0.1}
                />
                <StatCard 
                    icon={<Users size={24} />} 
                    label="Total Apps" 
                    value={totalApps} 
                    trend="Candidate interest"
                    variant="success"
                    delay={0.2}
                />
                <StatCard 
                    icon={<CheckCircle size={24} />} 
                    label="Shortlisted" 
                    value={metrics?.shortlisted || 0} 
                    trend="Ready for interview"
                    variant="warning"
                    delay={0.3}
                />
                <StatCard 
                    icon={<Clock size={24} />} 
                    label="Pending" 
                    value={(totalApps - metrics?.shortlisted - metrics?.hired) || 0} 
                    trend="Awaiting review"
                    variant="danger"
                    delay={0.4}
                />
            </div>

            <div className="charts-grid">
                <motion.div 
                    className="card chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="chart-header">
                        <h3>Applications Distribution</h3>
                        <p>Number of candidates per job post</p>
                    </div>
                    <div className="chart-container" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.applicationsPerJob || []} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="title" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar 
                                    dataKey="count" 
                                    name="Applications"
                                    fill="url(#barGradient)" 
                                    radius={[6, 6, 0, 0]} 
                                    barSize={32}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    className="card chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="chart-header">
                        <h3>Hiring Progress</h3>
                        <p>Overall application status</p>
                    </div>
                    <div className="chart-container" style={{ height: '350px', position: 'relative' }}>
                        <div className="chart-center-label">
                            <span className="total-num">{totalApps}</span>
                            <span className="total-text">Total</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Shortlisted', value: metrics?.shortlisted || 0 },
                                        { name: 'Hired', value: metrics?.hired || 0 },
                                        { name: 'Pending', value: (totalApps - metrics?.shortlisted - metrics?.hired) || 0 }
                                    ]}
                                    innerRadius={85}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {COLORS.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    iconType="circle" 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    formatter={(value) => <span style={{ color: '#64748b', fontWeight: 500, fontSize: '14px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, variant, delay }) => (
    <motion.div 
        className={`card stat-card ${variant}`}
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
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
