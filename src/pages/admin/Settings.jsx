import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../../components/Icons';

export default function AdminSettings() {
    const { encryptionKey, setEncryptionKey } = useApp();
    const [keyInput, setKeyInput] = useState(encryptionKey);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setEncryptionKey(keyInput);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">System Settings</h2>
                    <p className="section-subtitle">Configure system-wide parameters and security keys</p>
                </div>
            </div>

            <div className="card">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Icons.Lock style={{ color: 'var(--blue-light)' }} /> Security Configuration
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Encryption Key
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Stored in local session</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="password"
                            className="form-input"
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="Enter system encryption key..."
                            style={{ paddingRight: '44px' }}
                        />
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                            <Icons.Shield style={{ width: '18px', height: '18px' }} />
                        </div>
                    </div>
                    <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        This key is used for salt generation and sensitive data masking in the frontend.
                        <b> Warning:</b> Changing this may affect existing encrypted local storage items.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card-hover)', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Enforce 2FA for all administrative accounts</div>
                    </div>
                    <div style={{ width: '40px', height: '20px', background: 'var(--border)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                    </div>
                </div>

                <button
                    className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
                    onClick={handleSave}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    {saved ? <Icons.Check /> : <Icons.Save />}
                    {saved ? 'Settings Saved Successfully' : 'Apply Security Changes'}
                </button>
            </div>

            <div className="card" style={{ marginTop: '24px', borderLeft: '4px solid var(--purple)' }}>
                <div className="card-title" style={{ fontSize: '14px', marginBottom: '12px' }}>Encryption Best Practices</div>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>Use a mix of uppercase, lowercase, numbers, and symbols.</li>
                    <li style={{ marginBottom: '8px' }}>Keys should ideally be at least 16 characters long.</li>
                    <li>Avoid using common phrases or system-default strings.</li>
                </ul>
            </div>
        </div>
    );
}
