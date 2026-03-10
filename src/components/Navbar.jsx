import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Bell, Search, Menu, X, Upload, LayoutDashboard, User, LogIn, LogOut, Sun, Moon, Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { currentUser, userProfile, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const navLinks = [
        { to: '/browse', label: 'Browse', icon: <Search size={16} /> },
        { to: '/upload', label: 'Upload', icon: <Upload size={16} /> },
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ]

    const isActive = (path) => location.pathname === path

    async function handleLogout() {
        await logout()
        navigate('/')
    }

    return (
        <nav className="sticky top-0 z-50 glass border-b transition-colors duration-300" style={{ borderColor: 'var(--edu-border)', background: 'var(--edu-surface)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center glow-sm transition-all group-hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                            <BookOpen size={16} className="text-white md:hidden" />
                            <BookOpen size={18} className="text-white hidden md:block" />
                        </div>
                        <span className="font-bold text-lg md:text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            <span className="gradient-text">Edu</span>
                            <span className="hidden sm:inline" style={{ color: 'var(--edu-text)' }}>Exchange</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    color: isActive(link.to) ? '#a5b4fc' : 'var(--edu-muted)',
                                    background: isActive(link.to) ? 'rgba(99,102,241,0.1)' : 'transparent',
                                }}>
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-1 md:gap-3">
                        <button
                            onClick={toggleTheme}
                            className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ color: 'var(--edu-muted)' }}>
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ color: 'var(--edu-muted)' }}>
                            <Bell size={18} />
                        </button>

                        <div className="hidden md:flex items-center gap-3">
                            {currentUser ? (
                                <>
                                    <Link to="/profile"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5"
                                        style={{ color: 'var(--edu-text)', border: '1px solid var(--edu-border)' }}>
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
                                            {userProfile?.name?.charAt(0)?.toUpperCase() || <User size={12} />}
                                        </div>
                                        {userProfile?.name?.split(' ')[0] || 'Profile'}
                                    </Link>
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/10"
                                        style={{ color: '#f87171' }}>
                                        <LogOut size={15} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-primary text-sm px-4 py-2">
                                        <LogIn size={15} />
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="btn-secondary text-sm px-4 py-2">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--edu-card)', color: 'var(--edu-text)' }}
                            onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t px-4 py-4 space-y-1 animate-fadeInUp" style={{ borderColor: 'var(--edu-border)', background: 'var(--edu-surface)' }}>
                    <Link to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                        style={{ color: isActive('/') ? '#a5b4fc' : 'var(--edu-muted)', background: isActive('/') ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                        <Home size={16} />
                        Home
                    </Link>
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                            style={{ color: isActive(link.to) ? '#a5b4fc' : 'var(--edu-muted)', background: isActive(link.to) ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                    {currentUser && (
                        <Link to="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
                            style={{ color: isActive('/profile') ? '#a5b4fc' : 'var(--edu-muted)', background: isActive('/profile') ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                            <User size={16} />
                            Profile
                        </Link>
                    )}
                    <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: 'var(--edu-border)' }}>
                        {currentUser ? (
                            <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                                className="btn-secondary flex-1 justify-center" style={{ color: '#f87171' }}>
                                <LogOut size={15} /> Logout
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn-primary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                                <Link to="/register" className="btn-secondary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

