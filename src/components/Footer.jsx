import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="pt-20 pb-10 px-4 border-t" style={{ background: 'var(--edu-bg)', borderColor: 'var(--edu-border)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-5">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-sm"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <BookOpen size={18} className="text-white" />
                            </div>
                            <span className="font-bold text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                <span className="gradient-text">Edu</span>
                                <span style={{ color: 'var(--edu-text)' }}>Exchange</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--edu-muted)' }}>
                            The ultimate campus platform for students to share knowledge, access premium resources, and grow together. Built by students, for students.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" style={{ color: 'var(--edu-muted)' }}>
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" style={{ color: 'var(--edu-muted)' }}>
                                <Github size={16} />
                            </a>
                            <Link to="/contact" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors" style={{ color: 'var(--edu-muted)' }}>
                                <Mail size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-wider" style={{ color: 'var(--edu-text)' }}>Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/browse" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Browse Materials</Link></li>
                            <li><Link to="/upload" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Upload Resource</Link></li>
                            <li><Link to="/dashboard" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Student Dashboard</Link></li>
                            <li><Link to="/profile" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>My Profile</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-wider" style={{ color: 'var(--edu-text)' }}>Resources</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>About Us</Link></li>
                            <li><Link to="/contact" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Contact Support</Link></li>
                            <li><Link to="/terms" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Community Guidelines</Link></li>
                            <li><Link to="/privacy" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Academic Integrity</Link></li>
                        </ul>
                    </div>

                    {/* Legal - CRITICAL FOR ADSENSE */}
                    <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-wider" style={{ color: 'var(--edu-text)' }}>Legal</h4>
                        <ul className="space-y-4">
                            <li><Link to="/privacy" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Terms of Service</Link></li>
                            <li><Link to="/privacy" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Cookie Policy</Link></li>
                            <li><Link to="/terms" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--edu-muted)' }}>Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--edu-border)' }}>
                    <p className="text-xs" style={{ color: 'var(--edu-muted)' }}>
                        © {new Date().getFullYear()} EduExchange. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--edu-muted)' }}>
                        Made with <span className="text-red-500 mx-1">❤</span> for the campus community
                    </div>
                </div>
            </div>
        </footer>
    )
}
