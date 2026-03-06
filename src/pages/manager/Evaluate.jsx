import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function Evaluate() {
    const { currentUser, users, cycles, getGoalsForEmployee, getEvaluation, selfReviews, submitEvaluation, calculateScore, getCategory } = useApp();
    const team = users.filter(u => u.managerId === currentUser.id);
    const activeCycles = cycles.filter(c => c.status === 'active');

    const [selectedCycleId, setSelectedCycleId] = useState('');
    const [selectedEmp, setSelectedEmp] = useState(team[0]?.id || '');
    const [saved, setSaved] = useState(false);

    const [goalRatings, setGoalRatings] = useState({});
    const [workRating, setWorkRating] = useState(0);
    const [behaviorRating, setBehaviorRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!selectedCycleId && activeCycles.length > 0) {
            setSelectedCycleId(activeCycles[0].id);
        }
    }, [activeCycles, selectedCycleId]);

    const cycle = cycles.find(c => c.id === selectedCycleId);
    const emp = users.find(u => u.id === selectedEmp);
    const empGoals = cycle ? getGoalsForEmployee(selectedEmp, cycle.id) : [];
    const existingEval = cycle ? getEvaluation(selectedEmp, cycle.id) : null;
    const selfReview = cycle ? selfReviews.find(r => r.employeeId === selectedEmp && r.cycleId === cycle.id) : null;

    useEffect(() => {
        if (!selectedCycleId || !selectedEmp) return;

        const ev = getEvaluation(selectedEmp, selectedCycleId);
        const r = {};
        empGoals.forEach(g => { r[g.id] = ev?.goalRatings?.[g.id] || 0; });

        setGoalRatings(r);
        setWorkRating(ev?.workPerformanceRating || 0);
        setBehaviorRating(ev?.behavioralRating || 0);
        setFeedback(ev?.feedback || '');
        setSaved(!!ev);
    }, [selectedEmp, selectedCycleId, existingEval, empGoals.length]);

    const handleEmpChange = (id) => {
        setSelectedEmp(id);
        setSaved(false);
    };

    const handleSubmit = async () => {
        if (!selectedCycleId || !selectedEmp) return;
        await submitEvaluation({
            cycleId: selectedCycleId,
            employeeId: selectedEmp,
            goalRatings,
            workPerformanceRating: workRating,
            behavioralRating: behaviorRating,
            feedback,
        });
        setSaved(true);
    };

    const previewScore = empGoals.length > 0 && workRating > 0 && behaviorRating > 0
        ? calculateScore(empGoals, goalRatings, workRating, behaviorRating)
        : null;

    const RatingButtons = ({ value, onChange }) => (
        <div className="rating-scale" style={{ gap: '10px' }}>
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    className={`rating-btn ${value === n ? 'selected' : ''}`}
                    onClick={() => onChange(n)}
                    style={{ width: '44px', height: '44px', fontSize: '15px' }}
                >
                    {n}
                </button>
            ))}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--purple)', marginLeft: '8px' }}>
                {['', 'Needs Improvement', 'Fair', 'Good', 'Very Good', 'Excellent'][value] || 'Not Rated'}
            </span>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Performance Evaluation</h2>
                    <p className="section-subtitle">Rate team members and provide constructive feedback</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select className="form-select" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} style={{ width: '220px' }}>
                        {activeCycles.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedCycleId && <div className="alert alert-warning">⚠️ No active appraisal project selected.</div>}
            {team.length === 0 && <div className="alert alert-info">ℹ️ No team members are currently reporting to you.</div>}

            {team.length > 0 && selectedCycleId && (
                <>
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-title" style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>1. Select a Team Member</div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {team.map(t => {
                                const hasEval = !!getEvaluation(t.id, selectedCycleId);
                                const isActive = selectedEmp === t.id;
                                return (
                                    <button key={t.id}
                                        type="button"
                                        onClick={() => handleEmpChange(t.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
                                            borderRadius: '12px', border: isActive ? '2px solid var(--purple)' : '1px solid var(--border)',
                                            background: isActive ? 'white' : '#f8fafc',
                                            boxShadow: isActive ? '0 4px 12px rgba(124,58,237,0.1)' : 'none',
                                            cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s', position: 'relative'
                                        }}>
                                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{t.avatar}</div>
                                        <span style={{ fontSize: '14px', fontWeight: isActive ? 700 : 500 }}>{t.name}</span>
                                        {hasEval && (
                                            <span style={{
                                                position: 'absolute', top: '-6px', right: '-6px',
                                                background: '#10b981', color: 'white',
                                                width: '18px', height: '18px', borderRadius: '50%',
                                                fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>✓</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selfReview && (
                        <div className="card" style={{ marginBottom: '24px', background: '#ecfeff', border: '1px solid #0891b233' }}>
                            <div className="card-title" style={{ color: 'var(--cyan)', marginBottom: '8px' }}>📝 Employee Self-Review Summary</div>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#164e63' }}>{selfReview.summary}</p>
                        </div>
                    )}

                    {saved && <div className="alert alert-success" style={{ marginBottom: '24px' }}>✨ Evaluation details synchronized with record.</div>}

                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-title" style={{ marginBottom: '20px', color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>2. Goal Performance</div>
                        {empGoals.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                No specific goals found for {emp?.name} in this cycle.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '24px' }}>
                                {empGoals.map(g => (
                                    <div key={g.id} style={{ padding: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{g.title}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{g.description}</div>
                                            </div>
                                            <span className="badge badge-purple" style={{ fontSize: '12px', padding: '4px 10px' }}>Weight: {g.weightage}%</span>
                                        </div>
                                        <RatingButtons value={goalRatings[g.id] || 0} onChange={v => setGoalRatings(p => ({ ...p, [g.id]: v }))} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid-2" style={{ marginBottom: '24px', gap: '24px' }}>
                        <div className="card">
                            <div className="card-title" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>3. Work Competency</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Quality, efficiency, and role-specific technical skills.</p>
                            <RatingButtons value={workRating} onChange={setWorkRating} />
                        </div>
                        <div className="card">
                            <div className="card-title" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>4. Professional Behavior</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Collaboration, communication, and core values.</p>
                            <RatingButtons value={behaviorRating} onChange={setBehaviorRating} />
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: '32px' }}>
                        <div className="card-title" style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>5. Overall Feedback</div>
                        <textarea className="form-textarea" rows={5}
                            style={{ fontSize: '14px', lineHeight: '1.6' }}
                            placeholder="Detail the employee's key achievements and specific areas for future growth..."
                            value={feedback} onChange={e => setFeedback(e.target.value)} />
                    </div>

                    <div style={{ position: 'sticky', bottom: '24px', zIndex: 10 }}>
                        <div className="card" style={{
                            background: 'white',
                            border: '2px solid var(--purple)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple)' }}>{previewScore || '--'}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CUMULATIVE SCORE</div>
                                </div>
                                {previewScore !== null && (
                                    <div>
                                        <span className={`badge ${getCategory(previewScore).badge}`} style={{ fontSize: '14px', padding: '6px 16px', borderRadius: '8px' }}>
                                            {getCategory(previewScore).label}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button type="button" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '15px' }}
                                onClick={handleSubmit} disabled={empGoals.length === 0}>
                                {existingEval ? 'Update Evaluation' : 'Complete Evaluation'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
