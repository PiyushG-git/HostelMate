import React, { useEffect, useState, useRef } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useParams, useNavigate } from 'react-router';

const CATEGORIES = ['coolers','tables','chairs','cycles','books','electronics','mattresses','buckets','study lamps','extension boards','others'];
const SELLER_YEARS = ['1st Year','2nd Year','3rd Year','4th Year','Alumni'];
const MAX_IMAGES = 4;

const SellerProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById, handleUpdateProduct, handleDeleteProduct, handleMarkAsSold } = useProduct();
    const fileInputRef = useRef(null);

    const [product, setProduct]       = useState(null);
    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [deleting, setDeleting]     = useState(false);
    const [markingSold, setMarkingSold] = useState(false);
    const [toast, setToast]           = useState(null); // { msg, type }
    const [newImages, setNewImages]   = useState([]);   // files to upload
    const [isDragging, setIsDragging] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', price: '', category: 'coolers',
        hostelBlock: '', sellerYear: '1st Year', contactNumber: '', negotiable: false,
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await handleGetProductById(productId);
                const p = data?.product || data;
                setProduct(p);
                if (p) {
                    setFormData({
                        title: p.title || '',
                        description: p.description || '',
                        price: p.price || '',
                        category: p.category || 'coolers',
                        hostelBlock: p.hostelBlock || '',
                        sellerYear: p.sellerYear || '1st Year',
                        contactNumber: p.contactNumber || '',
                        negotiable: p.negotiable || false,
                    });
                }
            } catch (err) {
                console.error(err);
                showToast('Failed to load listing.', 'error');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [productId, handleGetProductById]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const addFiles = (files) => {
        const existing = (product?.images?.length || 0) + newImages.length;
        const slots = MAX_IMAGES - existing;
        if (slots <= 0) return;
        const toAdd = Array.from(files).slice(0, slots).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
        setNewImages(prev => [...prev, ...toAdd]);
    };

    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };
    const removeNewImage = (i) => setNewImages(prev => { const u = [...prev]; URL.revokeObjectURL(u[i].preview); u.splice(i,1); return u; });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
            newImages.forEach(img => fd.append('images', img.file));
            await handleUpdateProduct(productId, fd);
            showToast('Listing updated successfully!', 'success');
            setNewImages([]);
        } catch (err) {
            showToast(err?.response?.data?.message || 'Update failed.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this listing permanently? This cannot be undone.')) return;
        setDeleting(true);
        try {
            await handleDeleteProduct(productId);
            navigate('/dashboard');
        } catch (err) {
            showToast('Failed to delete listing.', 'error');
            setDeleting(false);
        }
    };

    const handleMarkSold = async () => {
        if (!window.confirm('Mark this item as sold? This cannot be undone.')) return;
        setMarkingSold(true);
        try {
            await handleMarkAsSold(productId);
            showToast('Marked as sold!', 'success');
            setProduct(p => ({ ...p, isSold: true }));
        } catch (err) {
            showToast('Failed to mark as sold.', 'error');
        } finally {
            setMarkingSold(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 44, height: 44, border: '3px solid #E0E7FF', borderTopColor: '#4F46E5',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <p style={{ fontFamily: 'Inter', color: '#9CA3AF', fontWeight: 500 }}>Loading your listing…</p>
            </div>
        </div>
    );

    if (!product) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
                <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#111827' }}>Listing not found</p>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 16, color: '#4F46E5', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>← Back to Dashboard</button>
            </div>
        </div>
    );

    const totalImages = (product.images?.length || 0) + newImages.length;

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', background: '#FAFAFA', minHeight: '100vh', paddingBottom: 80, paddingTop: 100 }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                    zIndex: 9999, background: toast.type === 'error' ? '#FEF2F2' : '#F0FDF4',
                    border: `1px solid ${toast.type === 'error' ? '#FECACA' : '#BBF7D0'}`,
                    color: toast.type === 'error' ? '#B91C1C' : '#15803D',
                    padding: '12px 24px', borderRadius: 14, fontWeight: 700, fontSize: 14,
                    boxShadow: '0 8px 28px rgba(0,0,0,0.12)', whiteSpace: 'nowrap',
                    animation: 'slideUp 0.3s ease',
                }}>
                    <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
                    {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
                </div>
            )}

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 0' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <button onClick={() => navigate('/dashboard')} style={{
                            background: '#F1F5F9', border: 'none', borderRadius: 10, width: 38, height: 38,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: 18, color: '#374151',
                        }}>←</button>
                        <div>
                            <h1 style={{ fontFamily: '"Plus Jakarta Sans", Inter', fontWeight: 800, fontSize: 22, color: '#0D0F1A', margin: 0 }}>
                                Edit Listing
                            </h1>
                            <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500, margin: '2px 0 0' }}>
                                Changes will be live immediately
                            </p>
                        </div>
                    </div>
                    {product.isSold && (
                        <span style={{ background: '#FEE2E2', color: '#B91C1C', padding: '5px 14px', borderRadius: 999, fontWeight: 800, fontSize: 12, border: '1px solid #FECACA' }}>
                            SOLD
                        </span>
                    )}
                </div>

                <form onSubmit={handleSave}>
                    {/* Current Images */}
                    <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #E5E7EB', padding: '24px', marginBottom: 16 }}>
                        <h2 style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 16, marginTop: 0 }}>
                            Current Photos
                            <span style={{ fontWeight: 500, color: '#9CA3AF', fontSize: 13, marginLeft: 8 }}>({product.images?.length || 0} uploaded)</span>
                        </h2>
                        {product.images?.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                                {product.images.map((img, i) => (
                                    <div key={i} style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: '#F1F5F9' }}>
                                        <img src={img.url} alt={`Photo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#9CA3AF', fontSize: 13 }}>No photos uploaded yet.</p>
                        )}

                        {/* Add more photos */}
                        {totalImages < MAX_IMAGES && (
                            <div style={{ marginTop: 16 }}>
                                <p style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8 }}>
                                    Add more photos ({MAX_IMAGES - totalImages} slots left)
                                </p>
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${isDragging ? '#4F46E5' : '#D1D5DB'}`,
                                        borderRadius: 12, padding: '16px 12px',
                                        textAlign: 'center', cursor: 'pointer',
                                        background: isDragging ? '#EEF2FF' : '#F9FAFB',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <p style={{ color: '#6B7280', fontSize: 13, fontWeight: 500, margin: 0 }}>Click or drag to add photos</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => { addFiles(e.target.files); e.target.value=''; }} style={{ display: 'none' }} />
                                </div>
                                {newImages.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
                                        {newImages.map((img, i) => (
                                            <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: '#F1F5F9' }}>
                                                <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => removeNewImage(i)} style={{
                                                    position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.9)',
                                                    border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer',
                                                    color: '#EF4444', fontWeight: 700, fontSize: 14, lineHeight: 1,
                                                }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #E5E7EB', padding: '24px', marginBottom: 16 }}>
                        <h2 style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 20, marginTop: 0 }}>Listing Details</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
                            {/* Title */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>Ad Title *</label>
                                <input
                                    type="text" name="title" required value={formData.title} onChange={handleChange}
                                    placeholder="e.g. Symphony Jumbo Cooler 75L"
                                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                                    onFocus={e => e.target.style.borderColor = '#4F46E5'}
                                    onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                                />
                            </div>

                            {/* Price + Category */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>Price (₹) *</label>
                                    <input
                                        type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="0"
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                                        onFocus={e => e.target.style.borderColor = '#4F46E5'}
                                        onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>Category *</label>
                                    <select
                                        name="category" value={formData.category} onChange={handleChange}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', background: '#F9FAFB', boxSizing: 'border-box' }}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Hostel Block + Year */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>Hostel Block / Room *</label>
                                    <input
                                        type="text" name="hostelBlock" required value={formData.hostelBlock} onChange={handleChange} placeholder="Block C, 204"
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                                        onFocus={e => e.target.style.borderColor = '#4F46E5'}
                                        onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>Your Year *</label>
                                    <select
                                        name="sellerYear" value={formData.sellerYear} onChange={handleChange}
                                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', background: '#F9FAFB', boxSizing: 'border-box' }}
                                    >
                                        {SELLER_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>WhatsApp Number *</label>
                                <input
                                    type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} placeholder="10-digit mobile number"
                                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                                    onFocus={e => e.target.style.borderColor = '#4F46E5'}
                                    onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6 }}>Description *</label>
                                <textarea
                                    name="description" required rows={4} value={formData.description} onChange={handleChange}
                                    placeholder="Describe the condition, age, reason for selling…"
                                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #D1D5DB', fontFamily: 'Inter', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                                    onFocus={e => e.target.style.borderColor = '#4F46E5'}
                                    onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                                />
                            </div>

                            {/* Negotiable */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange}
                                    style={{ width: 18, height: 18, accentColor: '#4F46E5' }}
                                />
                                <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Price is Negotiable</span>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {/* Save */}
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                flex: 1, minWidth: 160, padding: '13px 24px',
                                background: saving ? '#9CA3AF' : '#4F46E5',
                                color: '#fff', border: 'none', borderRadius: 12,
                                fontFamily: 'Inter', fontWeight: 700, fontSize: 15,
                                cursor: saving ? 'not-allowed' : 'pointer',
                                boxShadow: saving ? 'none' : '0 4px 14px rgba(79,70,229,0.3)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {saving ? 'Saving…' : '💾 Save Changes'}
                        </button>

                        {/* Mark as Sold */}
                        {!product.isSold && (
                            <button
                                type="button"
                                onClick={handleMarkSold}
                                disabled={markingSold}
                                style={{
                                    padding: '13px 20px', background: '#F0FDF4',
                                    color: '#15803D', border: '1px solid #BBF7D0',
                                    borderRadius: 12, fontFamily: 'Inter', fontWeight: 700, fontSize: 14,
                                    cursor: markingSold ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                }}
                            >
                                {markingSold ? 'Updating…' : '✓ Mark as Sold'}
                            </button>
                        )}

                        {/* Delete */}
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                padding: '13px 20px', background: '#FEF2F2',
                                color: '#B91C1C', border: '1px solid #FECACA',
                                borderRadius: 12, fontFamily: 'Inter', fontWeight: 700, fontSize: 14,
                                cursor: deleting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            {deleting ? 'Deleting…' : '🗑️ Delete Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerProductDetails;