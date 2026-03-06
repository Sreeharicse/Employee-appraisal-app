import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TeamReport() {
    const { currentUser, users, getActiveCycle, cycles, goals, evaluations, getScore } = useApp();
    const team = users.filter(u => u.managerId === currentUser.id);
    const cycle = getActiveCycle();

    return (
        <div>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Team Report</h2>
                    <p className="section-subtitle">Performance summary for your team</p>
                </div>
                {cycle && <span className="badge badge-green">{cycle.name}</span>}
            </div>

            {!cycle && <div className="alert alert-warning">⚠️ No active cycle found.</div>}

            {cycle && (
                <div className="table-container">
                    <div className="table-header"><h3>Performance Summary</h3></div>
                    <table>
                        <thead>
                            <tr><th>Employee</th><th>Goals</th><th>Self Review</th><th>Evaluation</th><th>Score</th><th>Category</th></tr>
                        </thead>
                        <tbody>
                            {team.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No team members assigned.</td></tr>
                            )}
                            {team.map(emp => {
                                const empGoals = goals.filter(g => g.employeeId === emp.id && g.cycleId === cycle.id);
                                const ev = evaluations.find(e => e.employeeId === emp.id && e.cycleId === cycle.id);
                                const scoreData = getScore(emp.id, cycle.id);
                                return (
                                    <tr key={emp.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '11px' }}>{emp.avatar}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{emp.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-blue">{empGoals.length}</span></td>
                                        <td>
                                            <span className={`badge ${ev ? 'badge-green' : 'badge-gray'}`}>
                                                {ev ? '✓ Reviewed' : '⏳ Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${ev ? 'badge-green' : 'badge-gray'}`}>
                                                {ev ? `✓ ${ev.status.replace('_', ' ')}` : '⏳ Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            {scoreData ? (
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--purple-light)' }}>{scoreData.score}</div>
                                                    <div className="progress-bar" style={{ width: '70px' }}>
                                                        <div className="progress-fill" style={{ width: `${scoreData.score}%` }} />
                                                    </div>
                                                </div>
                                            ) : '—'}
                                        </td>
                                        <td>
                                            {scoreData
                                                ? <span className={`badge ${scoreData.category.badge}`}>{scoreData.category.label}</span>
                                                : <span className="badge badge-gray">Not Evaluated</span>}
                                        </td>
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
