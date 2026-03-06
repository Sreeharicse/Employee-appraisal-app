import React from 'react';
import { useApp } from '../../context/AppContext';
import NextStepsCard from '../../components/NextStepsCard';

export default function HRDashboard() {
    const { users, cycles, goals, evaluations, selfReviews, getActiveCycle } = useApp();
    const activeCycle = getActiveCycle();
    const employees = users.filter(u => u.role === 'employee');
    const managers = users.filter(u => u.role === 'manager');
    const pendingApprovals = evaluations.filter(e => e.status === 'pending_approval');
    const approved = evaluations.filter(e => e.status === 'approved');
    const selfReviewsDone = selfReviews.length;
    const evalsDone = evaluations.length;

    const getNextStep = () => {
        if (!activeCycle) return { title: 'No Active Cycle', description: 'The appraisal season has not started. You should create or activate a cycle to begin.', actionPath: '/hr/cycles', actionLabel: 'Manage Cycles', statusType: 'pending' };

        const withoutManager = employees.filter(u => !u.managerId);
        if (withoutManager.length > 0) return { title: 'Assign Managers', description: `${withoutManager.length} employees have no reporting manager assigned. Managers cannot evaluate them until this is fixed.`, actionPath: '/hr/employees', actionLabel: 'Manage Employees', statusType: 'pending' };

        if (goals.length === 0) return { title: 'Assign Goals', description: 'No goals have been assigned for the current cycle. Employees need goals before they can be evaluated.', actionPath: '/hr/goals', actionLabel: 'Assign Goals', statusType: 'pending' };

        if (pendingApprovals.length > 0) return { title: 'Review Pending Evaluations', description: `Managers have submitted ${pendingApprovals.length} evaluations that require your final approval or rejection.`, actionPath: '/hr/approvals', actionLabel: 'Review Approvals', statusType: 'pending' };

        if (evalsDone < employees.length) return { title: 'Monitor Progress', description: `The active cycle "${activeCycle.name}" is in progress. ${evalsDone} of ${employees.length} evaluations are submitted.`, actionPath: '/hr/reports', actionLabel: 'View Reports', statusType: 'waiting' };

        return { title: 'Cycle Completed', description: 'All evaluations for the current cycle have been processed and approved. You can now close the cycle.', actionPath: '/hr/cycles', actionLabel: 'Manage Cycles', statusType: 'complete' };
    };

    const nextStep = getNextStep();

    const workflow = [
        { label: 'Cycle Created', done: !!activeCycle },
        { label: 'Goals Assigned', done: goals.length > 0 },
        { label: 'Self Reviews', done: selfReviewsDone > 0 },
        { label: 'Manager Eval', done: evalsDone > 0 },
        { label: 'HR Approval', done: approved.length > 0 },
    ];

    return (
        <div>
            <div className="section-header">
                <div>
                    <h2 className="section-title">HR Dashboard</h2>
                    <p className="section-subtitle">Overview of appraisal progress and key metrics</p>
                </div>
                {activeCycle && (
                    <span className="badge badge-green">🟢 {activeCycle.name} — Active</span>
                )}
            </div>

            <NextStepsCard {...nextStep} />

            {/* Workflow Steps */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title">Appraisal Workflow Progress</div>
                <div className="workflow-steps">
                    {workflow.map((step, i) => (
                        <React.Fragment key={i}>
                            <div className="workflow-step">
                                <div className={`step-dot ${step.done ? 'completed' : ''}`}>
                                    {step.done ? '✓' : i + 1}
                                </div>
                                <div className="step-label">{step.label}</div>
                            </div>
                            {i < workflow.length - 1 && (
                                <div className={`step-connector ${workflow[i + 1]?.done ? 'completed' : ''}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card" style={{ '--accent-color': '#7c3aed' }}>
                    <div className="kpi-icon">👥</div>
                    <div className="kpi-label">Total Employees</div>
                    <div className="kpi-value">{employees.length}</div>
                    <div className="kpi-change">+{managers.length} managers</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#06b6d4' }}>
                    <div className="kpi-icon">🔄</div>
                    <div className="kpi-label">Active Cycles</div>
                    <div className="kpi-value">{cycles.filter(c => c.status === 'active').length}</div>
                    <div className="kpi-change">{cycles.length} total cycles</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#f59e0b' }}>
                    <div className="kpi-icon">⏳</div>
                    <div className="kpi-label">Pending Approvals</div>
                    <div className="kpi-value">{pendingApprovals.length}</div>
                    <div className="kpi-change">{approved.length} approved</div>
                </div>
                <div className="kpi-card" style={{ '--accent-color': '#10b981' }}>
                    <div className="kpi-icon">🎯</div>
                    <div className="kpi-label">Goals Assigned</div>
                    <div className="kpi-value">{goals.length}</div>
                    <div className="kpi-change">{selfReviewsDone} self-reviews done</div>
                </div>
            </div>

            {/* Active cycle details */}
            {activeCycle && (
                <div className="grid-2">
                    <div className="card">
                        <div className="card-title">Active Cycle</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{activeCycle.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            📅 {activeCycle.startDate} → {activeCycle.endDate}
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                                <span>Evaluation Progress</span>
                                <span>{evalsDone} / {employees.length}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${employees.length ? (evalsDone / employees.length) * 100 : 0}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-title">Recent Activity</div>
                        {[...evaluations].reverse().slice(0, 3).map((ev, i) => {
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ fontSize: '20px' }}>⭐</div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600 }}>Evaluation submitted</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ev.submittedAt}</div>
                                    </div>
                                    <span className={`badge ${ev.status === 'approved' ? 'badge-green' : ev.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`} style={{ marginLeft: 'auto' }}>
                                        {ev.status.replace('_', ' ')}
                                    </span>
                                </div>
                            );
                        })}
                        {evaluations.length === 0 && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No evaluations yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
