import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Filter, Edit, Trash2, Mail, Building, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

const AdminEmployers = () => {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEmployer, setCurrentEmployer] = useState(null);

    const fetchEmployers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/employers`);
            setEmployers(res.data.data);
        } catch (err) {
            console.error('Error fetching employers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employer account and all associated jobs/company data?')) {
            try {
                await axios.delete(`${API_BASE_URL}/admin/employers/${id}`);
                setEmployers(employers.filter(emp => emp._id !== id));
            } catch (err) {
                alert('Failed to delete employer');
            }
        }
    };

    const handleEdit = (employer) => {
        setCurrentEmployer(employer);
        setShowModal(true);
    };

    const filteredEmployers = employers.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container admin-page">
            <header className="page-header">
                <div>
                    <h1>Manage Employers</h1>
                    <p>Admin panel to oversee all employer accounts</p>
                </div>
            </header>

            <div className="filter-bar card">
                <div className="search-group">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search employers by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="stats-mini">
                    <span>Total Employers: {employers.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading employers...</div>
            ) : (
                <div className="admin-list card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployers.length > 0 ? (
                                filteredEmployers.map(emp => (
                                    <tr key={emp._id}>
                                        <td>
                                            <div className="user-info-cell">
                                                <div className="avatar-sm">{emp.name.charAt(0)}</div>
                                                <span>{emp.name}</span>
                                            </div>
                                        </td>
                                        <td>{emp.email}</td>
                                        <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon" onClick={() => handleEdit(emp)} title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(emp._id)} title="Delete">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="empty-table">No employers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <EmployerEditModal 
                        employer={currentEmployer} 
                        onClose={() => setShowModal(false)} 
                        onSuccess={fetchEmployers} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const EmployerEditModal = ({ employer, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: employer.name,
        email: employer.email
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/admin/employers/${employer._id}`, formData);
            onSuccess();
            onClose();
        } catch (err) {
            alert('Update failed');
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
                    <h2>Edit Employer Account</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="job-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Update Account'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminEmployers;
