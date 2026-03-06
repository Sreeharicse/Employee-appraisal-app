import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Cycles() {
    const { cycles, addCycle, updateCycle, deleteCycle } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', startDate: '', endDate: '', status: 'draft' });

    const openAdd = () => { setEditing(null); setForm({ name: '', startDate: '', endDate: '', status: 'draft' }); setShowModal(true); };
    const openEdit = (c) => { setEditing(c); setForm({ name: c.name, startDate: c.startDate, endDate: c.endDate, status: c.status }); setShowModal(true); };

    const handleSave = async () => {
        if (!form.name || !form.startDate || !form.endDate) return;
        if (editing) await updateCycle(editing.id, form);
        else await addCycle(form);
        setShowModal(false);
    };

    const statusBadge = { draft: 'badge-gray', active: 'badge-green', closed: 'badge-red' };

    const activate = async (c) => {
        // deactivate all others first
        for (const x of cycles) {
            if (x.status === 'active') await updateCycle(x.id, { status: 'closed' });
        }
        await updateCycle(c.id, { status: 'active' });
    };
    const close = (c) => updateCycle(c.id, { status: 'closed' });

    return (
        <div>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Appraisal Cycles</h2>
                    <p className="section-subtitle">Create and manage appraisal periods</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>+ New Cycle</button>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>All Cycles</h3>
                </div>
                <table>
                    <thead>
                        <tr><th>Cycle Name</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {cycles.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No cycles yet. Create your first one.</td></tr>}
                        {cycles.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                                <td>📅 {c.startDate}</td>
                                <td>📅 {c.endDate}</td>
                                <td><span className={`badge ${statusBadge[c.status] || 'badge-gray'}`}>{c.status}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {c.status !== 'active' && c.status !== 'closed' && (
                                            <button className="btn btn-success btn-sm" onClick={() => activate(c)}>▶ Activate</button>
                                        )}
                                        {c.status === 'active' && (
                                            <button className="btn btn-secondary btn-sm" onClick={() => close(c)}>⏹ Close</button>
                                        )}
                                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Delete cycle?')) deleteCycle(c.id); }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editing ? 'Edit Cycle' : 'New Appraisal Cycle'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Cycle Name *</label>
                                <input className="form-input" placeholder="Annual Review 2026" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Start Date *</label>
                                    <input className="form-input" type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date *</label>
                                    <input className="form-input" type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>💾 Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
