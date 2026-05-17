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
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24">
            <div className="max-w-6xl mx-auto px-6 py-8">
                
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Feed
                </button>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    
                    {/* ── LEFT: Image Gallery ── */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 md:border-r border-slate-200 bg-slate-50 flex flex-col items-center">
                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 relative shadow-sm">
                            <img
                                src={displayImages[selectedImage]?.url}
                                alt={product.title}
                                className="w-full h-full object-contain p-4"
                            />
                            {product.isSold && (
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                    <span className="bg-red-100 text-red-800 px-6 py-3 rounded-full font-bold text-xl shadow-sm border border-red-200">SOLD OUT</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto w-full pb-2 scrollbar-hide">
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product Details ── */}
                    <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
                        
                        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span className="bg-slate-100 px-3 py-1 rounded-full">{product.category}</span>
                            {product.negotiable && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Negotiable</span>}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-4 leading-tight">
                            {product.title}
                        </h1>

                        <div className="text-4xl font-bold text-indigo-600 mb-8 font-['Plus_Jakarta_Sans']">
                            ₹{product.price}
                        </div>

                        {/* Seller Metadata Bento Box */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hostel Block</span>
                                <span className="font-bold text-slate-900">{product.hostelBlock}</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Seller Year</span>
                                <span className="font-bold text-slate-900">{product.sellerYear}</span>
                            </div>
                            {product.sellerId?.fullname && (
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 col-span-2">
                                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Listed by</span>
                                    <span className="font-bold text-slate-900">{product.sellerId.fullname}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8 flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-3 font-['Plus_Jakarta_Sans']">Description</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex flex-col gap-3">
                            <button
                                onClick={handleContactSeller}
                                disabled={product.isSold}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-sm ${product.isSold ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#128C7E] text-white'}`}
                            >
                                {!product.isSold && (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                )}
                                {product.isSold ? 'Item Sold' : 'Contact on WhatsApp'}
                            </button>

                            <button
                                onClick={handleToggleWatchlist}
                                disabled={watchlistLoading}
                                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-colors ${
                                    isInWatchlist
                                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
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