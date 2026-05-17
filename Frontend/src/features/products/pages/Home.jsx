import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';
import HeroSection from '../components/HeroSection';

const CATEGORIES = [
    { id: 'coolers',     name: 'Coolers',     emoji: '❄️', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
    { id: 'cycles',      name: 'Cycles',      emoji: '🚲', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    { id: 'books',       name: 'Books',       emoji: '📚', bg: '#FEFCE8', border: '#FDE68A', text: '#92400E' },
    { id: 'electronics', name: 'Electronics', emoji: '💻', bg: '#FAF5FF', border: '#E9D5FF', text: '#7E22CE' },
    { id: 'mattresses',  name: 'Mattresses',  emoji: '🛏️', bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
    { id: 'tables',      name: 'Tables',      emoji: '🪑', bg: '#FFF1F2', border: '#FECDD3', text: '#BE123C' },
    { id: 'chairs',      name: 'Chairs',      emoji: '🪑', bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
    { id: 'others',      name: 'Others',      emoji: '📦', bg: '#F8FAFC', border: '#E2E8F0', text: '#475569' },
];

const Home = () => {
    const products  = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const navigate  = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchInput,      setSearchInput]      = useState('');
    const [searchQuery,      setSearchQuery]      = useState('');

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        handleGetAllProducts({ category: selectedCategory, search: searchQuery });
    }, [handleGetAllProducts, selectedCategory, searchQuery]);

    const handleCategoryToggle = id => {
        setSelectedCategory(prev => prev === id ? '' : id);
        setSearchInput(''); setSearchQuery('');
    };

    const handleSearchSubmit = e => {
        e.preventDefault();
        setSelectedCategory('');
        setSearchQuery(searchInput);
    };

    const clearFilters = () => { setSelectedCategory(''); setSearchInput(''); setSearchQuery(''); };
    const isFiltered   = selectedCategory || searchQuery;

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', background: '#FAFAFA', minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>

            {/* ── Liquid Glass Hero ── */}
            <HeroSection
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

            {/* ── Marketplace Feed ── */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 100px' }}>

                {/* Categories */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h2 style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontWeight: 800, fontSize: 22, color: '#0D0F1A', margin: 0, letterSpacing: '-0.5px' }}>
                            Browse by Category
                        </h2>
                        {isFiltered && (
                            <button onClick={clearFilters} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: 13.5, color: '#4F46E5', cursor: 'pointer' }}>
                                Clear all ×
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}
                        className="cat-grid"
                    >
                        <style>{`@media(min-width:640px){.cat-grid{grid-template-columns:repeat(8,1fr)!important;}}`}</style>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryToggle(cat.id)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                                    padding: '12px 6px',
                                    borderRadius: 14,
                                    border: `2px solid ${cat.id === selectedCategory ? '#4F46E5' : cat.border}`,
                                    background: cat.bg,
                                    cursor: 'pointer',
                                    transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                                    transform: cat.id === selectedCategory ? 'scale(1.06)' : 'scale(1)',
                                    boxShadow: cat.id === selectedCategory ? '0 4px 16px rgba(79,70,229,0.18)' : 'none',
                                    outline: 'none',
                                }}
                                onMouseEnter={e => { if (cat.id !== selectedCategory) e.currentTarget.style.transform = 'scale(1.04)' }}
                                onMouseLeave={e => { if (cat.id !== selectedCategory) e.currentTarget.style.transform = 'scale(1)' }}
                            >
                                <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 11, color: cat.text, lineHeight: 1.3, textAlign: 'center' }}>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feed Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontWeight: 800, fontSize: 20, color: '#0D0F1A', margin: 0, letterSpacing: '-0.4px' }}>
                        {searchQuery
                            ? <>Results for &ldquo;{searchQuery}&rdquo; <span style={{ fontWeight: 500, color: '#9CA3AF', fontSize: 15 }}>({products?.length || 0})</span></>
                            : selectedCategory
                                ? <>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} <span style={{ fontWeight: 500, color: '#9CA3AF', fontSize: 15 }}>({products?.length || 0})</span></>
                                : <>Recently Listed <span style={{ fontWeight: 500, color: '#9CA3AF', fontSize: 15 }}>({products?.length || 0})</span></>
                        }
                    </h2>
                </div>

                {/* Product Grid */}
                {products && products.length > 0 ? (
                    <div style={{ display: 'grid', gap: 18 }} className="prod-grid">
                        <style>{`
                            .prod-grid { grid-template-columns: 1fr; }
                            @media(min-width:540px)  { .prod-grid { grid-template-columns: repeat(2, 1fr); } }
                            @media(min-width:900px)  { .prod-grid { grid-template-columns: repeat(3, 1fr); } }
                            @media(min-width:1200px) { .prod-grid { grid-template-columns: repeat(4, 1fr); } }
                        `}</style>

                        {products.map(product => {
                            const imageUrl = product.images?.length > 0
                                ? product.images[0].url
                                : 'https://via.placeholder.com/400x300?text=No+Image';

                            return (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    style={{
                                        background: '#fff',
                                        borderRadius: 18,
                                        border: '1px solid #E5E7EB',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        display: 'flex', flexDirection: 'column',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                                    }}
                                >
                                    {/* Image */}
                                    <div style={{ height: 168, position: 'relative', background: '#F1F5F9', overflow: 'hidden', flexShrink: 0 }}>
                                        <img
                                            src={imageUrl}
                                            alt={product.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                        />
                                        {product.isSold && (
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: 'rgba(255,255,255,0.76)',
                                                backdropFilter: 'blur(3px)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span style={{
                                                    background: '#FEE2E2', color: '#B91C1C',
                                                    padding: '5px 16px', borderRadius: 999,
                                                    fontWeight: 800, fontSize: 12, border: '1px solid #FECACA',
                                                }}>SOLD</span>
                                            </div>
                                        )}
                                        {product.negotiable && !product.isSold && (
                                            <span style={{
                                                position: 'absolute', top: 10, right: 10,
                                                background: '#DCFCE7', color: '#15803D',
                                                fontSize: 10, fontWeight: 800, padding: '3px 9px',
                                                borderRadius: 999, border: '1px solid #BBF7D0',
                                            }}>Negotiable</span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <h3 style={{
                                                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14.5,
                                                color: '#111827', margin: 0, lineHeight: 1.35,
                                                overflow: 'hidden', display: '-webkit-box',
                                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                flex: 1, paddingRight: 8,
                                            }}>{product.title}</h3>
                                            <span style={{ fontWeight: 800, fontSize: 15, color: '#4F46E5', flexShrink: 0 }}>₹{product.price}</span>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 'auto' }}>
                                            {[product.hostelBlock, product.sellerYear, product.category].filter(Boolean).map(tag => (
                                                <span key={tag} style={{
                                                    background: '#F1F5F9', color: '#475569',
                                                    fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999,
                                                }}>{tag}</span>
                                            ))}
                                        </div>

                                        <button
                                            style={{
                                                marginTop: 14,
                                                width: '100%', padding: '9px 0',
                                                borderRadius: 10, border: 'none',
                                                fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13,
                                                cursor: product.isSold ? 'not-allowed' : 'pointer',
                                                background: product.isSold ? '#F1F5F9' : '#EEF2FF',
                                                color: product.isSold ? '#9CA3AF' : '#4338CA',
                                                transition: 'background 0.15s',
                                            }}
                                            disabled={product.isSold}
                                        >
                                            {product.isSold ? 'Unavailable' : 'View Details →'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 24,
                        padding: '80px 24px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                        <h2 style={{ fontFamily: '"Plus Jakarta Sans", Inter', fontWeight: 800, fontSize: 20, color: '#111827', marginBottom: 8 }}>
                            No items found.
                        </h2>
                        <p style={{ color: '#9CA3AF', fontWeight: 500, fontSize: 15, marginBottom: 24 }}>
                            {isFiltered ? 'Try a different search or clear the filter.' : 'Be the first to list a product!'}
                        </p>
                        {isFiltered && (
                            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;