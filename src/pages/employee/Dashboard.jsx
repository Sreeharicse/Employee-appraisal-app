import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import NextStepsCard from '../../components/NextStepsCard';
import Icons from '../../components/Icons';

export default function EmployeeDashboard() {
    const { currentUser, cycles, getGoalsForEmployee, getSelfReview, getEvaluation, getScore } = useApp();
    const activeCycles = cycles.filter(c => c.status === 'active');
    const [selectedCycleId, setSelectedCycleId] = useState('');

    useEffect(() => {
        if (!selectedCycleId && activeCycles.length > 0) {
            setSelectedCycleId(activeCycles[0].id);
        }
    }, [activeCycles, selectedCycleId]);

    const cycle = cycles.find(c => c.id === selectedCycleId);
    const goals = selectedCycleId ? getGoalsForEmployee(currentUser.id, selectedCycleId) : [];
    const selfReview = selectedCycleId ? getSelfReview(currentUser.id, selectedCycleId) : null;
    const evaluation = selectedCycleId ? getEvaluation(currentUser.id, selectedCycleId) : null;
    const scoreData = selectedCycleId ? getScore(currentUser.id, selectedCycleId) : null;

    const getNextStep = () => {
        if (!selectedCycleId) return { title: 'Select a Project', description: 'Please select an appraisal project/cycle to view your status.', actionPath: null, statusType: 'waiting' };
        if (goals.length === 0) return { title: 'Waiting for Goals', description: 'Your manager needs to assign goals for this cycle before you can proceed.', actionPath: null, statusType: 'waiting' };
        if (!selfReview) return { title: 'Complete Self-Review', description: 'Goals are assigned! It is time to reflect on your performance and submit your self-review.', actionPath: '/employee/self-review', actionLabel: 'Start Self-Review', statusType: 'pending' };
        if (!evaluation) return { title: 'Awaiting Manager Evaluation', description: 'Your self-review is submitted. Your manager will evaluate your performance soon.', actionPath: null, statusType: 'waiting' };
        if (evaluation.status === 'pending_approval') return { title: 'Awaiting HR Approval', description: 'Your manager has submitted the evaluation. It is now pending final approval from HR.', actionPath: null, statusType: 'waiting' };
        return { title: 'Check Your Results', description: 'Your appraisal is complete! You can now view your final score and feedback.', actionPath: '/employee/results', actionLabel: 'View Results', statusType: 'complete' };
    };

    const nextStep = getNextStep();

    const statusSteps = [
        { label: 'Goals Assigned', done: goals.length > 0 },
        { label: 'Self Review', done: !!selfReview },
        { label: 'Manager Eval', done: !!evaluation },
        { label: 'HR Approved', done: evaluation?.status === 'approved' },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">My Dashboard</h2>
                    <p className="section-subtitle">Your appraisal status and progress</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select className="form-select" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} style={{ width: '220px' }}>
                        {activeCycles.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <NextStepsCard {...nextStep} />

            {/* Progress */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title" style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Appraisal Journey</div>
                <div className="workflow-steps">
                    {statusSteps.map((step, i) => (
                        <React.Fragment key={i}>
                            <div className="workflow-step">
                                <div className={`step-dot ${step.done ? 'completed' : ''}`}>
                                    {step.done ? '✓' : i + 1}
                                </div>
                                <div className="step-label" style={{ fontWeight: step.done ? 600 : 400 }}>{step.label}</div>
                            </div>
                            {i < statusSteps.length - 1 && (
                                <div className={`step-connector ${statusSteps[i + 1]?.done ? 'completed' : ''}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="kpi-card" style={{ '--accent-color': '#7c3aed' }}>
                    <div className="kpi-icon"><Icons.Target /></div>
                    <div className="kpi-label">Goals Assigned</div>
                    <div className="kpi-value">{goals.length}</div>
                    <div className="kpi-change">for this cycle</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': selfReview ? '#10b981' : '#f59e0b' }}>
                    <div className="kpi-icon">{selfReview ? <Icons.Check /> : <Icons.FileText />}</div>
                    <div className="kpi-label">Self Review</div>
                    <div className="kpi-value" style={{ fontSize: '20px', marginTop: '4px' }}>{selfReview ? 'Submitted' : 'Pending'}</div>
                    <div className="kpi-change">{selfReview ? `on ${new Date(selfReview.submittedAt).toLocaleDateString()}` : 'action required'}</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': evaluation?.status === 'approved' ? '#10b981' : '#06b6d4' }}>
                    <div className="kpi-icon"><Icons.Star /></div>
                    <div className="kpi-label">Evaluation Status</div>
                    <div className="kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>
                        {evaluation ? evaluation.status.replace('_', ' ') : 'Awaiting'}
                    </div>
                    <div className="kpi-change">by your manager</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': scoreData ? '#f59e0b' : '#64748b' }}>
                    <div className="kpi-icon"><Icons.Trophy /></div>
                    <div className="kpi-label">My Score</div>
                    <div className="kpi-value">{scoreData ? scoreData.score : '—'}</div>
                    <div className="kpi-change">{scoreData ? scoreData.category.label : 'not yet available'}</div>
                </div>
            </div>

            {/* Action alerts */}
            {!selfReview && goals.length > 0 && (
                <div className="alert alert-warning" style={{ borderRadius: '12px' }}>
                    <Icons.FileText style={{ width: '20px', height: '20px' }} />
                    <span>Your self-review is pending! Please submit it from the <b>Self Review</b> page.</span>
                </div>
            )}
            {scoreData && (
                <div className="alert alert-success" style={{ borderRadius: '12px' }}>
                    <Icons.Trophy style={{ width: '20px', height: '20px' }} />
                    <span>Your evaluation is complete! Check your results on the <b>My Results</b> page.</span>
                </div>
            )}

            {/* Goals preview */}
            {goals.length > 0 && (
                <div className="card">
                    <div className="card-title" style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Target /> My Goals (Quick View)
                    </div>
                    <div style={{ display: 'grid', gap: '2px' }}>
                        {goals.map(g => (
                            <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{g.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{g.description.slice(0, 100)}{g.description.length > 100 ? '...' : ''}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '20px' }}>
                                    <span className="badge badge-purple" style={{ borderRadius: '6px' }}>{g.weightage}%</span>
                                    <span className="badge badge-gray" style={{ borderRadius: '6px' }}>{g.deadline}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
