import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Icons from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import NextStepsCard from '../components/NextStepsCard';

export default function Dashboard() {
    const { currentUser, getActiveCycle, goals, selfReviews, evaluations, users, approvals, resetAndSeedFakeData } = useApp();
    const navigate = useNavigate();
    const activeCycle = getActiveCycle();

    // -- Personal Stats (All Roles)
    const myGoals = goals.filter(g => g.employeeId === currentUser.id);
    const completedGoals = myGoals.filter(g => g.status === 'completed' || g.status === 'approved');
    const hasSelfReview = selfReviews.some(sr => sr.employeeId === currentUser.id && sr.cycleId === activeCycle?.id);

    // -- Manager Stats
    const teamMembers = useMemo(() => users.filter(u => u.managerId === currentUser.id), [users, currentUser]);
    const pendingEvaluations = useMemo(() => {
        if (!activeCycle) return [];
        return teamMembers.map(member => {
            const hasEval = evaluations.some(e => e.employeeId === member.id && e.cycleId === activeCycle.id);
            const hasSelf = selfReviews.some(sr => sr.employeeId === member.id && sr.cycleId === activeCycle.id);
            if (hasSelf && !hasEval) return member;
            return null;
        }).filter(Boolean);
    }, [teamMembers, evaluations, selfReviews, activeCycle]);

    // -- HR / Admin Stats
    const totalEmployees = users.filter(u => u.role !== 'admin' && u.role !== 'hr').length;
    const pendingHRApprovals = approvals.filter(a => a.status === 'pending');

    const handleResetData = () => {
        if (window.confirm('This will RESET all local mock data and seed fresh sample data. Continue?')) {
            resetAndSeedFakeData();
            alert('Fake testing data has been seeded successfully!');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-header">
                <div>
                    <h2 className="section-title">Welcome back, {currentUser.name.split(' ')[0]}</h2>
                    <p className="section-subtitle">Here's what is happening with your appraisals today.</p>
                </div>
                {(currentUser.role === 'hr' || currentUser.role === 'admin') && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/hr/cycles')}>
                            <Icons.Cycles style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                            Manage Cycles
                        </button>
                    </div>
                )}
            </div>

            {/* ----- ALL ROLES: Personal Dashboard ----- */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icons.Target style={{ color: 'var(--blue-light)' }} /> My Core Objectives
                </div>
                
                <div className="grid grid-3" style={{ marginTop: '20px' }}>
                    <div className="kpi-card" style={{ '--accent-color': 'var(--blue-light)' }}>
                        <div className="kpi-icon"><Icons.Target /></div>
                        <div className="kpi-label">Total Goals</div>
                        <div className="kpi-value">{myGoals.length}</div>
                        <div className="kpi-change">Active this cycle</div>
                    </div>
                    <div className="kpi-card" style={{ '--accent-color': 'var(--green)' }}>
                        <div className="kpi-icon"><Icons.Check /></div>
                        <div className="kpi-label">Completed</div>
                        <div className="kpi-value">{completedGoals.length}</div>
                        <div className="kpi-change">{myGoals.length > 0 ? Math.round((completedGoals.length / myGoals.length) * 100) : 0}% success rate</div>
                    </div>
                    <div className="kpi-card" style={{ '--accent-color': 'var(--purple)' }}>
                        <div className="kpi-icon"><Icons.FileText /></div>
                        <div className="kpi-label">Self Review</div>
                        <div className="kpi-value">{hasSelfReview ? 'Submitted' : 'Pending'}</div>
                        <div className="kpi-change">Current status</div>
                    </div>
                </div>
                
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/employee/goals')}>View My Goals</button>
                    {!hasSelfReview && <button className="btn btn-primary" onClick={() => navigate('/employee/self-review')}>Start Self Review</button>}
                </div>
            </div>

            <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
                <NextStepsCard />
                
                {activeCycle && (
                    <div className="card">
                        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Icons.Cycles style={{ color: 'var(--purple)' }} /> Active Cycle
                        </div>
                        <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-card-hover)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{activeCycle.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                                <Icons.Calendar style={{ width: '14px', height: '14px' }} />
                                {new Date(activeCycle.startDate).toLocaleDateString()} - {new Date(activeCycle.endDate).toLocaleDateString()}
                            </div>
                            <div className="badge badge-success">Active Phase</div>
                        </div>
                    </div>
                )}
            </div>

            {/* ----- MANAGER / ADMIN: Team Stats ----- */}
            {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
                <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--green)' }}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icons.Users style={{ color: 'var(--green)' }} /> My Team Overview
                    </div>
                    
                    <div className="grid grid-3" style={{ marginTop: '20px' }}>
                        <div className="kpi-card" style={{ '--accent-color': 'var(--text-primary)' }}>
                            <div className="kpi-icon"><Icons.Users /></div>
                            <div className="kpi-label">Direct Reports</div>
                            <div className="kpi-value">{teamMembers.length}</div>
                            <div className="kpi-change">Active employees</div>
                        </div>
                        <div className="kpi-card" style={{ '--accent-color': 'var(--yellow)' }}>
                            <div className="kpi-icon"><Icons.Clock /></div>
                            <div className="kpi-label">Pending Evals</div>
                            <div className="kpi-value">{pendingEvaluations.length}</div>
                            <div className="kpi-change">Requires action</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/manager')}>Evaluate Team</button>
                    </div>
                </div>
            )}

            {/* ----- HR / ADMIN: System Stats ----- */}
            {(currentUser.role === 'hr' || currentUser.role === 'admin') && (
                <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--purple)' }}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icons.PieChart style={{ color: 'var(--purple)' }} /> System Overview (HR)
                    </div>
                    
                    <div className="grid grid-3" style={{ marginTop: '20px' }}>
                        <div className="kpi-card" style={{ '--accent-color': 'var(--text-primary)' }}>
                            <div className="kpi-icon"><Icons.Users /></div>
                            <div className="kpi-label">Total Headcount</div>
                            <div className="kpi-value">{totalEmployees}</div>
                            <div className="kpi-change">Active in platform</div>
                        </div>
                        <div className="kpi-card" style={{ '--accent-color': 'var(--yellow)' }}>
                            <div className="kpi-icon"><Icons.Check /></div>
                            <div className="kpi-label">Pending Approvals</div>
                            <div className="kpi-value">{pendingHRApprovals.length}</div>
                            <div className="kpi-change">Awaiting HR review</div>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/hr/approvals')}>Review Approvals</button>
                    </div>
                </div>
            )}

            {/* ----- ADMIN: Fake Testing Tools ----- */}
            {currentUser.role === 'admin' && (
                <div className="card" style={{ background: 'var(--bg-card-hover)', border: '1px dashed var(--border)' }}>
                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <Icons.Target style={{ color: 'var(--red)' }} /> Admin: Testing Tools
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-danger btn-sm" onClick={handleResetData}>
                            <Icons.Refresh style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                            Seed Local Fake Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
