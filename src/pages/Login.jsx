import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-techxl.png';

export default function Login() {
    const { loginWithMicrosoft, loginAsFake } = useApp();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Supabase sometimes returns errors in the hash (#error=...) and sometimes in the query string (?error=...)
        const hash = window.location.hash;
        const search = window.location.search;
        let params = null;

        if (hash && hash.includes('error=')) {
            params = new URLSearchParams(hash.substring(1));
            window.history.replaceState(null, '', window.location.pathname + search);
        } else if (search && search.includes('error=')) {
            params = new URLSearchParams(search);
            window.history.replaceState(null, '', window.location.pathname + hash);
        }

        if (params) {
            const errorDesc = params.get('error_description') || params.get('error');
            setError('Authentication Error: ' + decodeURIComponent(errorDesc).replace(/\+/g, ' '));
        }
    }, []);

    const handleMicrosoftLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await loginWithMicrosoft();
            if (!result.success) {
                setError(result.error || 'Login failed.');
                setLoading(false);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="ms-auth-container">
            <div className="ms-auth-card">
                <div style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '16px', display: 'flex', justifyContent: 'flex-start', marginBottom: '24px' }}>
                    <img src={logo} alt="Logo" style={{ height: '80px', width: 'auto', maxWidth: 'none' }} />
                </div>

                <h1 className="ms-auth-title" style={{ marginBottom: '32px' }}>Sign In</h1>
                
                {error && <div className="ms-auth-error">{error}</div>}

                <button
                    onClick={handleMicrosoftLogin}
                    disabled={loading}
                    className="ms-auth-microsoft-btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21">
                        <path fill="#fff" d="M1 1h9v9H1z" opacity="0.9" />
                        <path fill="#fff" d="M11 1h9v9h-9z" opacity="0.9" />
                        <path fill="#fff" d="M1 11h9v9H1z" opacity="0.9" />
                        <path fill="#fff" d="M11 11h9v9h-9z" opacity="0.9" />
                    </svg>
                    {loading ? 'Redirecting...' : 'Sign in with Microsoft'}
                </button>

                <div style={{ marginTop: '32px', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                    <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Developer Testing</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={() => loginAsFake('hr')} className="btn btn-secondary" style={{ flex: 1 }}>HR</button>
                        <button onClick={() => loginAsFake('manager')} className="btn btn-secondary" style={{ flex: 1 }}>Manager</button>
                        <button onClick={() => loginAsFake('employee')} className="btn btn-secondary" style={{ flex: 1 }}>Employee</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
