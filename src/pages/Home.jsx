import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    BookOpen, Upload, Search, Star, Users, Shield, ArrowRight,
    TrendingUp, FileText, CheckCircle, Zap, Globe, BookMarked
} from 'lucide-react'
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useState, useEffect } from 'react'

const stats = [
    { value: '12K+', label: 'Study Materials' },
    { value: '3.5K+', label: 'Active Students' },
    { value: '120+', label: 'Subjects Covered' },
    { value: '98%', label: 'Satisfaction Rate' },
]

const features = [
    {
        icon: <Upload size={22} />,
        title: 'Easy Upload',
        desc: 'Upload notes, assignments, guides, and papers in seconds with our drag‑and‑drop interface.',
        color: '#6366f1',
    },
    {
        icon: <Search size={22} />,
        title: 'Smart Search',
        desc: 'Find exactly what you need with filters for subject, teacher, topic, and semester.',
        color: '#8b5cf6',
    },
    {
        icon: <Star size={22} />,
        title: 'Peer Reviews',
        desc: 'Community‑driven ratings and feedback to surface the highest-quality materials.',
        color: '#06b6d4',
    },
    {
        icon: <Shield size={22} />,
        title: 'Secure & Verified',
        desc: 'End-to-end secure authentication. Your data and uploads are always protected.',
        color: '#10b981',
    },
    {
        icon: <Users size={22} />,
        title: 'Collaborative',
        desc: 'Connect with peers, contribute resources, and grow academically together.',
        color: '#f59e0b',
    },
    {
        icon: <Zap size={22} />,
        title: 'Instant Access',
        desc: 'Download any verified resource instantly — no paywalls, no waiting.',
        color: '#ef4444',
    },
]

const categories = [
    { label: 'Computer Science', count: '2.4K', icon: '💻' },
    { label: 'Engineering', count: '1.8K', icon: '⚙️' },
    { label: 'Mathematics', count: '1.2K', icon: '📐' },
    { label: 'Physics', count: '980', icon: '⚛️' },
    { label: 'Chemistry', count: '760', icon: '🧪' },
    { label: 'Exam Papers', count: '3.1K', icon: '📋' },
]


export default function Home() {
    const [recentMaterials, setRecentMaterials] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecent() {
            try {
                const q = query(
                    collection(db, 'materials'),
                    orderBy('createdAt', 'desc'),
                    limit(3)
                )
                const snap = await getDocs(q)
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                setRecentMaterials(data)
            } catch (e) { console.error(e) }
            setLoading(false)
        }
        fetchRecent()
    }, [])

    return (
        <main>
            <Helmet>
                <title>EduExchange | Download & Share Campus Study Materials</title>
                <meta name="description" content="Access thousands of student-contributed study materials, including notes, guides, and assignments. Join the EduExchange community to share and grow academically." />
            </Helmet>

            {/* Hero */}
            <section className="relative min-h-[92vh] flex items-center grid-bg overflow-hidden text-center">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

                <div className="relative max-w-7xl mx-auto px-4 py-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fadeInUp bg-indigo-500/10 border border-indigo-500/20">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-sm font-medium text-indigo-300">Live for all campus students</span>
                    </div>

                    <h1 className="section-title mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                        Your Campus's<br />
                        <span className="gradient-text">Academic Hub</span>
                    </h1>

                    <p className="text-lg mb-10 max-w-2xl mx-auto animate-fadeInUp leading-relaxed text-slate-400"
                        style={{ animationDelay: '0.2s' }}>
                        The ultimate destination for student-contributed study materials.
                        Download notes, assignments, and exam papers optimized for your curriculum.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <Link to="/browse" className="btn-primary text-base px-8 py-3.5 glow">
                            <BookOpen size={18} /> Explore Materials
                        </Link>
                        <Link to="/register" className="btn-secondary text-base px-8 py-3.5">
                            Join Community
                        </Link>
                    </div>

                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {stats.map((s, i) => (
                            <div key={i} className="text-center animate-fadeInUp" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                                <div className="text-3xl font-bold mb-1 gradient-text">{s.value}</div>
                                <div className="text-sm text-slate-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-3">Browse by <span className="gradient-text">Subject</span></h2>
                        <p className="text-sm text-slate-500">Organized materials across all major disciplines</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat, i) => (
                            <Link to="/browse" key={i} className="card p-5 text-center group transition-all hover:-translate-y-1">
                                <div className="text-3xl mb-3">{cat.icon}</div>
                                <div className="font-semibold text-sm mb-1 group-hover:text-indigo-400">{cat.label}</div>
                                <div className="text-xs text-slate-500">{cat.count} files</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="section-title mb-3">Everything You <span className="gradient-text">Need</span></h2>
                        <p className="max-w-lg mx-auto text-sm leading-relaxed text-slate-500">
                            A platform built to eliminate the pain of scattered resources.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card p-6 group">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                    style={{ background: `${f.color}20`, color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Materials */}
            <section className="py-20 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="section-title mb-1">Trending <span className="gradient-text">Resources</span></h2>
                            <p className="text-sm text-slate-500">Most downloaded this week</p>
                        </div>
                        <Link to="/browse" className="btn-secondary text-sm">View all <ArrowRight size={14} /></Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {loading ? (
                            <div className="col-span-full text-center py-10">
                                <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p style={{ color: 'var(--edu-muted)' }}>Fetching latest materials...</p>
                            </div>
                        ) : recentMaterials.length === 0 ? (
                            <div className="col-span-full text-center py-10">
                                <p style={{ color: 'var(--edu-muted)' }}>No materials uploaded yet. Be the first!</p>
                            </div>
                        ) : (
                            recentMaterials.map(mat => (
                                <Link to={`/material/${mat.id}`} key={mat.id} className="card p-5 group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/10">
                                            <FileText size={18} className="text-indigo-400" />
                                        </div>
                                        <span className="badge text-xs bg-indigo-500/10 text-indigo-400">{mat.type}</span>
                                    </div>
                                    <h3 className="font-semibold text-sm mb-2 group-hover:text-indigo-400 transition-colors uppercase line-clamp-2">{mat.title}</h3>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="badge bg-emerald-500/10 text-emerald-400">{mat.subject}</span>
                                        <span className="text-xs text-slate-500">Sem {mat.semester}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" /> {mat.rating || 0}</span>
                                        <span>{mat.downloads || 0} downloads</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="card p-12 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-indigo-500 to-purple-600" />
                        <div className="relative">
                            <Globe size={40} className="mx-auto mb-5 text-indigo-400 animate-float" />
                            <h2 className="section-title mb-4">Ready to Start <span className="gradient-text">Sharing?</span></h2>
                            <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed text-slate-400">
                                Join thousands of students already benefiting from collaborative resource sharing.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register" className="btn-primary text-base px-8 py-3.5 glow">Get Started Free</Link>
                                <Link to="/browse" className="btn-secondary text-base px-8 py-3.5">Browse First</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* 
    Google AdSense Recommendation: 
    Place an auto-ad unit here or between sections after approval.
*/}
        </main>
    )
}
