import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const CATEGORIES = [
    { id: 'coolers', name: 'Coolers', emoji: '❄️', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    { id: 'cycles', name: 'Cycles', emoji: '🚲', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    { id: 'books', name: 'Books', emoji: '📚', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    { id: 'electronics', name: 'Electronics', emoji: '💻', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { id: 'mattresses', name: 'Mattresses', emoji: '🛏️', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    { id: 'tables', name: 'Tables', emoji: '🪑', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    { id: 'chairs', name: 'Chairs', emoji: '🪑', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    { id: 'others', name: 'Others', emoji: '📦', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
];

const Home = () => {
    const products = useSelector(state => state.product.products);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Debounce the search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        handleGetAllProducts({ category: selectedCategory, search: searchQuery });
    }, [handleGetAllProducts, selectedCategory, searchQuery]);

    const handleCategoryToggle = (catId) => {
        setSelectedCategory(prev => prev === catId ? '' : catId);
        setSearchInput('');
        setSearchQuery('');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSelectedCategory('');
        setSearchQuery(searchInput);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchInput('');
        setSearchQuery('');
    };

    const isFiltered = selectedCategory || searchQuery;

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24">

            {/* ── Hero / Search Section ── */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 lg:px-12 py-14 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 tracking-tight mb-3">
                        Find what you need in your hostel.
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
                        The marketplace exclusively for students. Buy and sell essentials within your campus.
                    </p>

                    <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search coolers, books, cycles, Block A..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-12 mt-10">

                {/* ── Categories ── */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-4">Browse by Category</h2>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryToggle(cat.id)}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all text-center ${cat.bg} ${cat.border} ${cat.id === selectedCategory ? 'ring-2 ring-indigo-500 scale-[1.05] shadow-md' : 'hover:scale-[1.03]'}`}
                            >
                                <span className="text-xl">{cat.emoji}</span>
                                <span className={`text-xs font-bold leading-tight ${cat.text}`}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Feed Header ── */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                        {searchQuery ? `Results for "${searchQuery}"` : selectedCategory ? `Category: ${selectedCategory}` : 'Recently Added'}
                        {' '}
                        <span className="text-base font-medium text-slate-400">({products?.length || 0})</span>
                    </h2>
                    {isFiltered && (
                        <button onClick={clearFilters} className="text-sm font-semibold text-indigo-600 hover:underline">
                            Clear All
                        </button>
                    )}
                </div>

                {/* ── Product Grid ── */}
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map(product => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : 'https://via.placeholder.com/400x300?text=No+Image';

                            return (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col"
                                >
                                    <div className="h-44 overflow-hidden relative bg-slate-100">
                                        <img
                                            src={imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {product.isSold && (
                                            <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex items-center justify-center">
                                                <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full font-bold text-sm border border-red-200">SOLD</span>
                                            </div>
                                        )}
                                        {product.negotiable && !product.isSold && (
                                            <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">Negotiable</span>
                                        )}
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3 className="font-bold text-slate-900 line-clamp-1 flex-1 pr-2">{product.title}</h3>
                                            <span className="font-bold text-indigo-600 shrink-0">₹{product.price}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 text-xs font-medium text-slate-500 mb-3">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.hostelBlock}</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.sellerYear}</span>
                                            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">{product.category}</span>
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${product.isSold ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                                                disabled={product.isSold}
                                            >
                                                {product.isSold ? 'Unavailable' : 'View Details →'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center px-6">
                        <div className="text-4xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No items found.</h2>
                        <p className="text-slate-500">
                            {isFiltered ? 'Try a different search or clear the filter.' : 'Be the first to list a product!'}
                        </p>
                        {isFiltered && (
                            <button onClick={clearFilters} className="mt-4 text-indigo-600 font-bold hover:underline">Clear filters</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;