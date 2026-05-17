import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#FAFAFA', flexDirection: 'column', gap: 16,
            }}>
                <div style={{
                    width: 40, height: 40, border: '3px solid #E0E7FF',
                    borderTopColor: '#4F46E5', borderRadius: '50%',
                    animation: 'spin 0.75s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#9CA3AF', margin: 0 }}>
                    Verifying session…
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children

}

export default Protected