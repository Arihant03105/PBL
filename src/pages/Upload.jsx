import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, X, CheckCircle, CloudUpload, Tag, AlertCircle } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function Upload() {
    const [dragging, setDragging] = useState(false)
    const [file, setFile] = useState(null)
    const [form, setForm] = useState({
        title: '', subject: '', topic: '', teacher: '', semester: '', type: '', description: '', tags: ''
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState('')
    const ref = useRef()
    const { currentUser, userProfile } = useAuth()
    const navigate = useNavigate()

    const handleDrop = e => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files[0]
        if (f) setFile(f)
    }

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        if (!file) return
        setLoading(true)
        setError('')
        setProgress(10)

        try {
            let fileUrl = ''
            let fileName = file.name

            // Upload to Cloudinary if configured
            if (CLOUDINARY_CLOUD_NAME !== 'YOUR_CLOUD_NAME') {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

                setProgress(30)
                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
                    { method: 'POST', body: formData }
                )
                const data = await res.json()

                if (!res.ok) {
                    console.error('Cloudinary Upload Error:', data)
                    throw new Error(data.error?.message || 'Cloudinary upload failed')
                }

                fileUrl = data.secure_url
                console.log('Upload successful:', data.resource_type, fileUrl)
                setProgress(70)
            } else {
                // Cloudinary not configured — save metadata only (demo mode)
                fileUrl = ''
                setProgress(60)
            }

            // Save material metadata to Firestore
            await addDoc(collection(db, 'materials'), {
                title: form.title,
                subject: form.subject,
                topic: form.topic,
                teacher: form.teacher,
                semester: form.semester,
                type: form.type,
                description: form.description,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                fileUrl,
                fileName,
                uploadedBy: currentUser.uid,
                uploaderName: userProfile?.name || 'Anonymous',
                createdAt: serverTimestamp(),
                downloads: 0,
                rating: 0,
                ratings: 0,
            })

            setProgress(100)
            setSubmitted(true)
        } catch (err) {
            console.error(err)
            setError('Upload failed. Please try again.')
        }
        setLoading(false)
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 glow"
                        style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid #34d399' }}>
                        <CheckCircle size={40} className="text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Upload Successful!</h2>
                    <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--edu-muted)' }}>
                        <strong style={{ color: 'var(--edu-text)' }}>{file?.name}</strong> has been uploaded and saved to the community library.
                        It is now accessible to all students.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => { setSubmitted(false); setFile(null); setProgress(0); setForm({ title: '', subject: '', topic: '', teacher: '', semester: '', type: '', description: '', tags: '' }) }}
                            className="btn-primary">Upload Another</button>
                        <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="section-title mb-2">Upload <span className="gradient-text">Resource</span></h1>
                    <p className="text-sm" style={{ color: 'var(--edu-muted)' }}>
                        Share your study materials with the campus community. All uploads are peer-reviewed.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Drop Zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => ref.current?.click()}
                        className="rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
                        style={{
                            borderColor: dragging ? '#6366f1' : file ? '#34d399' : 'var(--edu-border)',
                            background: dragging ? 'rgba(99,102,241,0.05)' : file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                        }}>
                        <input type="file" ref={ref} className="hidden"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"
                            onChange={e => setFile(e.target.files[0])} />
                        {file ? (
                            <div className="flex items-center justify-center gap-3">
                                <FileText size={24} className="text-green-400" />
                                <div className="text-left">
                                    <p className="font-medium text-sm" style={{ color: 'var(--edu-text)' }}>{file.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--edu-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }}
                                    className="ml-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                    style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <CloudUpload size={36} className="mx-auto mb-3 animate-float" style={{ color: dragging ? '#6366f1' : 'var(--edu-muted)' }} />
                                <p className="font-medium text-sm mb-1" style={{ color: 'var(--edu-text)' }}>
                                    Drag & drop your file or <span style={{ color: '#a5b4fc' }}>click to browse</span>
                                </p>
                                <p className="text-xs" style={{ color: 'var(--edu-muted)' }}>
                                    Supports PDF, Word, PowerPoint, and images · Max 25MB
                                </p>
                            </>
                        )}
                    </div>

                    {/* Upload Progress */}
                    {loading && (
                        <div className="card p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--edu-text)' }}>Uploading...</span>
                                <span className="text-sm" style={{ color: 'var(--edu-muted)' }}>{progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <div className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg text-sm"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    {/* Form fields */}
                    <div className="card p-6 space-y-4">
                        <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--edu-text)' }}>Material Details</h3>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Title *</label>
                            <input name="title" value={form.title} onChange={handleChange} required
                                className="input-field" placeholder="Give your resource a clear, helpful title" />
                        </div>

                        {/* Subject + Type */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Subject *</label>
                                <select name="subject" value={form.subject} onChange={handleChange} required className="input-field" style={{ cursor: 'pointer' }}>
                                    <option value="">Select Subject</option>
                                    {['CS', 'Mech', 'ECE', 'Civil', 'Maths', 'Physics', 'Chemistry', 'BBA', 'MBA'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Type *</label>
                                <select name="type" value={form.type} onChange={handleChange} required className="input-field" style={{ cursor: 'pointer' }}>
                                    <option value="">Select Type</option>
                                    {['Notes', 'Assignment', 'Guide', 'Papers', 'Lab Manual', 'Project'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Topic + Teacher */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Topic</label>
                                <input name="topic" value={form.topic} onChange={handleChange}
                                    className="input-field" placeholder="What specific topic is this about?" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Teacher/Professor</label>
                                <input name="teacher" value={form.teacher} onChange={handleChange}
                                    className="input-field" placeholder="Name of the Professor/Teacher" />
                            </div>
                        </div>

                        {/* Semester */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Semester *</label>
                            <div className="flex gap-2 flex-wrap">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <button type="button" key={s}
                                        onClick={() => setForm(f => ({ ...f, semester: String(s) }))}
                                        className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                                        style={{
                                            background: form.semester === String(s) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                                            color: form.semester === String(s) ? '#a5b4fc' : 'var(--edu-muted)',
                                            border: form.semester === String(s) ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--edu-border)',
                                        }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                                className="input-field resize-none" placeholder="Describe your material (e.g., covers Unit 1-3, helpful for midterms, contains hand-drawn diagrams)" />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--edu-muted)' }}>Tags (comma separated)</label>
                            <div className="relative">
                                <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                                <input name="tags" value={form.tags} onChange={handleChange}
                                    className="input-field pl-9" placeholder="Add searchable keywords like 'notes', 'exam', 'unit1' (separated by commas)" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading || !file}
                        className="btn-primary w-full justify-center py-3.5 text-base glow"
                        style={{ opacity: (file && !loading) ? 1 : 0.5, pointerEvents: (file && !loading) ? 'auto' : 'none' }}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Uploading...
                            </span>
                        ) : (
                            <><UploadIcon size={18} /> Upload Material</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
