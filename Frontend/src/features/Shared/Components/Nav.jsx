import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
    const { handleLogout } = useAuth()
    const user = useSelector(state => state.auth.user)

    return (
        <nav className="px-6 lg:px-12 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-50" style={{ borderColor: '#E2E8F0' }}>
            <Link to="/"
                className="text-xl font-bold tracking-tight text-[#4F46E5] hover:opacity-80 transition-opacity font-['Plus_Jakarta_Sans']"
            >
                HostelMart.in
            </Link>
            <div className="flex gap-4 items-center text-sm font-medium text-slate-600">
                <Link to="/" className="hidden md:block transition-colors hover:text-[#4F46E5]">Home</Link>
                {user ? (
                    <>
                        <Link to="/post-ad" className="transition-colors bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm">
                            List new Product
                        </Link>
                        <Link to="/watchlist" className="hidden md:flex items-center gap-1 transition-colors hover:text-[#4F46E5]" title="Watchlist">
                            🔖 <span className="hidden lg:inline">Watchlist</span>
                        </Link>
                        <Link to="/dashboard" className="transition-colors hover:text-[#4F46E5]">My Ads</Link>
                        <Link to="/profile" className="transition-colors hover:text-[#4F46E5]">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                                {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="transition-colors hover:text-red-500 text-slate-500"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="transition-colors hover:text-[#4F46E5]">Sign In</Link>
                        <Link to="/register" className="transition-colors bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Nav