import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Goals() {
    const { currentUser, users, cycles, goals, addGoal, updateGoal, deleteGoal } = useApp();
    const team = users.filter(u => u.managerId === currentUser.id);
    const activeCycles = cycles.filter(c => c.status === 'active');

    const [selectedCycleId, setSelectedCycleId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [selectedEmp, setSelectedEmp] = useState(team[0]?.id || '');
    const [form, setForm] = useState({ title: '', description: '', weightage: 20, deadline: '' });

    useEffect(() => {
        if (!selectedCycleId && activeCycles.length > 0) {
            setSelectedCycleId(activeCycles[0].id);
        }
    }, [activeCycles, selectedCycleId]);

    const myGoals = goals.filter(g => g.employeeId === currentUser.id && g.cycleId === selectedCycleId);
    const teamGoals = goals.filter(g => g.managerId === currentUser.id && g.cycleId === selectedCycleId);

    const openAdd = () => {
        setEditing(null);
        setForm({ title: '', description: '', weightage: 20, deadline: '' });
        setShowModal(true);
    };
    const openEdit = (g) => {
        setEditing(g);
        setSelectedEmp(g.employeeId);
        setForm({ title: g.title, description: g.description, weightage: g.weightage, deadline: g.deadline });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.title || !selectedEmp || !selectedCycleId) return;
        const goalData = { ...form, employeeId: selectedEmp, cycleId: selectedCycleId };
        if (editing) await updateGoal(editing.id, goalData);
        else await addGoal(goalData);
        setShowModal(false);
    };

    const byEmp = {};
    team.forEach(emp => {
        byEmp[emp.id] = {
            emp,
            goals: teamGoals.filter(g => g.employeeId === emp.id)
        };
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Assign Team Goals</h2>
                    <p className="section-subtitle">Set and manage expectations for your reporting team</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select className="form-select" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} style={{ width: '220px' }}>
                        {activeCycles.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={openAdd} disabled={!selectedCycleId}>
                        + New Goal
                    </button>
                </div>
            </div>

            {!selectedCycleId && <div className="alert alert-warning">⚠️ Please select an active project/cycle to continue.</div>}

            {selectedCycleId && (
                <>
                    {/* Goals assigned to the manager by HR */}
                    <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--purple)', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--purple)', marginBottom: '4px' }}>
                            <span style={{ fontSize: '20px' }}>🎯</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Project Goals (from HR)</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>These high-level goals define your department's focus for this cycle.</p>

                        {myGoals.length === 0 && <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No goals assigned to you yet.</p>}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                            {myGoals.map(g => (
                                <div key={g.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>{g.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{g.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Team Goal Breakdown</h3>

                    {Object.values(byEmp).map(({ emp, goals: empGoals }) => {
                        const totalWeight = empGoals.reduce((s, g) => s + Number(g.weightage), 0);
                        return (
                            <div key={emp.id} className="card" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="avatar" style={{ width: '40px', height: '40px' }}>{emp.avatar}</div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '15px' }}>{emp.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.department}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Load</div>
                                            <div style={{ fontWeight: 700, color: totalWeight === 100 ? 'var(--green)' : totalWeight > 100 ? 'var(--red)' : 'var(--orange)' }}>
                                                {totalWeight}%
                                            </div>
                                        </div>
                                        {totalWeight > 100 && <span title="Total weightage exceeds 100%" style={{ fontSize: '18px' }}>⚠️</span>}
                                    </div>
                                </div>

                                {empGoals.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        No goals assigned to {emp.name} for this project.
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                                    {empGoals.map(g => (
                                        <div key={g.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{g.title}</div>
                                                    <span className="badge badge-purple" style={{ borderRadius: '6px' }}>{g.weightage}%</span>
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>{g.description}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                                <span className="badge badge-gray" style={{ background: 'transparent', padding: '0', color: 'var(--text-muted)' }}>
                                                    📅 {g.deadline}
                                                </span>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(g)}>✏️</button>
                                                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => { if (window.confirm('Delete goal?')) deleteGoal(g.id); }}>🗑️</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {team.length === 0 && (
                        <div className="alert alert-info" style={{ marginTop: '40px' }}>
                            <span style={{ fontSize: '18px' }}>ℹ️</span>
                            <span>No employees currently reporting to you. Contact HR for team assignments.</span>
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editing ? 'Modify Goal' : 'Assign Goal to Team member'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Team Member *</label>
                                <select className="form-select" value={selectedEmp || ''} onChange={e => setSelectedEmp(e.target.value)}>
                                    <option value="" disabled>-- Select a Team Member --</option>
                                    {team.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            {myGoals.length > 0 && (
                                <div className="form-group" style={{ background: '#f5f3ff', padding: '12px', borderRadius: '10px', border: '1px solid rgba(124,58,237,0.1)' }}>
                                    <label className="form-label" style={{ color: 'var(--purple)', fontSize: '11px' }}>Quick Link: Copy from your Project Goal</label>
                                    <select className="form-select"
                                        style={{ background: 'white' }}
                                        onChange={e => {
                                            const g = myGoals.find(mg => mg.id === e.target.value);
                                            if (g) setForm(p => ({ ...p, title: g.title, description: g.description }));
                                        }}>
                                        <option value="">-- Choose a goal to copy --</option>
                                        {myGoals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Goal Title *</label>
                                <input className="form-input" placeholder="e.g., Performance Optimization" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Describe the expected outcome..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Weightage (%)</label>
                                    <input className="form-input" type="number" min="1" max="100" value={form.weightage} onChange={e => setForm(p => ({ ...p, weightage: Number(e.target.value) }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Target Date</label>
                                    <input className="form-input" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>💾 {editing ? 'Update' : 'Save'} Goal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
