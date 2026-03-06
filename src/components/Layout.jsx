import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-techxl.png';

const HR_LINKS = [
    { to: '/hr', label: 'Dashboard', icon: '🏠' },
    { to: '/hr/employees', label: 'Employees', icon: '👥' },
    { to: '/hr/cycles', label: 'Appraisal Cycles', icon: '🔄' },
    { to: '/hr/goals', label: 'Assign Goals', icon: '🎯' },
    { to: '/hr/approvals', label: 'Approvals', icon: '✅' },
    { to: '/hr/reports', label: 'Reports', icon: '📈' },
];

const MANAGER_LINKS = [
    { to: '/manager', label: 'Dashboard', icon: '🏠' },
    { to: '/manager/goals', label: 'Assign Goals', icon: '🎯' },
    { to: '/manager/evaluate', label: 'Evaluate Team', icon: '⭐' },
    { to: '/manager/team-report', label: 'Team Report', icon: '📊' },
];

const EMPLOYEE_LINKS = [
    { to: '/employee', label: 'Dashboard', icon: '🏠' },
    { to: '/employee/goals', label: 'My Goals', icon: '🎯' },
    { to: '/employee/self-review', label: 'Self Review', icon: '📝' },
    { to: '/employee/results', label: 'My Results', icon: '🏆' },
];

const ROLE_LINKS = { hr: HR_LINKS, manager: MANAGER_LINKS, employee: EMPLOYEE_LINKS };
const ROLE_LABELS = { hr: 'HR Administrator', manager: 'Team Manager', employee: 'Employee' };

export default function Layout({ children }) {
    const { currentUser, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const links = ROLE_LINKS[currentUser?.role] || [];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getPageTitle = () => {
        const all = [...HR_LINKS, ...MANAGER_LINKS, ...EMPLOYEE_LINKS];
        const match = all.slice().reverse().find(l => location.pathname.startsWith(l.to) && (l.to !== '/hr' || location.pathname === '/hr') && (l.to !== '/manager' || location.pathname === '/manager') && (l.to !== '/employee' || location.pathname === '/employee'));
        return match?.label || 'Techxl';
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <img src={logo} alt="Techxl Logo" style={{ width: '32px', height: 'auto' }} />
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Techxl</h2>
                    </div>
                    <span>{ROLE_LABELS[currentUser?.role]}</span>
                </div>
                <nav className="sidebar-nav">
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/hr' || link.to === '/manager' || link.to === '/employee'}
                            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                        >
                            <span className="icon">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-badge">
                        <div className="avatar">{currentUser?.avatar || '?'}</div>
                        <div className="user-info">
                            <div className="user-name">{currentUser?.name}</div>
                            <div className="user-role">{currentUser?.department}</div>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
            </aside>

            <div className="main-content">
                <div className="topbar">
                    <h1>{getPageTitle()}</h1>
                    <span className="topbar-meta">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
                <div className="page-body">{children}</div>
            </div>
        </div>
    );
}
