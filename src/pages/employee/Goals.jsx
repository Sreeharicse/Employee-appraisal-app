import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function EmployeeGoals() {
    const { currentUser, cycles, goals } = useApp();
    const [selectedCycleId, setSelectedCycleId] = useState('');
    const activeCycles = cycles.filter(c => c.status === 'active');

    useEffect(() => {
        if (!selectedCycleId && activeCycles.length > 0) {
            setSelectedCycleId(activeCycles[0].id);
        }
    }, [activeCycles, selectedCycleId]);

    const myGoals = goals.filter(g => g.employeeId === currentUser.id && g.cycleId === selectedCycleId);
    const cycle = cycles.find(c => c.id === selectedCycleId);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">My Goals & Objectives</h2>
                    <p className="section-subtitle">View and track your performance targets for the current cycle</p>
                </div>
                <select className="form-select" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} style={{ width: '220px' }}>
                    {activeCycles.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {!selectedCycleId && <div className="alert alert-warning">⚠️ No active appraisal project selected.</div>}

            {selectedCycleId && (
                <div style={{ display: 'grid', gap: '24px' }}>
                    {myGoals.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '60px', background: '#f8fafc' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>No goals assigned yet</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your manager hasn't assigned specific goals for this project yet. Please check back later or contact your supervisor.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' }}>
                            {myGoals.map(g => (
                                <div key={g.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{g.title}</h3>
                                            <span className="badge badge-purple">{g.weightage}% weight</span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>{g.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                            <span>📅 Target:</span>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.deadline || 'No deadline'}</span>
                                        </div>
                                        <span className={`badge ${g.status === 'active' ? 'badge-blue' : 'badge-green'}`}>
                                            {g.status === 'active' ? 'In Progress' : 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
