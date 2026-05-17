import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';

const ProductDetail = () => {
    const { productId } = useParams();
    const [ product, setProduct ] = useState(null);
    const [ selectedImage, setSelectedImage ] = useState(0);
    const [ watchlistLoading, setWatchlistLoading ] = useState(false);
    const { handleGetProductById, handleAddToWatchlist, handleRemoveFromWatchlist } = useProduct();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const watchlist = useSelector(state => state.product.watchlist);

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const data = await handleGetProductById(productId);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product details", error);
            }
        }
        fetchProductDetails();
    }, [ productId, handleGetProductById ]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
        );
    }

    const displayImages = product.images && product.images.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/600x600?text=No+Image' }];

    const isInWatchlist = watchlist && watchlist.some(w => (w._id || w) === productId);

    const handleContactSeller = () => {
        if (!product.contactNumber) {
            alert('Contact number not available.');
            return;
        }
        const message = `Hi! I'm interested in your ad "${product.title}" listed on HostelMart for ₹${product.price}. Is it still available?`;
        const whatsappUrl = `https://wa.me/91${product.contactNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleToggleWatchlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                await handleRemoveFromWatchlist(productId);
            } else {
                await handleAddToWatchlist(productId);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWatchlistLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', background: '#FAFAFA', minHeight: '100vh', paddingBottom: 80, paddingTop: 100, WebkitFontSmoothing: 'antialiased', position: 'relative', overflow: 'hidden' }}>
            
            {/* Background Glows */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(96,177,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
                
                {/* Back Button */}
                <button onClick={() => navigate(-1)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '8px 16px',
                    color: '#4B5563', fontFamily: 'Inter', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer', marginBottom: 24, backdropFilter: 'blur(10px)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Marketplace
                </button>

                <div style={{
                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.9)', borderRadius: 24,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
                    display: 'grid', gridTemplateColumns: '1fr', overflow: 'hidden'
                }} className="product-grid">
                    <style>{`@media(min-width: 860px) { .product-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
                    
                    {/* ── LEFT: Image Gallery ── */}
                    <div style={{ padding: 32, background: 'linear-gradient(145deg, #F8FAFC 0%, #F1F5F9 100%)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{
                            width: '100%', aspectRatio: '1', borderRadius: 20, background: '#fff',
                            border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden', position: 'relative',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                            <img
                                src={displayImages[selectedImage]?.url}
                                alt={product.title}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }}
                            />
                            {product.isSold && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 24px', borderRadius: 999, fontWeight: 800, fontSize: 16, border: '1px solid #FECACA', boxShadow: '0 4px 12px rgba(220,38,38,0.1)' }}>
                                        SOLD OUT
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        style={{
                                            flexShrink: 0, width: 72, height: 72, borderRadius: 14, overflow: 'hidden',
                                            border: `2px solid ${selectedImage === idx ? '#4F46E5' : 'transparent'}`,
                                            background: '#fff', cursor: 'pointer', padding: 0,
                                            opacity: selectedImage === idx ? 1 : 0.6, transition: 'all 0.2s',
                                            boxShadow: selectedImage === idx ? '0 2px 8px rgba(79,70,229,0.2)' : 'none'
                                        }}
                                        onMouseEnter={e => { if (selectedImage !== idx) e.currentTarget.style.opacity = 0.9; }}
                                        onMouseLeave={e => { if (selectedImage !== idx) e.currentTarget.style.opacity = 0.6; }}
                                    >
                                        <img src={img.url} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product Details ── */}
                    <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{ background: '#EEF2FF', color: '#4338CA', borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 10px' }}>
                                {product.category}
                            </span>
                            {product.negotiable && (
                                <span style={{ background: '#DCFCE7', color: '#15803D', borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 10px' }}>
                                    Negotiable
                                </span>
                            )}
                        </div>

                        <h1 style={{ fontFamily: 'Fustat, "Plus Jakarta Sans", Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 36px)', color: '#0D0F1A', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-1px' }}>
                            {product.title}
                        </h1>

                        <div style={{ fontFamily: 'Fustat, sans-serif', fontSize: 42, fontWeight: 800, color: '#4F46E5', marginBottom: 32, letterSpacing: '-1px' }}>
                            ₹{product.price}
                        </div>

                        {/* Seller Metadata Bento */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                            <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', border: '1px solid #E2E8F0' }}>
                                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Location</span>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{product.hostelBlock}</span>
                            </div>
                            <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', border: '1px solid #E2E8F0' }}>
                                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Seller Year</span>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{product.sellerYear}</span>
                            </div>
                            {product.sellerId?.fullname && (
                                <div style={{ background: '#F8FAFC', borderRadius: 16, padding: '16px', border: '1px solid #E2E8F0', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338CA', fontWeight: 800 }}>
                                        {product.sellerId.fullname.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Listed By</span>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{product.sellerId.fullname}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: 40, flex: 1 }}>
                            <h3 style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Details</h3>
                            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
                            <button
                                onClick={handleContactSeller}
                                disabled={product.isSold}
                                style={{
                                    width: '100%', padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    background: product.isSold ? '#E2E8F0' : '#25D366',
                                    color: product.isSold ? '#94A3B8' : '#fff',
                                    border: 'none', cursor: product.isSold ? 'not-allowed' : 'pointer',
                                    boxShadow: product.isSold ? 'none' : '0 8px 24px rgba(37,211,102,0.25)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={e => { if (!product.isSold) e.currentTarget.style.transform = 'translateY(-2px)' }}
                                onMouseLeave={e => { if (!product.isSold) e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                                {!product.isSold && (
                                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                )}
                                {product.isSold ? 'Item Sold' : 'Contact on WhatsApp'}
                            </button>

                            <button
                                onClick={handleToggleWatchlist}
                                disabled={watchlistLoading}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: 16, fontSize: 14, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    background: isInWatchlist ? '#EEF2FF' : '#fff',
                                    color: isInWatchlist ? '#4F46E5' : '#475569',
                                    border: `1px solid ${isInWatchlist ? '#C7D2FE' : '#E2E8F0'}`,
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { if(!isInWatchlist) { e.currentTarget.style.borderColor = '#C7D2FE'; e.currentTarget.style.color = '#4F46E5'; } }}
                                onMouseLeave={e => { if(!isInWatchlist) { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; } }}
                            >
                                {watchlistLoading ? '...' : isInWatchlist ? '🔖 Saved to Watchlist' : '🔖 Save to Watchlist'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;