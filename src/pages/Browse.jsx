import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, Star, Download, FileText, SlidersHorizontal, Grid, List } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const SUBJECTS = ['All', 'CS', 'Mech', 'ECE', 'Civil', 'Maths', 'Physics']
const TYPES = ['All', 'Notes', 'Guide', 'Papers', 'Assignment']
const SEMESTERS = ['All', '1', '2', '3', '4', '5', '6', '7', '8']
const TYPE_COLORS = {
    Notes: { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc' },
    Guide: { bg: 'rgba(16,185,129,0.12)', text: '#34d399' },
    Papers: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
    Assignment: { bg: 'rgba(239,68,68,0.12)', text: '#f87171' },
}

export default function Browse() {
    const [searchQuery, setSearchQuery] = useState('')
    const [subject, setSubject] = useState('All')
    const [type, setType] = useState('All')
    const [semester, setSemester] = useState('All')
    const [viewMode, setViewMode] = useState('grid')
    const [allMaterials, setAllMaterials] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMaterials() {
            try {
                const snap = await getDocs(collection(db, 'materials'))
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                setAllMaterials(data)
            } catch (e) { console.error(e) }
            setLoading(false)
        }
        fetchMaterials()
    }, [])

    const filtered = allMaterials.filter(m => {
        const q = searchQuery.toLowerCase()
        return (
            (subject === 'All' || m.subject === subject) &&
            (type === 'All' || m.type === type) &&
            (semester === 'All' || String(m.semester) === semester) &&
            (!q || m.title?.toLowerCase().includes(q) || m.topic?.toLowerCase().includes(q))
        )
    })

    return (
        <main className="min-h-screen">
            <Helmet>
                <title>Browse Study Materials | EduExchange Campus Platform</title>
                <meta name="description" content="Discover and download university-level study materials, exam papers, and notes. Filter by subject, semester, and material type on the EduExchange campus hub." />
            </Helmet>

            {/* Header */}
            <div className="py-10 px-4" style={{ background: 'var(--edu-surface)', borderBottom: '1px solid var(--edu-border)' }}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="section-title mb-2">Browse <span className="gradient-text">Materials</span></h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--edu-muted)' }}>
                        {loading ? 'Loading...' : `${allMaterials.length} resources available`} • Use filters to narrow your search
                    </p>
                    {/* Search */}
                    <div className="relative max-w-xl">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                        <input className="input-field pl-11 py-3" placeholder="Search for notes, papers, or topics (e.g. 'DSA', 'Unit 1')"
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-56 shrink-0">
                        <div className="card p-5 sticky top-20">
                            <div className="flex items-center gap-2 mb-5">
                                <SlidersHorizontal size={16} style={{ color: '#a5b4fc' }} />
                                <span className="font-semibold text-sm">Filters</span>
                            </div>

                            {/* Subject */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--edu-muted)' }}>Subject</p>
                                <div className="space-y-1">
                                    {SUBJECTS.map(s => (
                                        <button key={s} onClick={() => setSubject(s)}
                                            className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                                            style={{
                                                background: subject === s ? 'rgba(99,102,241,0.15)' : 'transparent',
                                                color: subject === s ? '#a5b4fc' : 'var(--edu-muted)',
                                                fontWeight: subject === s ? 600 : 400,
                                            }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--edu-muted)' }}>Type</p>
                                <div className="space-y-1">
                                    {TYPES.map(t => (
                                        <button key={t} onClick={() => setType(t)}
                                            className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                                            style={{
                                                background: type === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                                                color: type === t ? '#a5b4fc' : 'var(--edu-muted)',
                                                fontWeight: type === t ? 600 : 400,
                                            }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Semester */}
                            <div>
                                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--edu-muted)' }}>Semester</p>
                                <div className="grid grid-cols-4 gap-1">
                                    {SEMESTERS.map(s => (
                                        <button key={s} onClick={() => setSemester(s)}
                                            className="py-1.5 rounded-lg text-xs transition-all"
                                            style={{
                                                background: semester === s ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                                                color: semester === s ? '#a5b4fc' : 'var(--edu-muted)',
                                                border: semester === s ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                                            }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => { setSubject('All'); setType('All'); setSemester('All'); setSearchQuery('') }}
                                className="mt-5 w-full py-2 rounded-lg text-xs text-center transition-all hover:text-red-400"
                                style={{ color: 'var(--edu-muted)', border: '1px solid var(--edu-border)' }}>
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* Results */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm" style={{ color: 'var(--edu-muted)' }}>
                                Showing <strong style={{ color: 'var(--edu-text)' }}>{filtered.length}</strong> results
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setViewMode('grid')} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ background: viewMode === 'grid' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)', color: viewMode === 'grid' ? '#a5b4fc' : 'var(--edu-muted)' }}>
                                    <Grid size={15} />
                                </button>
                                <button onClick={() => setViewMode('list')} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ background: viewMode === 'list' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)', color: viewMode === 'list' ? '#a5b4fc' : 'var(--edu-muted)' }}>
                                    <List size={15} />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p style={{ color: 'var(--edu-muted)' }}>Loading materials...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--edu-muted)' }} />
                                <p style={{ color: 'var(--edu-muted)' }}>No materials found. Try different filters.</p>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-3'}>
                                {filtered.map(mat => {
                                    const tc = TYPE_COLORS[mat.type] || TYPE_COLORS.Notes
                                    return (
                                        <Link to={`/material/${mat.id}`} key={mat.id}
                                            className={`card p-5 block animate-fadeInUp ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}
                                            style={{ textDecoration: 'none' }}>
                                            <div className={`${viewMode === 'list' ? 'w-10 h-10 shrink-0' : 'w-10 h-10 mb-3'} rounded-lg flex items-center justify-center`}
                                                style={{ background: 'rgba(99,102,241,0.12)' }}>
                                                <FileText size={18} style={{ color: '#a5b4fc' }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                                    <h3 className="font-semibold text-sm line-clamp-2 leading-snug" style={{ color: 'var(--edu-text)' }}>
                                                        {mat.title}
                                                    </h3>
                                                    <span className="badge shrink-0 text-xs" style={{ background: tc.bg, color: tc.text }}>
                                                        {mat.type}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--edu-muted)' }}>
                                                        {mat.subject}
                                                    </span>
                                                    <span className="text-xs" style={{ color: 'var(--edu-muted)' }}>Sem {mat.semester}</span>
                                                    <span className="text-xs" style={{ color: 'var(--edu-muted)' }}>• {mat.teacher}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--edu-muted)' }}>
                                                    <span className="flex items-center gap-1">
                                                        <Star size={12} className="text-yellow-400 fill-yellow-400" /> {mat.rating}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Download size={12} /> {mat.downloads}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
