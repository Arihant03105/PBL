import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, loginWithGoogle } = useAuth()
    const navigate = useNavigate()

    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(form.email, form.password)
            navigate('/dashboard')
        } catch (err) {
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password. Please try again.')
            } else if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.')
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.')
            } else {
                setError('Failed to sign in. Please check your details.')
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
                setError('Sign-in cancelled. Please keep the window open.')
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Google sign-in is not enabled in Firebase. Please contact support.')
            } else {
                setError(`Google sign-in failed: ${err.code || err.message}`)
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 grid-bg relative">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-64 blur-3xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 glow"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <BookOpen size={26} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Welcome back
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--edu-muted)' }}>
                        Sign in to your EduExchange account
                    </p>
                </div>

                {/* Card */}
                <div className="card p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg text-sm"
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                                <AlertCircle size={15} />
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--edu-text)' }}>Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                    className="input-field pl-10" placeholder="college@email.edu" required />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--edu-text)' }}>Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }} />
                                <input type={showPass ? 'text' : 'password'} name="password"
                                    value={form.password} onChange={handleChange}
                                    className="input-field pl-10 pr-10" placeholder="your password" required />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--edu-muted)' }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange}
                                    className="w-4 h-4 rounded accent-indigo-500" />
                                <span className="text-sm" style={{ color: 'var(--edu-muted)' }}>Remember me</span>
                            </label>
                            <a href="#" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: '#a5b4fc' }}>
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center py-3 glow text-base"
                            style={{ opacity: loading ? 0.7 : 1 }}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <><LogIn size={17} /> Sign In</>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3">
                            <div className="flex-1 h-px" style={{ background: 'var(--edu-border)' }} />
                            <span className="text-xs" style={{ color: 'var(--edu-muted)' }}>or continue with</span>
                            <div className="flex-1 h-px" style={{ background: 'var(--edu-border)' }} />
                        </div>

                        {/* Google SSO */}
                        <button type="button" onClick={handleGoogleLogin} disabled={loading}
                            className="btn-secondary w-full justify-center py-3"
                            style={{ opacity: loading ? 0.7 : 1 }}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {loading ? 'Sign-in...' : 'Sign in with Google'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-5 text-sm" style={{ color: 'var(--edu-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium hover:text-indigo-400 transition-colors" style={{ color: '#a5b4fc' }}>
                        Register here <ArrowRight size={13} className="inline" />
                    </Link>
                </p>
            </div>
        </div>
    )
}
