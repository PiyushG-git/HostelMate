import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProduct, handleMarkAsSold, handleDeleteProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const navigate = useNavigate();
    const [loadingProductId, setLoadingProductId] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        handleGetSellerProduct();
    }, [handleGetSellerProduct]);

    const onMarkAsSold = async (productId, e) => {
        e.stopPropagation();
        if (window.confirm("Mark this item as sold? This action cannot be undone.")) {
            setLoadingProductId(productId);
            try {
                await handleMarkAsSold(productId);
                await handleGetSellerProduct();
            } catch (error) {
                console.error("Failed to mark as sold:", error);
            } finally {
                setLoadingProductId(null);
            }
        }
    };

    const onDelete = async (productId, e) => {
        e.stopPropagation();
        if (window.confirm("Delete this listing permanently? This cannot be undone.")) {
            setDeletingProductId(productId);
            try {
                await handleDeleteProduct(productId);
                await handleGetSellerProduct();
            } catch (error) {
                console.error("Failed to delete:", error);
            } finally {
                setDeletingProductId(null);
            }
        }
    };

    const filtered = activeTab === 'active'
        ? sellerProducts?.filter(p => !p.isSold)
        : activeTab === 'sold'
            ? sellerProducts?.filter(p => p.isSold)
            : sellerProducts;

    const activeCount = sellerProducts?.filter(p => !p.isSold).length || 0;
    const soldCount = sellerProducts?.filter(p => p.isSold).length || 0;

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 pt-[100px]">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-1">
                            My Listings
                        </h1>
                        <p className="text-slate-500">Manage your active ads and sold items.</p>
                    </div>
                    <button
                        onClick={() => navigate('/post-ad')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors whitespace-nowrap"
                    >
                        List new Product
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <div className="text-3xl font-bold text-slate-900">{sellerProducts?.length || 0}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Total Ads</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <div className="text-3xl font-bold text-indigo-600">{activeCount}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Active</div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <div className="text-3xl font-bold text-green-600">{soldCount}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Sold</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
                    {[
                        { id: 'all', label: `All (${sellerProducts?.length || 0})` },
                        { id: 'active', label: `Active (${activeCount})` },
                        { id: 'sold', label: `Sold (${soldCount})` },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {filtered && filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(product => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : 'https://via.placeholder.com/400x300?text=No+Image';

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-[20px] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.08)] flex flex-col transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div
                                        className="h-44 overflow-hidden relative bg-slate-50 cursor-pointer group"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                        {product.isSold && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-red-50 text-red-700 px-5 py-2 rounded-full font-bold text-sm border border-red-200 shadow-sm">SOLD</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                className="font-[800] font-['Fustat'] text-[17px] text-slate-900 line-clamp-1 flex-1 pr-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.title}
                                            </h3>
                                            <span className="font-[800] font-['Fustat'] text-indigo-600 shrink-0 text-lg">₹{product.price}</span>
                                        </div>

                                        <div className="flex gap-2 text-[11px] font-[800] uppercase tracking-wider text-slate-500 mb-5">
                                            <span className="bg-indigo-50/50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100/50">{product.category}</span>
                                            <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50">{product.hostelBlock}</span>
                                        </div>

                                        <div className="mt-auto pt-4 flex gap-2">
                                            {!product.isSold ? (
                                                <button
                                                    onClick={(e) => onMarkAsSold(product._id, e)}
                                                    disabled={loadingProductId === product._id}
                                                    className="flex-1 bg-white text-green-600 hover:bg-green-50 font-bold py-2.5 rounded-xl transition-all text-sm border border-green-200 hover:border-green-300 shadow-sm disabled:opacity-50"
                                                >
                                                    {loadingProductId === product._id ? 'Updating...' : '✓ Mark Sold'}
                                                </button>
                                            ) : (
                                                <div className="flex-1 bg-slate-100/50 text-slate-400 font-bold py-2.5 rounded-xl text-center text-sm border border-slate-200/50">
                                                    Sold ✓
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/product/${product._id}`); }}
                                                className="px-4 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-sm border border-indigo-200 hover:border-indigo-300 shadow-sm transition-all"
                                                title="Edit listing"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={(e) => onDelete(product._id, e)}
                                                disabled={deletingProductId === product._id}
                                                className="px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm border border-red-200 hover:border-red-300 shadow-sm transition-all disabled:opacity-50"
                                                title="Delete listing"
                                            >
                                                {deletingProductId === product._id ? '...' : '🗑️'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl py-24 text-center px-6">
                        <div className="text-5xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-2">
                            {activeTab === 'sold' ? 'No sold items yet' : 'No listings yet'}
                        </h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            {activeTab === 'sold'
                                ? 'Items you mark as sold will appear here.'
                                : 'Turn your unused hostel items into cash by listing them here.'}
                        </p>
                        <button
                            onClick={() => navigate('/post-ad')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
                        >
                            List your first Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;