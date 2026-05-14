import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, Zap, CheckCircle, ArrowRight, Shield, Globe, Award } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero-v2">
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="badge-premium">All-in-One Recruitment Solution</span>
                        <h1>Find Your <span className="text-gradient">Dream Job</span> or <span className="text-gradient">Top Talent</span></h1>
                        <p>RecruitPortal bridges the gap between ambitious professionals and industry leaders. Whether you're looking to grow your career or build your team, we've got you covered.</p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Member Login
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <h3>50k+</h3>
                                <p>Job Seekers</p>
                            </div>
                            <div className="stat-item">
                                <h3>500+</h3>
                                <p>Top Employers</p>
                            </div>
                            <div className="stat-item">
                                <h3>25k+</h3>
                                <p>Success Matches</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="hero-bg-glow"></div>
            </section>

            {/* Features Section */}
            <section className="features-section container">
                <div className="section-header">
                    <h2>One Platform, <span className="text-gradient">Two Experiences</span></h2>
                    <p>Tailored tools for both hiring managers and job seekers.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={<Briefcase color="#6366f1" />}
                        title="For Job Seekers"
                        desc="Browse thousands of jobs, save your favorites, track your applications, and build a premium professional profile."
                    />
                    <FeatureCard
                        icon={<Zap color="#10b981" />}
                        title="For Employers"
                        desc="Post job openings, manage candidate pipelines, use AI screening, and communicate directly with top talent."
                    />
                    <FeatureCard
                        icon={<Users color="#f59e0b" />}
                        title="Smart Matching"
                        desc="Our AI connects the right skills with the right opportunities, making the hiring process 5x faster."
                    />
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="trust-section">
                <div className="container">
                    <div className="trust-content card glass">
                        <div className="trust-text">
                            <Award size={48} color="var(--warning)" />
                            <h3>Trusted by Professionals Worldwide</h3>
                            <p>"RecruitPortal is the most intuitive platform I've used. As a candidate, I found a role that perfectly matched my skills in just a week."</p>
                            <div className="trust-author">
                                <strong>John Smith</strong>
                                <span>Senior Software Engineer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-footer container">
                <motion.div
                    className="cta-card"
                    whileHover={{ scale: 1.02 }}
                >
                    <h2>Ready to take the next step?</h2>
                    <p>Join the RecruitPortal community today and start your journey.</p>
                    <div className="cta-btns">
                        <Link to="/register" className="btn btn-primary">Create Free Account</Link>
                        <Link to="/login" className="btn btn-outline" style={{ background: 'white' }}>Login to Dashboard</Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        className="card feature-card"
        whileHover={{ y: -10 }}
    >
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </motion.div>
);

export default Landing;
