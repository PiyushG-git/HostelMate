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
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-12">

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
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col"
                                >
                                    <div
                                        className="h-44 overflow-hidden relative bg-slate-100 cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                        {product.isSold && (
                                            <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex items-center justify-center">
                                                <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full font-bold text-sm border border-red-200">SOLD</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3
                                                className="font-bold text-slate-900 line-clamp-1 flex-1 pr-2 cursor-pointer hover:text-indigo-600"
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.title}
                                            </h3>
                                            <span className="font-bold text-indigo-600 shrink-0">₹{product.price}</span>
                                        </div>

                                        <div className="flex gap-1.5 text-xs font-medium text-slate-500 mb-4">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.category}</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.hostelBlock}</span>
                                        </div>

                                        <div className="mt-auto border-t border-slate-100 pt-3 flex gap-2">
                                            {!product.isSold ? (
                                                <button
                                                    onClick={(e) => onMarkAsSold(product._id, e)}
                                                    disabled={loadingProductId === product._id}
                                                    className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 font-bold py-2 rounded-lg transition-colors text-sm border border-green-200"
                                                >
                                                    {loadingProductId === product._id ? 'Updating...' : '✓ Mark Sold'}
                                                </button>
                                            ) : (
                                                <div className="flex-1 bg-slate-50 text-slate-400 font-bold py-2 rounded-lg text-center text-sm border border-slate-200">
                                                    Sold ✓
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/product/${product._id}`); }}
                                                className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-bold text-sm border border-indigo-200 transition-colors"
                                                title="Edit listing"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={(e) => onDelete(product._id, e)}
                                                disabled={deletingProductId === product._id}
                                                className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold text-sm border border-red-200 transition-colors"
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
                                : 'Turn your unused hostel items into cash by posting an ad.'}
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