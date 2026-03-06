import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Results() {
    const { currentUser, cycles, getGoalsForEmployee, getEvaluation, getSelfReview, getScore, getUserById } = useApp();

    // Find all cycles that have evaluations
    const cyclesWithResults = cycles.filter(c => !!getEvaluation(currentUser.id, c.id))
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    const [selectedCycleId, setSelectedCycleId] = useState('');

    useEffect(() => {
        if (!selectedCycleId && cyclesWithResults.length > 0) {
            setSelectedCycleId(cyclesWithResults[0].id);
        }
    }, [cyclesWithResults, selectedCycleId]);

    if (cyclesWithResults.length === 0) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="section-header">
                    <div>
                        <h2 className="section-title">My Performance Results</h2>
                        <p className="section-subtitle">Your appraisal results and performance history</p>
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '60px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>No results available yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Once your manager completes your evaluation and it's approved, your results will appear here.</p>
                </div>
            </div>
        );
    }

    const cycle = cycles.find(c => c.id === selectedCycleId) || cyclesWithResults[0];
    const ev = getEvaluation(currentUser.id, cycle.id);
    const scoreData = ev ? getScore(currentUser.id, cycle.id) : null;
    const goals = getGoalsForEmployee(currentUser.id, cycle.id);
    const selfReview = getSelfReview(currentUser.id, cycle.id);
    const manager = ev ? getUserById(ev.managerId) : null;

    if (!ev || !scoreData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading result data...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">My Performance Results</h2>
                    <p className="section-subtitle">Final scores and feedback for the selected project</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select className="form-select" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} style={{ width: '220px' }}>
                        {cyclesWithResults.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <span className={`badge ${ev.status === 'approved' ? 'badge-green' : 'badge-yellow'}`} style={{ padding: '6px 14px' }}>
                        {ev.status === 'approved' ? 'Approved' : 'Pending Approval'}
                    </span>
                </div>
            </div>

            {/* Score Hero */}
            <div className="card" style={{ marginBottom: '32px', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            background: `conic-gradient(var(--purple) ${scoreData.score}%, #f1f5f9 0)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                        }}>
                            <div style={{
                                width: '92px', height: '92px', borderRadius: '50%',
                                background: 'white', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', position: 'absolute',
                                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{scoreData.score}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Performance Category</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span className={`badge ${scoreData.category.badge}`} style={{ fontSize: '18px', padding: '8px 20px', borderRadius: '12px' }}>
                                {scoreData.category.label}
                            </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '16px' }}>
                            Project: <b style={{ color: 'var(--text-primary)' }}>{cycle.name}</b> &nbsp;·&nbsp; Evaluated by <b style={{ color: 'var(--text-primary)' }}>{manager?.name}</b>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Official Submission Date: {new Date(ev.submittedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ marginBottom: '24px', gap: '24px' }}>
                {/* Score Breakdown */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>1. Component Breakdown</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Goal Achievement (60%)</span>
                                <span style={{ fontWeight: 700, color: 'var(--purple)' }}>{Math.round(scoreData.score * 0.6)} pts</span>
                            </div>
                            <div className="progress-bar" style={{ height: '8px' }}><div className="progress-fill" style={{ width: `${scoreData.score}%` }} /></div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Work Performance (20%)</span>
                                <span style={{ fontWeight: 700, color: 'var(--indigo)' }}>{ev.workPerformanceRating}/5</span>
                            </div>
                            <div className="progress-bar" style={{ height: '8px' }}><div className="progress-fill" style={{ width: `${(ev.workPerformanceRating / 5) * 100}%`, background: 'var(--indigo)' }} /></div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Professional Behavior (20%)</span>
                                <span style={{ fontWeight: 700, color: 'var(--cyan)' }}>{ev.behavioralRating}/5</span>
                            </div>
                            <div className="progress-bar" style={{ height: '8px' }}><div className="progress-fill" style={{ width: `${(ev.behavioralRating / 5) * 100}%`, background: 'var(--cyan)' }} /></div>
                        </div>
                    </div>
                </div>

                {/* Goal Detail */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>2. Individual Goal Ratings</div>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {goals.map(g => (
                            <div key={g.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{g.title}</span>
                                    <span style={{ fontWeight: 700, color: 'var(--purple-dark)' }}>{ev.goalRatings?.[g.id] || 0} / 5</span>
                                </div>
                                <div className="progress-bar" style={{ height: '4px' }}>
                                    <div className="progress-fill" style={{ width: `${((ev.goalRatings?.[g.id] || 0) / 5) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Manager Feedback */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title" style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>3. Evaluator's Constructive Feedback</div>
                <div style={{
                    padding: '20px', background: '#f8fafc', borderRadius: '12px',
                    fontSize: '14px', lineHeight: '1.7', color: '#334155', border: '1px solid #f1f5f9'
                }}>
                    {ev.feedback || 'Your manager has not provided detailed written feedback for this cycle.'}
                </div>
            </div>

            {/* Self review summary */}
            {selfReview && (
                <div className="card" style={{ background: '#ecfeff', border: '1px solid #0891b233' }}>
                    <div className="card-title" style={{ marginBottom: '10px', color: 'var(--cyan)' }}>📝 Your Self-Review Overview</div>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#164e63' }}>{selfReview.summary}</p>
                </div>
            )}
        </div>
    );
}
