import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Clock, Briefcase, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';
import './Notifications.css';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/notifications`);
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Error fetching notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_BASE_URL}/notifications/read-all`);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            alert('Failed to update notifications');
        }
    };

    if (loading) return <div className="loading-spinner">Loading Notifications...</div>;

    return (
        <div className="container notification-page">
            <header className="page-header">
                <div>
                    <h1>Your Notifications</h1>
                    <p>Stay updated with the latest jobs and application status</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>
                        Mark all as read
                    </button>
                )}
            </header>

            <div className="notification-full-list">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <motion.div 
                            key={notif._id} 
                            className={`notification-card card glass ${!notif.isRead ? 'unread' : ''}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="notif-main">
                                <div className={`notif-icon-large ${notif.type}`}>
                                    {notif.type === 'job_posted' ? <Briefcase size={24} /> : <CheckCircle size={24} />}
                                </div>
                                <div className="notif-body">
                                    <div className="notif-header">
                                        <h3>{notif.title}</h3>
                                        <span className="notif-date"><Clock size={14} /> {new Date(notif.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p>{notif.message}</p>
                                    {notif.job && (
                                        <div className="notif-job-ref">
                                            <Link to={`/jobs/${notif.job._id || notif.job}`} className="btn btn-primary btn-sm">
                                                View Job Details
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-state-card card">
                        <Bell size={64} color="#cbd5e1" />
                        <h2>No notifications yet</h2>
                        <p>We'll notify you here when new jobs match your profile or your applications are updated.</p>
                        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
