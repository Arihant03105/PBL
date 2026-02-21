import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, GraduationCap, Edit3, Save, Star, Upload, Download, Award, BookMarked, Camera, CheckCircle, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const ACHIEVEMENTS = [
    { icon: '🏆', label: 'Top Contributor', desc: '10+ verified uploads', earned: true },
    { icon: '⭐', label: 'Rising Star', desc: 'Avg rating above 4.5', earned: true },
    { icon: '📚', label: 'Bookworm', desc: '50+ downloads', earned: true },
    { icon: '🔥', label: 'Trending', desc: 'Material in top 10', earned: false },
    { icon: '🎓', label: 'Scholar', desc: '100+ downloads on one file', earned: false },
    { icon: '💡', label: 'Innovator', desc: 'First in subject category', earned: false },
]



export default function Profile() {
    const { currentUser, userProfile } = useAuth()
    const [editing, setEditing] = useState(false)
    const [profile, setProfile] = useState({
        name: '', email: '', rollno: '', semester: '', branch: '', bio: ''
    })
    const [saved, setSaved] = useState(false)
    const [myUploads, setMyUploads] = useState([])

    // Load real profile data from AuthContext
    useEffect(() => {
        if (userProfile) {
            setProfile({
                name: userProfile.name || '',
                email: currentUser?.email || '',
                rollno: userProfile.rollno || '',
                semester: userProfile.semester || '',
                branch: userProfile.branch || 'Computer Science',
                bio: userProfile.bio || 'EduExchange student sharing resources.',
            })
        }
    }, [userProfile, currentUser])

    // Fetch my uploads
    useEffect(() => {
        if (!currentUser) return
        async function fetchUploads() {
            const q = query(collection(db, 'materials'), where('uploadedBy', '==', currentUser.uid))
            const snap = await getDocs(q)
            setMyUploads(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }
        fetchUploads()
    }, [currentUser])

    const handleChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSave = async () => {
        if (!currentUser) return
        try {
            await setDoc(doc(db, 'users', currentUser.uid), {
                name: profile.name,
                rollno: profile.rollno,
                semester: profile.semester,
                branch: profile.branch,
                bio: profile.bio
            }, { merge: true })

            setEditing(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile.")
        }
    }

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                    {/* Left — Profile card */}
                    <div className="space-y-5">
                        {/* Avatar & basic info */}
                        <div className="card p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold glow"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                    {profile.name?.substring(0, 2)?.toUpperCase() || 'EU'}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--edu-surface)', border: '2px solid var(--edu-bg)' }}>
                                    <Camera size={14} style={{ color: '#a5b4fc' }} />
                                </button>
                            </div>
                            <h2 className="font-bold text-lg mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--edu-text)' }}>
                                {profile.name}
                            </h2>
                            <p className="text-sm mb-1" style={{ color: 'var(--edu-muted)' }}>{profile.branch}</p>
                            <p className="text-xs mb-4" style={{ color: 'var(--edu-muted)' }}>Semester {profile.semester} • {profile.rollno}</p>
                            <div className="flex items-center justify-center gap-1 mb-4">
                                <CheckCircle size={14} className="text-green-400" />
                                <span className="text-xs" style={{ color: '#34d399' }}>Verified Student</span>
                            </div>
                            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--edu-muted)' }}>{profile.bio}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 pt-4" style={{ borderTop: '1px solid var(--edu-border)' }}>
                                {[
                                    { val: myUploads.length.toString(), label: 'Uploads', icon: <Upload size={14} /> },
                                    { val: myUploads.reduce((a, u) => a + (u.downloads || 0), 0).toString(), label: 'Downloads', icon: <Download size={14} /> },
                                    { val: myUploads.length ? (myUploads.reduce((a, u) => a + (u.rating || 0), 0) / myUploads.length).toFixed(1) : '—', label: 'Avg ⭐', icon: <Star size={14} /> },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-base font-bold mb-0.5 gradient-text" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.val}</div>
                                        <div className="text-xs" style={{ color: 'var(--edu-muted)' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="card p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Award size={15} style={{ color: '#fbbf24' }} />
                                <h3 className="font-bold text-sm" style={{ color: 'var(--edu-text)' }}>Achievements</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {ACHIEVEMENTS.map((a, i) => (
                                    <div key={i} title={a.desc}
                                        className="flex flex-col items-center p-2 rounded-xl text-center cursor-help transition-all"
                                        style={{ background: a.earned ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', opacity: a.earned ? 1 : 0.4 }}>
                                        <span className="text-xl mb-1">{a.icon}</span>
                                        <span className="text-xs font-medium" style={{ color: a.earned ? 'var(--edu-text)' : 'var(--edu-muted)' }}>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Edit + uploads */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Edit Profile */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold" style={{ color: 'var(--edu-text)' }}>Profile Information</h3>
                                {saved && (
                                    <span className="flex items-center gap-1.5 text-xs" style={{ color: '#34d399' }}>
                                        <CheckCircle size={13} /> Saved!
                                    </span>
                                )}
                                <button onClick={() => editing ? handleSave() : setEditing(true)}
                                    className={editing ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>
                                    {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: 'Full Name', name: 'name', icon: <User size={14} />, placeholder: 'Enter your full name' },
                                    { label: 'Email', name: 'email', icon: <Mail size={14} />, placeholder: 'your.email@university.edu' },
                                    { label: 'Roll Number', name: 'rollno', icon: <GraduationCap size={14} />, placeholder: 'e.g. 21BIT001' },
                                    { label: 'Branch', name: 'branch', icon: <BookMarked size={14} />, placeholder: 'e.g. Computer Science' },
                                ].map(f => (
                                    <div key={f.name}>
                                        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>
                                            {f.label}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }}>{f.icon}</span>
                                            <input name={f.name} value={profile[f.name]} onChange={handleChange}
                                                disabled={!editing}
                                                className="input-field pl-9"
                                                placeholder={f.placeholder}
                                                style={{ opacity: editing ? 1 : 0.8, cursor: editing ? 'text' : 'default' }} />
                                        </div>
                                    </div>
                                ))}

                                {/* Semester */}
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Semester</label>
                                    <select name="semester" value={profile.semester} onChange={handleChange}
                                        disabled={!editing} className="input-field" style={{ cursor: editing ? 'pointer' : 'default', opacity: editing ? 1 : 0.8 }}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mt-4">
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Bio</label>
                                <textarea name="bio" value={profile.bio} onChange={handleChange}
                                    disabled={!editing} rows={3}
                                    className="input-field resize-none"
                                    placeholder="Share a bit about your academic interests, goal, or what you're currently studying..."
                                    style={{ opacity: editing ? 1 : 0.8, cursor: editing ? 'text' : 'default' }} />
                            </div>
                        </div>

                        {/* My Uploads */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold" style={{ color: 'var(--edu-text)' }}>My Contributions</h3>
                                <Link to="/upload" className="btn-primary text-xs py-2 px-3">
                                    <Upload size={13} /> Upload New
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {myUploads.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--edu-muted)' }} />
                                        <p className="text-sm" style={{ color: 'var(--edu-muted)' }}>No uploads yet.</p>
                                    </div>
                                ) : myUploads.map(u => (
                                    <Link to={`/material/${u.id}`} key={u.id}
                                        className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                                        style={{ textDecoration: 'none', border: '1px solid var(--edu-border)' }}>
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: 'rgba(99,102,241,0.12)' }}>
                                            <Upload size={15} style={{ color: '#a5b4fc' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate" style={{ color: 'var(--edu-text)' }}>{u.title}</p>
                                            <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--edu-muted)' }}>
                                                <span>{u.subject}</span>
                                                <span>{u.type}</span>
                                                <span className="flex items-center gap-1"><Download size={10} />{u.downloads || 0}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

