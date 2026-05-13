import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Building, Globe, Mail, Phone, MapPin, Upload, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';
const Profile = () => {
    const { user } = useAuth();
    
    // Render Employer/Company Profile
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [company, setCompany] = useState({
        name: '', description: '', website: '', contactEmail: '', contactPhone: '', address: '', logo: ''
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/company`);
                if (res.data.data) {
                    setCompany(res.data.data);
                }
            } catch (err) {
                console.error('Company details not found');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'employer') {
            fetchCompany();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleEmployerSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await axios.post(`${API_BASE_URL}/company`, company);
            setCompany(res.data.data);
            setMessage({ type: 'success', text: 'Company profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div className="container profile-page">
            <header className="page-header">
                <div>
                    <h1>Company Profile</h1>
                    <p>Tell candidates about your company culture and mission</p>
                </div>
            </header>

            <div className="profile-grid">
                <motion.div 
                    className="card profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <form onSubmit={handleEmployerSubmit}>
                        <div className="profile-header-edit">
                            <div className="logo-upload">
                                {company.logo ? (
                                    <img src={company.logo} alt="Logo" className="profile-logo-preview" />
                                ) : (
                                    <div className="logo-placeholder"><Building size={32} /></div>
                                )}
                                <button type="button" className="btn-upload">
                                    <Upload size={16} /> Update Logo
                                </button>
                            </div>
                            <div className="header-inputs">
                                <div className="input-group">
                                    <label>Company Name</label>
                                    <input 
                                        type="text" 
                                        value={company.name}
                                        onChange={(e) => setCompany({...company, name: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Website URL</label>
                                    <div className="input-wrapper">
                                        <Globe size={18} className="input-icon" />
                                        <input 
                                            type="url" 
                                            value={company.website}
                                            onChange={(e) => setCompany({...company, website: e.target.value})}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Company Description</label>
                            <textarea 
                                rows="6"
                                value={company.description}
                                onChange={(e) => setCompany({...company, description: e.target.value})}
                                placeholder="Describe what your company does, your values, and why people should work with you..."
                            ></textarea>
                        </div>

                        <div className="grid-2">
                            <div className="input-group">
                                <label>Contact Email</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input 
                                        type="email" 
                                        value={company.contactEmail}
                                        onChange={(e) => setCompany({...company, contactEmail: e.target.value})}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Contact Phone</label>
                                <div className="input-wrapper">
                                    <Phone size={18} className="input-icon" />
                                    <input 
                                        type="tel" 
                                        value={company.contactPhone}
                                        onChange={(e) => setCompany({...company, contactPhone: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Office Address</label>
                            <div className="input-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <input 
                                    type="text" 
                                    value={company.address}
                                    onChange={(e) => setCompany({...company, address: e.target.value})}
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`${message.type}-alert alert-box`}>
                                {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Update Company Profile'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                <div className="profile-sidebar">
                    <div className="card info-card">
                        <h3>Profile Completion</h3>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: company.name && company.description && company.website ? '100%' : '60%' }}></div>
                        </div>
                        <p className="progress-text">{company.name && company.description && company.website ? '100%' : '60%'} Complete</p>
                        <ul className="todo-list">
                            <li className={company.name ? 'done' : ''}>Company Name</li>
                            <li className={company.website ? 'done' : ''}>Website</li>
                            <li className={company.description ? 'done' : ''}>Description</li>
                            <li>Company Logo</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
