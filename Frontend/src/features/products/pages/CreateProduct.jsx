import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CATEGORIES = ['coolers', 'tables', 'chairs', 'cycles', 'books', 'electronics', 'mattresses', 'buckets', 'study lamps', 'extension boards', 'others'];
const SELLER_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];
const MAX_IMAGES = 4;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'coolers',
        hostelBlock: '',
        sellerYear: '1st Year',
        contactNumber: '',
        negotiable: false
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    };

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24">
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-indigo-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <h1 className="text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">List a Product</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    
                    {/* Images Section */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Photos (Up to {MAX_IMAGES})</label>
                        {images.length < MAX_IMAGES && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}`}
                            >
                                <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <p className="text-sm text-slate-600">Click or drag photos here</p>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                            </div>
                        )}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative rounded-xl overflow-hidden aspect-square border border-slate-200">
                                        <img src={img.preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full hover:bg-white shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Ad Title</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="e.g. Symphony Jumbo Cooler" />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="0" />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow bg-white">
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                            </select>
                        </div>

                        {/* Hostel Block */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hostel Block / Room</label>
                            <input type="text" name="hostelBlock" required value={formData.hostelBlock} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="e.g. Block C, 204" />
                        </div>

                        {/* Seller Year */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Year</label>
                            <select name="sellerYear" value={formData.sellerYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow bg-white">
                                {SELLER_YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>

                        {/* Contact Number */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Number</label>
                            <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="10 digit mobile number" />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow resize-none" placeholder="Describe the condition, age, reasons for selling..."></textarea>
                        </div>

                        {/* Negotiable Toggle */}
                        <div className="md:col-span-2 flex items-center">
                            <input type="checkbox" id="negotiable" name="negotiable" checked={formData.negotiable} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                            <label htmlFor="negotiable" className="ml-3 text-slate-700 font-medium">Price is Negotiable</label>
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting || images.length === 0} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:bg-slate-400 transition-colors shadow-sm mt-8">
                        {isSubmitting ? 'Listing Product...' : 'List Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;