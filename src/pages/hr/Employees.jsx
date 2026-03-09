import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../../components/Icons';

export default function Employees() {
    const { users, addUser, updateUser, deleteUser } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', role: 'employee', department: '', managerId: '' });
    const [search, setSearch] = useState('');

    const managers = users.filter(u => u.role === 'manager');
    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.department?.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setEditing(null); setForm({ name: '', email: '', role: 'employee', department: '', managerId: '' }); setShowModal(true); };
    const openEdit = (u) => { setEditing(u); setForm({ name: u.name, email: u.email, role: u.role, department: u.department || '', managerId: u.managerId || '' }); setShowModal(true); };

    const handleSave = async () => {
        if (!form.name || !form.email) return;
        const avatar = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        if (editing) await updateUser(editing.id, { ...form, avatar });
        else await addUser({ ...form, avatar });
        setShowModal(false);
    };

    const ROLE_BADGE = { hr: 'badge-purple', manager: 'badge-blue', employee: 'badge-gray' };

    return (
        <div>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Employee Management</h2>
                    <p className="section-subtitle">Manage all employees, departments, and reporting relationships</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>All Users ({filtered.length})</h3>
                    <input className="form-input" style={{ width: '220px' }} placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <table>
                    <thead>
                        <tr><th>Employee</th><th>Email</th><th>Role</th><th>Department</th><th>Manager</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(u => {
                            const mgr = managers.find(m => m.id === u.managerId);
                            return (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{u.avatar}</div>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span></td>
                                    <td>{u.department || '—'}</td>
                                    <td>{mgr ? mgr.name : '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>
                                                <Icons.Edit style={{ marginRight: '4px' }} /> Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { if (window.confirm('Delete this user?')) deleteUser(u.id); }}>
                                                <Icons.Trash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editing ? 'Edit Employee' : 'Add New Employee'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input className="form-input" type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select className="form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        <option value="hr">HR Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Auth Method</label>
                                    <input className="form-input" value="Microsoft SSO" disabled />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <input className="form-input" placeholder="Engineering" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reporting Manager</label>
                                    <select className="form-select" value={form.managerId} onChange={e => setForm(p => ({ ...p, managerId: e.target.value }))}>
                                        <option value="">None</option>
                                        {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave}>
                                <Icons.Save /> Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
