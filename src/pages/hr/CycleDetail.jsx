import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import NextStepsCard from '../../components/NextStepsCard';
import Icons from '../../components/Icons';

export default function HRCycleDetail() {
    const { cycleId } = useParams();
    const navigate = useNavigate();
    const { users, cycles, evaluations } = useApp();

    const cycle = useMemo(() => cycles.find(c => c.id === cycleId), [cycles, cycleId]);

    if (!cycle) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-primary)' }}>Cycle not found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>The appraisal cycle you are looking for does not exist.</p>
                <button className="btn btn-primary" onClick={() => navigate('/hr')}>Back to Dashboard</button>
            </div>
        );
    }

    // Template data based on image
    const nextStep = {
        title: 'Awaiting HR Approval',
        description: 'Your manager has submitted the evaluation. It is now pending final approval from HR.',
        statusType: 'waiting'
    };

    const statusSteps = [
        { label: 'Goals Assigned', done: true },
        { label: 'Self Review', done: true },
        { label: 'Manager Eval', done: true },
        { label: 'HR Approved', done: false },
    ];

    const employees = users.filter(u => u.role === 'employee');
    const cycleEvaluations = evaluations.filter(e => e.cycleId === cycleId);

    // Summary metrics for HR view
    const goalsCount = 1; // Template value
    const selfReviewStatus = 'Submitted';
    const evaluationStatus = 'pending approval';
    const score = 52;
    const scoreLabel = 'Needs Improvement';

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Link to="/hr" className="btn-icon" style={{ padding: '4px', display: 'flex' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </Link>
                        <h2 className="section-title" style={{ margin: 0 }}>{cycle.name}</h2>
                    </div>
                    <p className="section-subtitle">Appraisal details and progress for this cycle</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span className="badge badge-blue">
                        Active
                    </span>
                </div>
            </div>

            <NextStepsCard {...nextStep} />

            {/* Appraisal Journey */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title" style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>APPRAISAL JOURNEY</div>
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
                    <div className="kpi-value">{goalsCount}</div>
                    <div className="kpi-change" style={{ color: '#10b981' }}>for this cycle</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#10b981' }}>
                    <div className="kpi-icon"><Icons.Check /></div>
                    <div className="kpi-label">Self Review</div>
                    <div className="kpi-value" style={{ fontSize: '20px', marginTop: '4px' }}>{selfReviewStatus}</div>
                    <div className="kpi-change" style={{ color: '#10b981' }}>on 3/10/2026</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#06b6d4' }}>
                    <div className="kpi-icon"><Icons.Star /></div>
                    <div className="kpi-label">Evaluation Status</div>
                    <div className="kpi-value" style={{ fontSize: '18px', marginTop: '4px' }}>{evaluationStatus}</div>
                    <div className="kpi-change" style={{ color: '#06b6d4' }}>by your manager</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#f59e0b' }}>
                    <div className="kpi-icon"><Icons.Trophy /></div>
                    <div className="kpi-label">My Score</div>
                    <div className="kpi-value">{score}</div>
                    <div className="kpi-change" style={{ color: '#10b981' }}>{scoreLabel}</div>
                </div>
            </div>
        </div>
    );
}
