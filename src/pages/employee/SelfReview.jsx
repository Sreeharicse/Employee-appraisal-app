import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function SelfReview() {
    const { currentUser, cycles, getGoalsForEmployee, getSelfReview, submitSelfReview } = useApp();
    const activeCycles = cycles.filter(c => c.status === 'active');
    const [selectedCycleId, setSelectedCycleId] = useState('');

    const [summary, setSummary] = useState('');
    const [goalRatings, setGoalRatings] = useState({});
    const [comments, setComments] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize cycle
    useEffect(() => {
        if (!selectedCycleId && activeCycles.length > 0) {
            setSelectedCycleId(activeCycles[0].id);
        }
    }, [activeCycles, selectedCycleId]);

    const cycle = cycles.find(c => c.id === selectedCycleId);
    const goals = selectedCycleId ? getGoalsForEmployee(currentUser.id, selectedCycleId) : [];

    // Load existing data when cycle or employee changes
    useEffect(() => {
        if (!selectedCycleId) return;

        setLoading(true);
        const existing = getSelfReview(currentUser.id, selectedCycleId);

        if (existing) {
            setSummary(existing.summary || '');
            setComments(existing.comments || '');
            const r = {};
            goals.forEach(g => { r[g.id] = existing.goalRatings?.[g.id] || 0; });
            setGoalRatings(r);
            setSubmitted(true);
        } else {
            setSummary('');
            setComments('');
            setGoalRatings({});
            setSubmitted(false);
        }
        setLoading(false);
    }, [selectedCycleId, goals.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCycleId) return;
        await submitSelfReview({
            cycleId: selectedCycleId,
            employeeId: currentUser.id,
            summary,
            goalRatings,
            comments,
        });
        setSubmitted(true);
    };

    const RatingButtons = ({ goalId }) => (
        <div className="rating-scale">
            {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button"
                    className={`rating-btn ${goalRatings[goalId] === n ? 'selected' : ''}`}
                    onClick={() => setGoalRatings(p => ({ ...p, [goalId]: n }))}>
                    {n}
                </button>
            ))}
            <span style={{ fontSize: '13px', color: 'var(--purple)', alignSelf: 'center', marginLeft: '10px', fontWeight: 600 }}>
                {['', 'Needs Improvement', 'Fair', 'Good', 'Very Good', 'Excellent'][goalRatings[goalId]] || ''}
            </span>
        </div>
    );

    if (loading && selectedCycleId) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading review data...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Self Review</h2>
                    <p className="section-subtitle">Reflect on your performance and rate yourself for the selected project</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select className="form-select" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} style={{ width: '220px' }}>
                        {activeCycles.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {submitted && <span className="badge badge-green">✓ Submitted</span>}
                </div>
            </div>

            {!selectedCycleId && <div className="alert alert-warning">⚠️ No active appraisal project selected.</div>}

            {selectedCycleId && goals.length === 0 && (
                <div className="alert alert-info" style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '18px' }}>ℹ️</span>
                    <span>No goals assigned for this project yet. Please wait for your manager to set your objectives.</span>
                </div>
            )}

            {submitted && (
                <div className="alert alert-success" style={{ marginBottom: '24px' }}>
                    ✨ Your self-review for <b>{cycle?.name}</b> is complete. You can update it if needed.
                </div>
            )}

            {selectedCycleId && goals.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-title" style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>1. Performance Summary</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>A high-level overview of your achievements and challenges during this period.</p>
                        <textarea className="form-textarea" rows={6}
                            style={{ fontSize: '14px', lineHeight: '1.6' }}
                            placeholder="Describe your key achievements, contributions, and highlights from this appraisal period..."
                            value={summary} onChange={e => setSummary(e.target.value)} required />
                    </div>

                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-title" style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>2. Goal Self-Assessment</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Evaluate your personal performance against each assigned objective.</p>
                        {goals.map(g => (
                            <div key={g.id} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{g.title}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{g.description}</div>
                                    </div>
                                    <span className="badge badge-purple">Weight: {g.weightage}%</span>
                                </div>
                                <RatingButtons goalId={g.id} />
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ marginBottom: '32px' }}>
                        <div className="card-title" style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>3. Final Thoughts</div>
                        <textarea className="form-textarea" rows={3}
                            style={{ fontSize: '14px' }}
                            placeholder="Any additional feedback, development aspirations, or learning goals for the next cycle..."
                            value={comments} onChange={e => setComments(e.target.value)} />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '15px' }}>
                            {submitted ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
