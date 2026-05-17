import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

/* ── Floating Product Cards data ── */
const FLOAT_CARDS = [
    { emoji: '❄️', title: 'Symphony Cooler', price: '₹2,200', tag: 'Block C', color: '#EEF2FF', accent: '#4F46E5', delay: '0s' },
    { emoji: '🚲', title: 'Atlas Cycle', price: '₹3,500', tag: 'Block A', color: '#F0FDF4', accent: '#16A34A', delay: '0.6s' },
    { emoji: '📚', title: 'Chemistry Bundle', price: '₹450', tag: 'Block B', color: '#FFFBEB', accent: '#D97706', delay: '1.2s' },
    { emoji: '💻', title: 'Boat Earphones', price: '₹800', tag: 'Block D', color: '#FDF4FF', accent: '#9333EA', delay: '0.3s' },
    { emoji: '🛏️', title: 'Foam Mattress', price: '₹1,100', tag: 'Block F', color: '#FFF7ED', accent: '#EA580C', delay: '0.9s' },
];

const CATEGORY_ICONS = [
    { emoji: '❄️', label: 'Coolers' },
    { emoji: '🚲', label: 'Cycles' },
    { emoji: '📚', label: 'Books' },
    { emoji: '💻', label: 'Electronics' },
    { emoji: '🪑', label: 'Furniture' },
    { emoji: '🔦', label: 'Study Lamps' },
];

const FloatingCard = ({ card, index }) => {
    const positions = [
        { top: '8%',  left: '5%'  },
        { top: '28%', right: '2%' },
        { top: '55%', left: '2%'  },
        { top: '72%', right: '6%' },
        { top: '18%', left: '48%' },
    ];
    const pos = positions[index % positions.length];

    return (
        <div
            className="absolute select-none"
            style={{
                ...pos,
                animation: `floatCard 5s ease-in-out infinite`,
                animationDelay: card.delay,
            }}
        >
            <div style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.85)',
                boxShadow: '0 8px 32px rgba(79,70,229,0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                minWidth: 170,
            }}>
                <span style={{
                    fontSize: 26, width: 42, height: 42, borderRadius: 12,
                    background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>{card.emoji}</span>
                <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#111827', lineHeight: 1.3 }}>{card.title}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 3, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 13, color: card.accent }}>{card.price}</span>
                        <span style={{ background: card.color, color: card.accent, fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{card.tag}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HeroSection = ({ searchInput, setSearchInput, onSearchSubmit }) => {
    const navigate = useNavigate();

    return (
        <>
            {/* ── Font Imports ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

                @keyframes floatCard {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33%       { transform: translateY(-10px) rotate(0.5deg); }
                    66%       { transform: translateY(-5px) rotate(-0.3deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.55; }
                    50%       { opacity: 0.80; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes badgePop {
                    0%   { opacity: 0; transform: scale(0.85); }
                    100% { opacity: 1; transform: scale(1);    }
                }
                .hero-cta-primary:hover { transform: scale(1.025); box-shadow: 0 8px 30px rgba(79,70,229,0.38) !important; }
                .hero-cta-secondary:hover { background: rgba(79,70,229,0.06) !important; border-color: rgba(79,70,229,0.35) !important; }
                .search-bar:focus-within { box-shadow: 0 0 0 3px rgba(79,70,229,0.18) !important; }
                -webkit-font-smoothing: antialiased;
            `}</style>

            {/* ── Hero Wrapper ── */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                background: '#FAFAFA',
                overflow: 'hidden',
                WebkitFontSmoothing: 'antialiased',
            }}>

                {/* ── Background Glow Ellipses ── */}
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                    {/* Top-left cyan blob */}
                    <div style={{
                        position: 'absolute', top: '-120px', left: '-100px',
                        width: 600, height: 500,
                        background: 'radial-gradient(ellipse, rgba(184,230,255,0.55) 0%, rgba(96,177,255,0.25) 50%, transparent 75%)',
                        borderRadius: '50%',
                        animation: 'pulseGlow 7s ease-in-out infinite',
                    }} />
                    {/* Top-right indigo blob */}
                    <div style={{
                        position: 'absolute', top: '-80px', right: '-120px',
                        width: 550, height: 450,
                        background: 'radial-gradient(ellipse, rgba(79,70,229,0.14) 0%, rgba(99,102,241,0.08) 55%, transparent 80%)',
                        borderRadius: '50%',
                        animation: 'pulseGlow 9s ease-in-out infinite',
                        animationDelay: '2s',
                    }} />
                    {/* Mid-left soft blue */}
                    <div style={{
                        position: 'absolute', top: '40%', left: '-60px',
                        width: 320, height: 320,
                        background: 'radial-gradient(ellipse, rgba(96,177,255,0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }} />
                </div>

                {/* ── Main Content ── */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    maxWidth: 1200, margin: '0 auto',
                    padding: '0 28px',
                    paddingTop: 'max(120px, 14vh)',
                    paddingBottom: 80,
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 60,
                    alignItems: 'center',
                }}
                    className="lg-grid"
                >
                    <style>{`
                        @media (min-width: 1024px) {
                            .lg-grid { grid-template-columns: 1fr 1fr !important; gap: 80px !important; }
                        }
                    `}</style>

                    {/* ── LEFT: Hero Content ── */}
                    <div style={{ animation: 'slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both' }}>

                        {/* Social Proof Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            background: 'rgba(255,255,255,0.80)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: 999,
                            padding: '7px 16px 7px 10px',
                            marginBottom: 28,
                            boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
                            animation: 'badgePop 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
                        }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FF801E">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>
                            <span style={{
                                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#374151',
                            }}>
                                Trusted by hostel students across campus
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 style={{
                            fontFamily: 'Fustat, "Plus Jakarta Sans", Inter, sans-serif',
                            fontWeight: 800,
                            fontSize: 'clamp(46px, 6.5vw, 76px)',
                            lineHeight: 1.04,
                            letterSpacing: '-2.5px',
                            color: '#0D0F1A',
                            marginBottom: 22,
                            marginTop: 0,
                        }}>
                            Buy & Sell<br />
                            <span style={{ color: '#4F46E5' }}>Hostel Essentials</span><br />
                            Easily
                        </h1>

                        {/* Subheadline */}
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: 18,
                            lineHeight: 1.65,
                            letterSpacing: '-0.5px',
                            color: '#6B7280',
                            maxWidth: 460,
                            marginBottom: 40,
                            marginTop: 0,
                        }}>
                            A dedicated marketplace for hostel students to buy and sell second-hand items — without flooding WhatsApp groups.
                        </p>

                        {/* Search Bar */}
                        <form
                            onSubmit={onSearchSubmit}
                            className="search-bar"
                            style={{
                                display: 'flex',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(0,0,0,0.10)',
                                borderRadius: 16,
                                padding: 5,
                                marginBottom: 28,
                                boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                                transition: 'box-shadow 0.2s',
                                maxWidth: 500,
                            }}
                        >
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search coolers, books, cycles, Block A..."
                                style={{
                                    flex: 1, border: 'none', background: 'transparent',
                                    fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14,
                                    color: '#111827', padding: '10px 14px', outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    background: 'rgba(79,70,229,0.90)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '10px 20px',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 700,
                                    fontSize: 13.5,
                                    cursor: 'pointer',
                                    boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2)',
                                    transition: 'background 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Search →
                            </button>
                        </form>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {/* Primary */}
                            <button
                                className="hero-cta-primary"
                                onClick={() => navigate('/')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    background: 'rgba(79,70,229,0.85)',
                                    backdropFilter: 'blur(2px)',
                                    WebkitBackdropFilter: 'blur(2px)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 16,
                                    padding: '13px 22px 13px 14px',
                                    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15,
                                    cursor: 'pointer',
                                    boxShadow: 'inset 0px 4px 4px rgba(255,255,255,0.35), 0 4px 18px rgba(79,70,229,0.28)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                            >
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.20)', fontSize: 15,
                                }}>→</span>
                                Explore Marketplace
                            </button>

                            {/* Secondary */}
                            <button
                                className="hero-cta-secondary"
                                onClick={() => navigate('/post-ad')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(255,255,255,0.55)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    color: '#374151',
                                    border: '1px solid rgba(0,0,0,0.11)',
                                    borderRadius: 16,
                                    padding: '13px 22px',
                                    fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                    transition: 'background 0.2s, border-color 0.2s',
                                }}
                            >
                                ↑ Sell an Item
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT: Visual ── */}
                    <div style={{
                        position: 'relative',
                        height: 'clamp(360px, 55vw, 560px)',
                        animation: 'fadeIn 0.9s 0.2s both',
                    }}>
                        {/* Base glass panel */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(145deg, rgba(238,242,255,0.7) 0%, rgba(224,231,255,0.45) 50%, rgba(219,234,254,0.4) 100%)',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderRadius: 32,
                            border: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: '0 24px 80px rgba(79,70,229,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
                            overflow: 'hidden',
                        }}>
                            {/* Inner glow */}
                            <div style={{
                                position: 'absolute', top: '15%', left: '20%',
                                width: '65%', height: '65%',
                                background: 'radial-gradient(ellipse, rgba(99,102,241,0.13) 0%, transparent 70%)',
                                borderRadius: '50%',
                                animation: 'pulseGlow 6s ease-in-out infinite',
                            }} />
                        </div>

                        {/* Floating Product Cards */}
                        {FLOAT_CARDS.map((card, i) => (
                            <FloatingCard key={i} card={card} index={i} />
                        ))}

                        {/* Live badge */}
                        <div style={{
                            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(0,0,0,0.07)',
                            borderRadius: 999,
                            padding: '8px 18px',
                            display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            whiteSpace: 'nowrap',
                        }}>
                            <span style={{
                                width: 8, height: 8, borderRadius: '50%', background: '#22C55E',
                                boxShadow: '0 0 0 3px rgba(34,197,94,0.22)',
                                display: 'inline-block', animation: 'pulseGlow 2s ease-in-out infinite',
                            }} />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                                Live student listings
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Trust Bar ── */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    padding: '24px 28px',
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}>
                    <div style={{
                        maxWidth: 1200, margin: '0 auto',
                        display: 'flex', alignItems: 'center',
                        gap: 12, flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        <span style={{
                            fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12.5,
                            color: '#9CA3AF', letterSpacing: 0.3, textTransform: 'uppercase',
                            marginRight: 8, whiteSpace: 'nowrap',
                        }}>
                            Used daily by hostel students for
                        </span>
                        {CATEGORY_ICONS.map(({ emoji, label }) => (
                            <div key={label} style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '5px 14px', borderRadius: 999,
                                border: '1px solid rgba(0,0,0,0.07)',
                                background: 'rgba(255,255,255,0.7)',
                                opacity: 0.75,
                                filter: 'grayscale(40%)',
                                transition: 'opacity 0.2s, filter 0.2s',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'grayscale(0%)' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.filter = 'grayscale(40%)' }}
                            >
                                <span style={{ fontSize: 16 }}>{emoji}</span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12.5, color: '#4B5563' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;
