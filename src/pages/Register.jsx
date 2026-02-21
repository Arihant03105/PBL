import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const perks = [
    'Access 12,000+ study materials',
    'Upload and share your own notes',
    'Rate and review resources',
    'Build your academic portfolio',
]

export default function Register() {
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', rollno: '', semester: '', password: '', agree: false })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register, loginWithGoogle } = useAuth()
    const navigate = useNavigate()

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.agree) { setError('Please accept the Terms of Service to continue.'); return }
        if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
        setError('')
        setLoading(true)
        try {
            await register(form.email, form.password, {
                name: form.name,
                rollno: form.rollno,
                semester: form.semester,
            })
            navigate('/dashboard')
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Try logging in instead.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.')
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.')
            } else {
                setError('Registration failed. Please try again.')
            }
        }
        setLoading(false)
    }

    async function handleGoogleLogin() {
        setError('')
        setLoading(true)
        try {
            await loginWithGoogle()
            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-up cancelled. Please keep the window open.')
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Google sign-in is not enabled in Firebase. Please contact support.')
            } else {
                setError(`Google sign-up failed: ${err.code || err.message}`)
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 grid-bg relative overflow-hidden">
            <div className="absolute top-1/3 right-1/4 w-80 h-80 blur-3xl opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
                {/* Left — info panel */}
                <div className="hidden lg:flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <GraduationCap size={26} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Join <span className="gradient-text">EduExchange</span>
                    </h2>
                    <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--edu-muted)' }}>
                        A community of students sharing, verifying, and growing together through collaborative academic resources.
                    </p>
                    <ul className="space-y-3">
                        {perks.map((p, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--edu-text)' }}>
                                <CheckCircle size={17} className="text-indigo-400 shrink-0" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right — form */}
                <div>
                    <div className="lg:hidden text-center mb-6">
                        <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold">Create your account</h1>
                    </div>

                    <div className="card p-8">
                        <h2 className="text-xl font-bold mb-6 hidden lg:block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Create Account
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg text-sm"
                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                                    <AlertCircle size={15} />
                                    {error}
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--edu-text)' }}>Full Name</label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                                    <input type="text" name="name" value={form.name} onChange={handleChange}
                                        className="input-field pl-10" placeholder="Full name" required />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--edu-text)' }}>College Email</label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                                    <input type="email" name="email" value={form.email} onChange={handleChange}
                                        className="input-field pl-10" placeholder="college@email.edu" required />
                                </div>
                            </div>

                            {/* Roll No & Semester */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--edu-text)' }}>Roll Number</label>
                                    <input type="text" name="rollno" value={form.rollno} onChange={handleChange}
                                        className="input-field px-4" placeholder="22MCS1001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--edu-text)' }}>Semester</label>
                                    <select name="semester" value={form.semester} onChange={handleChange} className="input-field"
                                        style={{ cursor: 'pointer' }}>
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--edu-text)' }}>Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                                    <input type={showPass ? 'text' : 'password'} name="password"
                                        value={form.password} onChange={handleChange}
                                        className="input-field pl-10 pr-10" placeholder="at least 8 characters" required />
                                    <button type="button" onClick={() => setShowPass(s => !s)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }}>
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Agree */}
                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange}
                                    className="mt-0.5 w-4 h-4 rounded accent-indigo-500" />
                                <span className="text-xs leading-relaxed" style={{ color: 'var(--edu-muted)' }}>
                                    I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and{' '}
                                    <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
                                </span>
                            </label>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="btn-primary w-full justify-center py-3 text-base glow"
                                style={{ opacity: loading ? 0.7 : 1 }}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    <>Create Account <ArrowRight size={16} /></>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative flex items-center gap-3 my-2">
                                <div className="flex-1 h-px" style={{ background: 'var(--edu-border)' }} />
                                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--edu-muted)' }}>or continue with</span>
                                <div className="flex-1 h-px" style={{ background: 'var(--edu-border)' }} />
                            </div>

                            {/* Google SSO */}
                            <button type="button" onClick={handleGoogleLogin} disabled={loading}
                                className="btn-secondary w-full justify-center py-2.5 text-sm"
                                style={{ opacity: loading ? 0.7 : 1 }}>
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {loading ? 'Sign-up...' : 'Sign up with Google'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-4 text-sm" style={{ color: 'var(--edu-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium hover:text-indigo-400 transition-colors" style={{ color: '#a5b4fc' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
