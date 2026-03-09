import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../../components/Icons';

export default function Approvals() {
    const { evaluations, users, cycles, goals, approveEvaluation, rejectEvaluation, getScore } = useApp();
    const [comment, setComment] = useState({});
    const [selected, setSelected] = useState(null);

    const pending = evaluations.filter(e => e.status === 'pending_approval');
    const historical = evaluations.filter(e => e.status !== 'pending_approval');

    const getUserById = (id) => users.find(u => u.id === id);
    const getCycleById = (id) => cycles.find(c => c.id === id);

    return (
        <div>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Approval Queue</h2>
                    <p className="section-subtitle">Review and approve manager evaluations</p>
                </div>
                <span className="badge badge-yellow">
                    <Icons.Clock style={{ width: '14px', height: '14px', marginRight: '4px' }} /> {pending.length} Pending
                </span>
            </div>

            {pending.length === 0 && (
                <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--blue-light)' }}><Icons.Check style={{ width: '60px', height: '60px' }} /></div>
                    <h3 style={{ marginBottom: '8px' }}>No Pending Approvals</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                        Evaluations appear here once managers complete reviews for their team members.
                    </p>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', textAlign: 'left', gap: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Check style={{ color: 'var(--green-light)', width: '14px' }} /> <b>Cycle Active?</b> Ensure a cycle is active in <a href="/hr/cycles" style={{ color: 'var(--primary)' }}>Cycles</a></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Check style={{ color: 'var(--green-light)', width: '14px' }} /> <b>Managers Assigned?</b> Employees must have reporting managers in <a href="/hr/employees" style={{ color: 'var(--primary)' }}>Employees</a></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Check style={{ color: 'var(--green-light)', width: '14px' }} /> <b>Goals Set?</b> Assign goals to employees in <a href="/hr/goals" style={{ color: 'var(--primary)' }}>Goals</a></div>
                    </div>
                </div>
            )}

            {pending.map(ev => {
                const emp = getUserById(ev.employeeId);
                const mgr = getUserById(ev.managerId);
                const cycle = getCycleById(ev.cycleId);
                const scoreData = getScore(ev.employeeId, ev.cycleId);
                const empGoals = goals.filter(g => g.employeeId === ev.employeeId && g.cycleId === ev.cycleId);

                return (
                    <div key={ev.id} className="card" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="avatar">{emp?.avatar}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{emp?.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Evaluated by {mgr?.name} · {ev.submittedAt}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cycle?.name}</div>
                                </div>
                            </div>
                            {scoreData && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple-light)' }}>{scoreData.score}</div>
                                    <span className={`badge ${scoreData.category.badge}`}>{scoreData.category.label}</span>
                                </div>
                            )}
                        </div>

                        {/* Goal Ratings */}
                        <div style={{ marginBottom: '12px' }}>
                            <div className="card-title" style={{ marginBottom: '8px' }}>Goal Ratings</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {empGoals.map(g => (
                                    <div key={g.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', minWidth: '160px' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{g.title}</div>
                                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Icons.Star key={i} style={{ width: '12px', height: '12px', color: i < (ev.goalRatings?.[g.id] || 0) ? 'var(--blue-light)' : 'var(--text-muted)', fill: i < (ev.goalRatings?.[g.id] || 0) ? 'currentColor' : 'none' }} />
                                            ))}
                                            <span style={{ marginLeft: '4px' }}>{ev.goalRatings?.[g.id] || 0}/5</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Weight: {g.weightage}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 14px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Work Performance</div>
                                <div style={{ fontWeight: 700 }}>{'⭐'.repeat(ev.workPerformanceRating || 0)} {ev.workPerformanceRating || 0}/5</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 14px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Behavioral Competency</div>
                                <div style={{ fontWeight: 700 }}>{'⭐'.repeat(ev.behavioralRating || 0)} {ev.behavioralRating || 0}/5</div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Manager Feedback</div>
                            <p style={{ fontSize: '13px', lineHeight: '1.6' }}>{ev.feedback || 'No feedback provided.'}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">HR Comments (optional)</label>
                            <input className="form-input" placeholder="Add your remarks..."
                                value={comment[ev.id] || ''} onChange={e => setComment(p => ({ ...p, [ev.id]: e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn btn-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { approveEvaluation(ev.id, comment[ev.id]); }}>
                                <Icons.Check /> Approve Evaluation
                            </button>
                            <button className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { if (window.confirm('Reject this evaluation?')) rejectEvaluation(ev.id, comment[ev.id]); }}>
                                <Icons.X /> Reject
                            </button>
                        </div>
                    </div>
                );
            })}

            {historical.length > 0 && (
                <div className="table-container" style={{ marginTop: '24px' }}>
                    <div className="table-header"><h3>History ({historical.length})</h3></div>
                    <table>
                        <thead><tr><th>Employee</th><th>Cycle</th><th>Score</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                            {historical.map(ev => {
                                const emp = getUserById(ev.employeeId);
                                const cycle = getCycleById(ev.cycleId);
                                const scoreData = getScore(ev.employeeId, ev.cycleId);
                                return (
                                    <tr key={ev.id}>
                                        <td style={{ fontWeight: 600 }}>{emp?.name}</td>
                                        <td>{cycle?.name}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--purple-light)' }}>{scoreData?.score ?? '—'}</td>
                                        <td>{scoreData ? <span className={`badge ${scoreData.category.badge}`}>{scoreData.category.label}</span> : '—'}</td>
                                        <td><span className={`badge ${ev.status === 'approved' ? 'badge-green' : 'badge-red'}`}>{ev.status}</span></td>
                                        <td>{ev.submittedAt}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
