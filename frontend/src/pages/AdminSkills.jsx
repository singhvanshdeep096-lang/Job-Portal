import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

const AdminSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentSkill, setCurrentSkill] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: 'Technical' });
    const [status, setStatus] = useState({ type: '', message: '' });

    const fetchSkills = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/skills`);
            setSkills(res.data.data);
        } catch (err) {
            console.error('Error fetching skills', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentSkill) {
                await axios.put(`${API_BASE_URL}/skills/${currentSkill._id}`, formData);
                setStatus({ type: 'success', message: 'Skill updated successfully' });
            } else {
                await axios.post(`${API_BASE_URL}/skills`, formData);
                setStatus({ type: 'success', message: 'Skill added successfully' });
            }
            fetchSkills();
            setShowModal(false);
            setFormData({ name: '', category: 'Technical' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Action failed' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this skill? This cannot be undone.')) {
            try {
                await axios.delete(`${API_BASE_URL}/skills/${id}`);
                setSkills(skills.filter(s => s._id !== id));
            } catch (err) {
                alert('Failed to delete skill');
            }
        }
    };

    const openModal = (skill = null) => {
        setCurrentSkill(skill);
        setFormData(skill ? { name: skill.name, category: skill.category } : { name: '', category: 'Technical' });
        setShowModal(true);
    };

    const filteredSkills = skills.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container admin-skills-page" style={{ padding: '3rem 1rem' }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Zap size={32} color="var(--primary)" /> Skill Management
                    </h1>
                    <p>Centralized control for all skills available on the platform.</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={20} /> Add New Skill
                </button>
            </header>

            {status.message && (
                <div className={`alert-box ${status.type === 'success' ? 'success-alert' : 'error-alert'}`} style={{ marginBottom: '2rem' }}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {status.message}
                </div>
            )}

            <div className="filter-bar card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Search size={20} className="text-secondary" />
                <input
                    type="text"
                    placeholder="Search skills by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem' }}
                />
            </div>

            {loading ? (
                <div className="loading-state">Loading skills...</div>
            ) : (
                <div className="skills-table-container card" style={{ overflow: 'hidden', padding: 0 }}>
                    <table className="applications-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Skill Name</th>
                                <th>Category</th>
                                <th>Added On</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSkills.map(skill => (
                                <tr key={skill._id}>
                                    <td>
                                        <div style={{ fontWeight: '700', color: 'var(--dark)' }}>{skill.name}</div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${skill.category === 'Technical' ? 'shortlisted' : 'pending'}`}>
                                            {skill.category}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                                        {new Date(skill.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="btn-icon" onClick={() => openModal(skill)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(skill._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay">
                        <motion.div
                            className="modal-content card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-header">
                                <h2>{currentSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
                                <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Skill Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g. React.js, Python, Project Management"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Technical</option>
                                        <option>Soft Skill</option>
                                        <option>Language</option>
                                        <option>Tool</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">
                                        {currentSkill ? 'Update Skill' : 'Create Skill'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSkills;
