import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
    const { handleLogout } = useAuth()
    const user = useSelector(state => state.auth.user)
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[18px] px-4 pointer-events-none">
            <nav
                className="pointer-events-auto flex items-center gap-2 px-3 py-2 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.35)',
                    backdropFilter: 'blur(50px)',
                    WebkitBackdropFilter: 'blur(50px)',
                    borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: 'inset 0px 4px 4px rgba(255,255,255,0.25), 0 4px 24px rgba(79,70,229,0.06)',
                }}
            >
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-1.5 mr-1"
                    style={{ fontFamily: 'Fustat, Inter, sans-serif', fontWeight: 800, fontSize: '17px', color: '#4F46E5', letterSpacing: '-0.4px', textDecoration: 'none' }}
                >
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                        color: '#fff', fontSize: 13, fontWeight: 900
                    }}>H</span>
                    HostelMart
                </Link>

                {/* Divider */}
                <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,0.08)', borderRadius: 1 }} />

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { to: '/', label: 'Home' },
                        { to: '/', label: 'Marketplace' },
                        { to: '/dashboard', label: 'My Listings' },
                        { to: '/watchlist', label: 'Watchlist' },
                    ].map(({ to, label }) => (
                        <Link
                            key={label}
                            to={to}
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '13.5px',
                                color: '#374151',
                                padding: '6px 12px',
                                borderRadius: 10,
                                textDecoration: 'none',
                                transition: 'background 0.15s, color 0.15s',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(79,70,229,0.07)'; e.target.style.color = '#4F46E5' }}
                            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#374151' }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Divider */}
                <div className="hidden md:block" style={{ width: 1, height: 22, background: 'rgba(0,0,0,0.08)', borderRadius: 1 }} />

                {/* Auth Section */}
                {user ? (
                    <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 800, fontSize: 13,
                                border: '2px solid rgba(255,255,255,0.6)',
                                cursor: 'pointer',
                            }}>
                                {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </Link>

                        {/* Upload Listing CTA */}
                        <button
                            onClick={() => navigate('/post-ad')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(79,70,229,0.88)',
                                backdropFilter: 'blur(2px)',
                                WebkitBackdropFilter: 'blur(2px)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '14px',
                                padding: '7px 14px 7px 9px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                boxShadow: 'inset 0px 3px 3px rgba(255,255,255,0.25), 0 2px 8px rgba(79,70,229,0.35)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = 'inset 0px 3px 3px rgba(255,255,255,0.25), 0 4px 16px rgba(79,70,229,0.45)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'inset 0px 3px 3px rgba(255,255,255,0.25), 0 2px 8px rgba(79,70,229,0.35)' }}
                        >
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 22, height: 22, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.22)', fontSize: 12, fontWeight: 700
                            }}>↑</span>
                            List new Product
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:block"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px',
                                color: '#9CA3AF', padding: '6px 10px', borderRadius: 10,
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => e.target.style.color = '#EF4444'}
                            onMouseLeave={e => e.target.style.color = '#9CA3AF'}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            style={{
                                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13.5px',
                                color: '#374151', padding: '7px 14px', borderRadius: 12, textDecoration: 'none',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => e.target.style.color = '#4F46E5'}
                            onMouseLeave={e => e.target.style.color = '#374151'}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(79,70,229,0.88)',
                                color: '#fff',
                                borderRadius: '14px',
                                padding: '7px 16px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '13px',
                                textDecoration: 'none',
                                boxShadow: 'inset 0px 3px 3px rgba(255,255,255,0.25), 0 2px 8px rgba(79,70,229,0.3)',
                                transition: 'transform 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default Nav