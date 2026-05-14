import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Clock, CheckCircle, Briefcase, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const socket = useSocket();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/notifications`);
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on('new_job_notification', (data) => {
                setNotifications(prev => [{
                    _id: Date.now().toString(),
                    title: data.title,
                    message: data.message,
                    createdAt: new Date(),
                    isRead: false,
                    job: data.jobId
                }, ...prev]);
            });
        }

        return () => {
            if (socket) socket.off('new_job_notification');
        };
    }, [socket]);

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="notification-wrapper">
            <button className="btn-icon" onClick={() => setShowDropdown(!showDropdown)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            <AnimatePresence>
                {showDropdown && (
                    <>
                        <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}></div>
                        <motion.div 
                            className="notification-dropdown card glass"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        >
                            <div className="dropdown-header">
                                <h3>Notifications</h3>
                                {unreadCount > 0 && <button className="btn-link">Mark all as read</button>}
                            </div>
                            
                            <div className="notification-list">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div 
                                            key={notif._id} 
                                            className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                                        >
                                            <div className="notif-icon">
                                                {notif.type === 'job_posted' ? <Briefcase size={16} /> : <CheckCircle size={16} />}
                                            </div>
                                            <div className="notif-content">
                                                <h4>{notif.title}</h4>
                                                <p>{notif.message}</p>
                                                <span className="notif-time"><Clock size={12} /> {new Date(notif.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                            {notif.job && (
                                                <Link to={`/jobs/${notif.job._id || notif.job}`} className="notif-action">
                                                    <ExternalLink size={14} />
                                                </Link>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-notif">No notifications yet</div>
                                )}
                            </div>
                            <div className="dropdown-footer">
                                <Link to="/notifications" onClick={() => setShowDropdown(false)}>View All Notifications</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
