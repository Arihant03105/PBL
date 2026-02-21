import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FileText, Upload, Download, Star,
    BookOpen, Settings, ChevronRight, Clock, Award, TrendingUp, Bell
} from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const NOTIFICATIONS = [
    { text: 'Welcome to EduExchange! Start by uploading your first resource. 🚀', time: 'Just now', unread: true },
    { text: 'Your account was created successfully ✅', time: 'Today', unread: false },
]

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const tabs = ['overview', 'uploads', 'notifications']
    const { currentUser, userProfile } = useAuth()
    const [myUploads, setMyUploads] = useState([])
    const [loadingUploads, setLoadingUploads] = useState(true)

    useEffect(() => {
        if (!currentUser) return
        async function fetchUploads() {
            try {
                const q = query(
                    collection(db, 'materials'),
                    where('uploadedBy', '==', currentUser.uid)
                )
                const snap = await getDocs(q)
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                setMyUploads(data)
            } catch (e) { console.error(e) }
            setLoadingUploads(false)
        }
        fetchUploads()
    }, [currentUser])

    const STATS = [
        { label: 'Total Uploads', value: String(myUploads.length), icon: <Upload size={18} />, color: '#6366f1', change: 'Your materials' },
        { label: 'Total Downloads', value: myUploads.reduce((a, u) => a + (u.downloads || 0), 0).toString(), icon: <Download size={18} />, color: '#8b5cf6', change: 'Across all uploads' },
        { label: 'Avg. Rating', value: myUploads.length ? (myUploads.reduce((a, u) => a + (u.rating || 0), 0) / myUploads.length).toFixed(1) : '—', icon: <Star size={18} />, color: '#f59e0b', change: 'Community rating' },
        { label: 'Achievement Points', value: String(myUploads.length * 20), icon: <Award size={18} />, color: '#10b981', change: '20pts per upload' },
    ]

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Welcome back, <span className="gradient-text">{userProfile?.name?.split(' ')[0] || 'Student'}!</span>
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--edu-muted)' }}>
                            Here's your academic activity summary
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/upload" className="btn-primary">
                            <Upload size={15} /> Upload
                        </Link>
                        <Link to="/profile" className="btn-secondary">
                            <Settings size={15} /> Profile
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STATS.map((s, i) => (
                        <div key={i} className="card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ background: `${s.color}20`, color: s.color }}>
                                    {s.icon}
                                </div>
                                <TrendingUp size={14} style={{ color: '#34d399' }} />
                            </div>
                            <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--edu-text)' }}>
                                {s.value}
                            </div>
                            <div className="text-xs mb-1" style={{ color: 'var(--edu-muted)' }}>{s.label}</div>
                            <div className="text-xs" style={{ color: '#34d399' }}>{s.change}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--edu-border)' }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                            style={{
                                background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
                                color: activeTab === tab ? '#a5b4fc' : 'var(--edu-muted)',
                            }}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Activity + Uploads preview */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* My Uploads */}
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-sm" style={{ color: 'var(--edu-text)' }}>My Recent Uploads</h3>
                                    <button onClick={() => setActiveTab('uploads')} className="text-xs hover:text-indigo-400 transition-colors flex items-center gap-1" style={{ color: 'var(--edu-muted)' }}>
                                        View all <ChevronRight size={13} />
                                    </button>
                                </div>
                                {loadingUploads ? (
                                    <div className="text-center py-6 text-sm" style={{ color: 'var(--edu-muted)' }}>Loading...</div>
                                ) : myUploads.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--edu-muted)' }} />
                                        <p className="text-sm" style={{ color: 'var(--edu-muted)' }}>No uploads yet.</p>
                                        <Link to="/upload" className="btn-primary mt-3 inline-flex text-sm"><Upload size={14} /> Upload Now</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myUploads.slice(0, 3).map(u => (
                                            <Link to={`/material/${u.id}`} key={u.id}
                                                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                                                style={{ textDecoration: 'none', border: '1px solid var(--edu-border)' }}>
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
                                                    <FileText size={16} style={{ color: '#a5b4fc' }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--edu-text)' }}>{u.title}</p>
                                                    <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--edu-muted)' }}>
                                                        <span>{u.subject}</span>
                                                        <span>{u.type}</span>
                                                        <span className="flex items-center gap-1"><Download size={10} /> {u.downloads || 0}</span>
                                                    </div>
                                                </div>
                                                <span className="badge text-xs shrink-0" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Uploaded</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Browse CTA */}
                            <div className="card p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
                                    <BookOpen size={22} style={{ color: '#a5b4fc' }} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm" style={{ color: 'var(--edu-text)' }}>Explore Community Materials</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--edu-muted)' }}>Browse notes, assignments, and guides uploaded by students</p>
                                </div>
                                <Link to="/browse" className="btn-secondary text-sm shrink-0">Browse <ChevronRight size={13} /></Link>
                            </div>
                        </div>

                        {/* Right: Notifications + Quick links */}
                        <div className="space-y-5">
                            {/* Notifications */}
                            <div className="card p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bell size={15} style={{ color: '#a5b4fc' }} />
                                    <h3 className="font-bold text-sm" style={{ color: 'var(--edu-text)' }}>Notifications</h3>
                                    <span className="badge ml-auto text-xs" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>2</span>
                                </div>
                                <div className="space-y-3">
                                    {NOTIFICATIONS.map((n, i) => (
                                        <div key={i} className="p-3 rounded-lg text-xs leading-relaxed"
                                            style={{ background: n.unread ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)', borderLeft: n.unread ? '2px solid #6366f1' : '2px solid transparent' }}>
                                            <p style={{ color: 'var(--edu-text)' }}>{n.text}</p>
                                            <p className="mt-1" style={{ color: 'var(--edu-muted)' }}>{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="card p-5">
                                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--edu-text)' }}>Quick Actions</h3>
                                <div className="space-y-2">
                                    {[
                                        { to: '/upload', label: 'Upload New Material', icon: <Upload size={14} /> },
                                        { to: '/browse', label: 'Browse Resources', icon: <BookOpen size={14} /> },
                                        { to: '/profile', label: 'Edit Profile', icon: <Settings size={14} /> },
                                    ].map(l => (
                                        <Link key={l.to} to={l.to}
                                            className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm transition-all hover:bg-white/5"
                                            style={{ color: 'var(--edu-muted)', textDecoration: 'none' }}>
                                            <span style={{ color: '#a5b4fc' }}>{l.icon}</span>
                                            {l.label}
                                            <ChevronRight size={13} className="ml-auto" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'uploads' && (
                    <div className="card p-6">
                        <h3 className="font-bold mb-5" style={{ color: 'var(--edu-text)' }}>All My Uploads ({myUploads.length})</h3>
                        {loadingUploads ? (
                            <div className="text-center py-8 text-sm" style={{ color: 'var(--edu-muted)' }}>Loading...</div>
                        ) : myUploads.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText size={40} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--edu-muted)' }} />
                                <p className="text-sm mb-4" style={{ color: 'var(--edu-muted)' }}>You haven't uploaded anything yet.</p>
                                <Link to="/upload" className="btn-primary"><Upload size={15} /> Upload First Material</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myUploads.map(u => (
                                    <Link to={`/material/${u.id}`} key={u.id} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5"
                                        style={{ textDecoration: 'none', border: '1px solid var(--edu-border)' }}>
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
                                            <FileText size={18} style={{ color: '#a5b4fc' }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm" style={{ color: 'var(--edu-text)' }}>{u.title}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--edu-muted)' }}>
                                                <span>{u.subject}</span>
                                                <span>{u.type}</span>
                                                <span className="flex items-center gap-1"><Download size={11} /> {u.downloads || 0} downloads</span>
                                                <span><Clock size={11} className="inline mr-1" />{u.semester ? `Sem ${u.semester}` : ''}</span>
                                            </div>
                                        </div>
                                        <span className="badge text-xs" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>Uploaded</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}



                {activeTab === 'notifications' && (
                    <div className="card p-6">
                        <h3 className="font-bold mb-5" style={{ color: 'var(--edu-text)' }}>All Notifications</h3>
                        <div className="space-y-3">
                            {NOTIFICATIONS.map((n, i) => (
                                <div key={i} className="p-4 rounded-xl"
                                    style={{ background: n.unread ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)', border: n.unread ? '1px solid rgba(99,102,241,0.2)' : '1px solid var(--edu-border)' }}>
                                    <p className="text-sm" style={{ color: 'var(--edu-text)' }}>{n.text}</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--edu-muted)' }}>{n.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

