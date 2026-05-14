import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Plus, Trash2, Save, FileText, Briefcase, GraduationCap, Code, Link as LinkIcon, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

const EmployeeProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [showEduForm, setShowEduForm] = useState(false);
    const [showExpForm, setShowExpForm] = useState(false);
    const [newEdu, setNewEdu] = useState({ school: '', degree: '', startYear: '', endYear: '' });
    const fileInputRef = useRef(null);
    const [newExp, setNewExp] = useState({ 
        title: '', 
        company: '', 
        location: '', 
        from: '', 
        to: '', 
        current: false, 
        description: '' 
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/employee/profile`);
                setProfile(res.data.data);
            } catch (err) {
                console.error('Error fetching profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put(`${API_BASE_URL}/employee/profile`, profile);
            setProfile(res.data.data);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const addExperience = async () => {
        if (!newExp.title || !newExp.company) return alert('Please fill in title and company');
        setSaving(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/employee/experience`, newExp);
            setProfile(res.data.data);
            setNewExp({ title: '', company: '', location: '', from: '', to: '', current: false, description: '' });
            setShowExpForm(false);
        } catch (err) {
            alert('Failed to add experience');
        } finally {
            setSaving(false);
        }
    };

    const deleteExperience = async (expId) => {
        if (!window.confirm('Delete this experience?')) return;
        setSaving(true);
        try {
            const res = await axios.delete(`${API_BASE_URL}/employee/experience/${expId}`);
            setProfile(res.data.data);
        } catch (err) {
            alert('Failed to delete experience');
        } finally {
            setSaving(false);
        }
    };

    const addEducation = () => {
        if (!newEdu.school || !newEdu.degree) return alert('Please fill in school and degree');
        const updatedEdu = [...(profile.education || []), newEdu];
        const updatedProfile = { ...profile, education: updatedEdu };
        setProfile(updatedProfile);
        setNewEdu({ school: '', degree: '', startYear: '', endYear: '' });
        setShowEduForm(false);
        // Automatically save
        saveUpdatedProfile(updatedProfile);
    };

    const deleteEducation = (index) => {
        const updatedEdu = profile.education.filter((_, i) => i !== index);
        const updatedProfile = { ...profile, education: updatedEdu };
        setProfile(updatedProfile);
        saveUpdatedProfile(updatedProfile);
    };

    const saveUpdatedProfile = async (updatedProfile) => {
        setSaving(true);
        try {
            await axios.put(`${API_BASE_URL}/employee/profile`, updatedProfile);
        } catch (err) {
            console.error('Failed to auto-save profile', err);
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setSaving(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/employee/upload-resume`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data.data);
            alert('Resume uploaded successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload resume');
        } finally {
            setSaving(false);
        }
    };

    const deleteResume = async () => {
        if (!window.confirm('Are you sure you want to delete your resume?')) return;
        setSaving(true);
        try {
            // We can just update the profile with empty resume object
            const res = await axios.put(`${API_BASE_URL}/employee/profile`, { resume: {} });
            setProfile(res.data.data);
            alert('Resume deleted successfully!');
        } catch (err) {
            alert('Failed to delete resume');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading your profile...</p>
        </div>
    );

    return (
        <div className="profile-page container">
            <div className="profile-layout">
                <aside className="profile-sidebar">
                    <div className="card glass profile-user-card">
                        <div className="avatar-wrapper">
                            <div className="avatar-lg">
                                {user?.name?.charAt(0)}
                            </div>
                            <button className="btn-edit-avatar"><Plus size={16} /></button>
                        </div>
                        <h2>{user?.name}</h2>
                        <p className="user-role">{profile?.experience?.[0]?.title || 'Job Seeker'}</p>

                        <div className="profile-nav">
                            <button
                                className={activeTab === 'personal' ? 'active' : ''}
                                onClick={() => setActiveTab('personal')}
                            >
                                <User size={18} /> Personal Info
                            </button>
                            <button
                                className={activeTab === 'experience' ? 'active' : ''}
                                onClick={() => setActiveTab('experience')}
                            >
                                <Briefcase size={18} /> Experience
                            </button>
                            <button
                                className={activeTab === 'education' ? 'active' : ''}
                                onClick={() => setActiveTab('education')}
                            >
                                <GraduationCap size={18} /> Education
                            </button>
                            <button
                                className={activeTab === 'documents' ? 'active' : ''}
                                onClick={() => setActiveTab('documents')}
                            >
                                <FileText size={18} /> Documents
                            </button>
                        </div>
                    </div>

                    <div className="card glass social-links-card">
                        <h3>Social Links</h3>
                        <div className="social-input">
                            <Code size={18} />
                            <input type="text" placeholder="Github URL" />
                        </div>
                        <div className="social-input">
                            <LinkIcon size={18} />
                            <input type="text" placeholder="LinkedIn URL" />
                        </div>
                        <div className="social-input">
                            <Globe size={18} />
                            <input type="text" placeholder="Portfolio URL" />
                        </div>
                    </div>
                </aside>

                <main className="profile-content">
                    <form onSubmit={handleUpdate}>
                        {activeTab === 'personal' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card glass">
                                <div className="card-header">
                                    <h3>Personal Details</h3>
                                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                                <div className="grid-2">
                                    <div className="input-group">
                                        <label><Mail size={14} /> Email Address</label>
                                        <input type="email" value={user?.email} disabled />
                                    </div>
                                    <div className="input-group">
                                        <label className="required-label"><Phone size={14} /> Phone Number</label>
                                        <input
                                            type="text"
                                            value={profile?.personalDetails?.phone || ''}
                                            onChange={(e) => setProfile({ ...profile, personalDetails: { ...profile.personalDetails, phone: e.target.value } })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="required-label"><MapPin size={14} /> Location</label>
                                    <input
                                        type="text"
                                        placeholder="City, Country"
                                        value={profile?.personalDetails?.address || ''}
                                        onChange={(e) => setProfile({ ...profile, personalDetails: { ...profile.personalDetails, address: e.target.value } })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Professional Bio</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Tell us about yourself..."
                                        value={profile?.personalDetails?.bio || ''}
                                        onChange={(e) => setProfile({ ...profile, personalDetails: { ...profile.personalDetails, bio: e.target.value } })}
                                    ></textarea>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'experience' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card glass">
                                <div className="card-header">
                                    <h3>Work Experience</h3>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline btn-sm"
                                        onClick={() => setShowExpForm(!showExpForm)}
                                    >
                                        <Plus size={16} /> {showExpForm ? 'Cancel' : 'Add New'}
                                    </button>
                                </div>

                                {showExpForm && (
                                    <div className="card edu-form-inline" style={{ marginBottom: '2rem', background: 'var(--gray-50)' }}>
                                        <div className="grid-2">
                                            <div className="input-group">
                                                <label className="required-label">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={newExp.title}
                                                    onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                                                    placeholder="e.g. Senior Developer"
                                                    required
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="required-label">Company</label>
                                                <input
                                                    type="text"
                                                    value={newExp.company}
                                                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                                                    placeholder="e.g. Google"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                value={newExp.location}
                                                onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                                                placeholder="e.g. Remote / New York"
                                            />
                                        </div>
                                        <div className="grid-2">
                                            <div className="input-group">
                                                <label>From</label>
                                                <input
                                                    type="date"
                                                    value={newExp.from}
                                                    onChange={(e) => setNewExp({ ...newExp, from: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>To</label>
                                                <input
                                                    type="date"
                                                    value={newExp.to}
                                                    onChange={(e) => setNewExp({ ...newExp, to: e.target.value })}
                                                    disabled={newExp.current}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-group-checkbox" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="checkbox"
                                                id="current"
                                                checked={newExp.current}
                                                onChange={(e) => setNewExp({ ...newExp, current: e.target.checked, to: e.target.checked ? '' : newExp.to })}
                                            />
                                            <label htmlFor="current" style={{ margin: 0 }}>I currently work here</label>
                                        </div>
                                        <div className="input-group">
                                            <label>Description</label>
                                            <textarea
                                                rows="3"
                                                value={newExp.description}
                                                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                                                placeholder="Describe your responsibilities and achievements..."
                                            ></textarea>
                                        </div>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={addExperience} disabled={saving}>
                                            {saving ? 'Adding...' : 'Add Experience'}
                                        </button>
                                    </div>
                                )}

                                <div className="experience-list">
                                    {profile?.experience?.length > 0 ? (
                                        profile.experience.map((exp, index) => (
                                            <div key={exp._id || index} className="exp-item">
                                                <div className="exp-icon"><Briefcase size={20} /></div>
                                                <div className="exp-details">
                                                    <h4>{exp.title}</h4>
                                                    <p>{exp.company} • {exp.location}</p>
                                                    <span>
                                                        {exp.from ? new Date(exp.from).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'} - 
                                                        {exp.current ? ' Present' : (exp.to ? ` ${new Date(exp.to).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : ' N/A')}
                                                    </span>
                                                    {exp.description && <p className="exp-desc" style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>{exp.description}</p>}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    className="btn-icon-danger"
                                                    onClick={() => deleteExperience(exp._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state-mini">No experience added yet.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'education' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card glass">
                                <div className="card-header">
                                    <h3>Education History</h3>
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        onClick={() => setShowEduForm(!showEduForm)}
                                    >
                                        <Plus size={16} /> {showEduForm ? 'Cancel' : 'Add New'}
                                    </button>
                                </div>

                                {showEduForm && (
                                    <div className="card edu-form-inline" style={{ marginBottom: '2rem', background: 'var(--gray-50)' }}>
                                        <div className="grid-2">
                                            <div className="input-group">
                                                <label className="required-label">School/University</label>
                                                <input
                                                    type="text"
                                                    value={newEdu.school}
                                                    onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="required-label">Degree</label>
                                                <input
                                                    type="text"
                                                    value={newEdu.degree}
                                                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid-2">
                                            <div className="input-group">
                                                <label>Start Year</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 2018"
                                                    value={newEdu.startYear}
                                                    onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>End Year</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 2022"
                                                    value={newEdu.endYear}
                                                    onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={addEducation}>
                                            Add to Profile
                                        </button>
                                    </div>
                                )}

                                <div className="experience-list">
                                    {profile?.education?.length > 0 ? (
                                        profile.education.map((edu, index) => (
                                            <div key={index} className="exp-item">
                                                <div className="exp-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                                                    <GraduationCap size={20} />
                                                </div>
                                                <div className="exp-details">
                                                    <h4>{edu.degree}</h4>
                                                    <p>{edu.school}</p>
                                                    <span>{edu.startYear} - {edu.endYear}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-icon-danger"
                                                    onClick={() => deleteEducation(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state-mini">No education details added yet.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'documents' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card glass">
                                <div className="card-header">
                                    <h3>Documents & Resume</h3>
                                </div>
                                <div className="upload-zone-premium">
                                    <FileText size={48} />
                                    <p style={{ fontWeight: 700, color: 'var(--dark)' }}>Drag and drop your resume here, or click to browse</p>
                                    <span className="text-muted">PDF, DOCX up to 5MB</span>
                                    <input 
                                        type="file" 
                                        className="file-input-hidden" 
                                        ref={fileInputRef}
                                        onChange={handleResumeUpload}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => fileInputRef.current.click()}
                                        disabled={saving}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        {saving ? 'Uploading...' : 'Choose File'}
                                    </button>
                                </div>
                                {profile?.resume?.fileName && (
                                    <div className="file-item">
                                        <div className="file-info">
                                            <FileText size={20} />
                                            <div>
                                                <span>{profile.resume.fileName}</span>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: 0 }}>
                                                    Uploaded on {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="file-actions">
                                            <a 
                                                href={profile.resume.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="btn-icon-styled btn-icon-view"
                                                title="View Resume"
                                            >
                                                <Zap size={20} />
                                            </a>
                                            <button 
                                                type="button" 
                                                className="btn-icon-styled btn-icon-delete"
                                                onClick={deleteResume}
                                                title="Delete Resume"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EmployeeProfile;
