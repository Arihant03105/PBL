import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Star, Download, BookOpen, User, Clock, FileText, ThumbsUp, Share2, Bookmark, ChevronLeft, Tag, GraduationCap, Globe } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

// ... (REVIEWS, Stars components remain unchanged)
const REVIEWS = [
    { id: 1, user: 'Sneha T.', rating: 5, text: 'Absolutely wonderful notes! Covered everything for the exam. The diagrams are super clear.', date: '1 day ago', likes: 23 },
    { id: 2, user: 'Vikram P.', rating: 5, text: 'Best resource I found for this subject. Highly recommended to all juniors.', date: '3 days ago', likes: 18 },
    { id: 3, user: 'Ananya R.', rating: 4, text: 'Very helpful, but could use more practice problems. Overall a 4-star resource.', date: '5 days ago', likes: 9 },
]

function Stars({ rating, size = 14 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={size} style={{ color: s <= Math.round(rating) ? '#fbbf24' : 'var(--edu-border)' }}
                    className={s <= Math.round(rating) ? 'fill-yellow-400' : ''} />
            ))}
        </div>
    )
}

export default function MaterialDetail() {
    const { id } = useParams()
    const [mat, setMat] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userRating, setUserRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    const [bookmarked, setBookmarked] = useState(false)
    const [downloaded, setDownloaded] = useState(false)

    function handleDownload() {
        if (!mat?.fileUrl) return

        // Try multiple approaches for the best download experience
        const safeTitle = (mat.title || 'material').replace(/[^a-z0-9]/gi, '_').toLowerCase()

        // Approach 1: Try Cloudinary transformation to force download
        const downloadUrl = mat.fileUrl.replace('/upload/', `/upload/fl_attachment:${safeTitle}/`)

        // Open the download URL in a new window
        const win = window.open(downloadUrl, '_blank')

        // If the window didn't open or was blocked, fallback to original URL
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = mat.fileUrl
        }

        setDownloaded(true)
        setTimeout(() => setDownloaded(false), 3000)
    }

    useEffect(() => {
        async function fetchMaterial() {
            try {
                console.log("Fetching material for ID:", id)
                const docRef = doc(db, 'materials', id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    console.log("Material found:", docSnap.data().title)
                    setMat({ id: docSnap.id, ...docSnap.data() })
                } else {
                    console.warn("Material not found for ID:", id)
                }
            } catch (err) {
                console.error("Error fetching material:", err)
            }
            console.log("Setting loading to false")
            setLoading(false)
        }
        fetchMaterial()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!mat) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <FileText size={48} className="opacity-20 mb-4" />
                <h2 className="text-xl font-bold mb-2">Material Not Found</h2>
                <p className="text-sm text-gray-400 mb-6">The resource you are looking for does not exist or has been removed.</p>
                <Link to="/browse" className="btn-primary">Back to Browse</Link>
            </div>
        )
    }

    const pageTitle = `${mat.title} | ${mat.subject} Sem ${mat.semester} ${mat.type} - EduExchange`
    const pageDesc = `Download ${mat.title} for ${mat.subject}. A ${mat.type} contributed by ${mat.uploaderName || 'Student'} for Semester ${mat.semester}. ${mat.description?.substring(0, 120)}...`

    return (
        <article className="min-h-screen py-10 px-4">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta name="keywords" content={`${mat.subject}, ${mat.type}, ${mat.topic}, university notes, ${mat.tags}`} />
            </Helmet>

            <div className="max-w-5xl mx-auto">
                <Link to="/browse" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-indigo-400 transition-colors"
                    style={{ color: 'var(--edu-muted)' }}>
                    <ChevronLeft size={16} /> Back to Browse
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <header className="card p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                                    <FileText size={26} style={{ color: '#a5b4fc' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="badge text-xs" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' }}>{mat.type}</span>
                                        <span className="badge text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--edu-muted)' }}>{mat.subject}</span>
                                        <span className="badge text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--edu-muted)' }}>Sem {mat.semester}</span>
                                    </div>
                                    <h1 className="font-bold text-xl leading-snug" style={{ color: 'var(--edu-text)' }}>
                                        {mat.title}
                                    </h1>
                                </div>
                            </div>

                            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl mb-4"
                                style={{ background: 'rgba(255,255,255,0.03)' }}>
                                {[
                                    { icon: <User size={14} />, label: 'Uploaded by', val: mat.uploaderName || 'Student' },
                                    { icon: <GraduationCap size={14} />, label: 'Teacher', val: mat.teacher || '—' },
                                    { icon: <Clock size={14} />, label: 'Updated', val: mat.createdAt?.toDate ? mat.createdAt.toDate().toLocaleDateString() : 'Recent' },
                                    { icon: <Download size={14} />, label: 'Downloads', val: mat.downloads || 0 },
                                ].map((m, i) => (
                                    <div key={i}>
                                        <div className="text-xs mb-1" style={{ color: 'var(--edu-muted)' }}>{m.label}</div>
                                        <div className="text-sm font-medium truncate" style={{ color: 'var(--edu-text)' }}>{m.val}</div>
                                    </div>
                                ))}
                            </section>

                            <div className="flex items-center gap-3 mb-4">
                                <Stars rating={mat.rating || 4.5} size={18} />
                                <span className="font-bold text-lg" style={{ color: 'var(--edu-text)' }}>{mat.rating || 4.5}</span>
                                <span className="text-sm" style={{ color: 'var(--edu-muted)' }}>({REVIEWS.length} reviews)</span>
                            </div>

                            <div className="text-sm leading-relaxed" style={{ color: 'var(--edu-muted)' }}>
                                <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--edu-text)' }}>Description</h2>
                                {mat.description}
                            </div>
                        </header>

                        <section className="card p-5">
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--edu-text)' }}>
                                <Tag size={15} className="text-indigo-400" /> Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(mat.tags)
                                    ? mat.tags
                                    : (mat.tags?.split(',') || [])
                                ).map((tag, idx) => (
                                    <span key={idx} className="badge bg-indigo-500/10 text-indigo-400">
                                        #{tag.trim()}
                                    </span>
                                ))}
                                {(!mat.tags || (Array.isArray(mat.tags) && mat.tags.length === 0)) && (
                                    <span className="text-xs text-slate-500 italic">No tags</span>
                                )}
                            </div>
                        </section>

                        <section className="card p-6">
                            <h3 className="font-bold text-base mb-5" style={{ color: 'var(--edu-text)' }}>Community Reviews</h3>
                            <div className="space-y-4">
                                {REVIEWS.map(r => (
                                    <div key={r.id} className="p-4 rounded-xl bg-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                                                    {r.user[0]}
                                                </div>
                                                <span className="text-sm font-medium">{r.user}</span>
                                            </div>
                                            <Stars rating={r.rating} size={12} />
                                        </div>
                                        <p className="text-sm text-slate-400">{r.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Preview Section */}
                        <div id="preview" className="mt-8 pt-8 border-t border-slate-800">
                            <h3 className="section-title mb-4 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--edu-text)' }}>
                                <FileText size={18} className="text-indigo-400" /> Document Preview
                            </h3>
                            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[3/4] md:aspect-video relative group shadow-2xl">
                                {mat.fileUrl?.toLowerCase().endsWith('.pdf') || mat.fileUrl?.includes('/upload/') ? (
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(mat.fileUrl)}&embedded=true`}
                                        className="w-full h-full border-none"
                                        title="Material Preview"
                                        onError={(e) => console.error('Iframe error:', e)}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 p-10 text-center">
                                        <FileText size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm font-medium mb-2">Preview support is limited for this format</p>
                                        <p className="text-xs opacity-60 mb-6">If the document doesn't appear above, please use the direct links below.</p>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button onClick={handleDownload} className="btn-primary py-2 px-6 text-xs">
                                                Download Free
                                            </button>
                                            <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 px-6 text-xs text-center inline-flex items-center gap-1">
                                                <Globe size={14} /> View Original
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 px-2 gap-3">
                            <p className="text-[10px] text-slate-500 italic text-center sm:text-left">
                                Document rendering via Google Cloud Services.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-medium">
                                    <Globe size={11} /> Source Link
                                </a>
                                <button onClick={handleDownload} className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                                    <Download size={11} /> Force Download
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions Sidebar */}
                    <aside className="space-y-5">
                        <div className="card p-6 text-center">
                            <div className="text-4xl font-bold mb-1 gradient-text">PDF</div>
                            <p className="text-xs mb-5 text-slate-500">Verified educational resource</p>

                            <button onClick={handleDownload} className="btn-primary w-full justify-center py-3 glow mb-3 no-underline">
                                <Download size={17} /> {downloaded ? 'Downloading...' : 'Download Free'}
                            </button>

                            <button
                                onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-secondary w-full justify-center py-2 mb-3 no-underline text-xs"
                            >
                                <BookOpen size={14} /> Read Online (Preview)
                            </button>

                            <button onClick={() => setBookmarked(!bookmarked)} className="btn-secondary w-full justify-center py-2.5">
                                <Bookmark size={15} className={bookmarked ? 'fill-yellow-400 text-yellow-500' : ''} />
                                {bookmarked ? 'Bookmarked' : 'Save for Later'}
                            </button>
                        </div>

                        <div className="card p-5">
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Share2 size={15} className="text-indigo-400" /> Share Resource
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="py-2 rounded-lg text-xs bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">Copy Link</button>
                                <button className="py-2 rounded-lg text-xs bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">WhatsApp</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article >
    )
}
