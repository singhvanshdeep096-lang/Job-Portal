import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, Zap, CheckCircle, ArrowRight, Shield, Globe, Award } from 'lucide-react';

const Landing = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

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
                        <span className="badge-premium">The Employer's Portal</span>
                        <h1>Hire Your Next <span className="text-gradient">Top Talent</span></h1>
                        <p>Access a pool of world-class professionals. Our AI-driven platform makes finding and managing candidates faster, smarter, and more efficient.</p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Start Hiring <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Dashboard Login
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <h3>50k+</h3>
                                <p>Candidates</p>
                            </div>
                            <div className="stat-item">
                                <h3>500+</h3>
                                <p>Companies</p>
                            </div>
                            <div className="stat-item">
                                <h3>25k+</h3>
                                <p>Success Hires</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="hero-bg-glow"></div>
            </section>

            {/* Features Section */}
            <section className="features-section container">
                <div className="section-header">
                    <h2>Why Choose <span className="text-gradient">RecruitPortal</span>?</h2>
                    <p>We provide the ultimate toolkit for modern recruitment teams.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={<Zap color="#6366f1" />}
                        title="AI Candidate Screening"
                        desc="Our smart algorithms rank candidates based on their skills and experience automatically."
                    />
                    <FeatureCard
                        icon={<Users color="#10b981" />}
                        title="Talent Management"
                        desc="Easily track applications, schedule interviews, and manage your hiring pipeline in one place."
                    />
                    <FeatureCard
                        icon={<Globe color="#f59e0b" />}
                        title="Global Sourcing"
                        desc="Post your jobs to a global audience and find the perfect fit regardless of location."
                    />
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="trust-section">
                <div className="container">
                    <div className="trust-content card glass">
                        <div className="trust-text">
                            <Award size={48} color="var(--warning)" />
                            <h3>Trusted by Industry Leaders</h3>
                            <p>"RecruitPortal transformed our hiring process. We found our lead developer within 5 days of posting."</p>
                            <div className="trust-author">
                                <strong>Sarah Chen</strong>
                                <span>CTO at TechFlow</span>
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
                    <h2>Ready to grow your team?</h2>
                    <p>Join hundreds of industry leaders using RecruitPortal to build world-class teams.</p>
                    <div className="cta-btns">
                        <Link to="/register" className="btn btn-primary">Create Employer Account</Link>
                        <Link to="/login" className="btn btn-outline" style={{ background: 'white' }}>Recruiter Login</Link>
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
