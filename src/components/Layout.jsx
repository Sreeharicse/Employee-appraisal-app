import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo-techxl.png';
import Icons from './Icons';

// BASE LINKS - Available to ALL roles
const BASE_LINKS = [
    { to: '/dashboard', label: 'Dashboard', icon: <Icons.Home /> },
    { to: '/employee/self-review', label: 'Self Review', icon: <Icons.FileText /> },
    { to: '/employee/results', label: 'My Results', icon: <Icons.Trophy /> },
];

const EMPLOYEE_LINKS = [...BASE_LINKS];

// MANAGER LINKS - Base + Manager specific
const MANAGER_LINKS = [
    ...BASE_LINKS,
    { to: '/manager', label: 'Evaluate Team', icon: <Icons.Users /> },
    { to: '/manager/goals', label: 'Team Report', icon: <Icons.Chart /> },
    { to: '/hr/employees', label: 'Employees', icon: <Icons.Users /> },
];

// HR LINKS - Base + HR specific
const HR_LINKS = [
    ...BASE_LINKS,
    { to: '/hr/employees', label: 'Employees', icon: <Icons.Users /> },
    { to: '/hr/cycles', label: 'Appraisal Cycles', icon: <Icons.Cycles /> },
    { to: '/hr/approvals', label: 'Approvals', icon: <Icons.Check /> },
    { to: '/hr/reports', label: 'Reports', icon: <Icons.Chart /> },
];

// ADMIN LINKS - ALL links + Admin settings
const ADMIN_LINKS = [
    ...BASE_LINKS,
    { to: '/manager', label: 'Evaluate Team', icon: <Icons.Users /> },
    { to: '/manager/goals', label: 'Team Report', icon: <Icons.Chart /> },
    { to: '/hr/employees', label: 'Employees', icon: <Icons.Users /> },
    { to: '/hr/cycles', label: 'Appraisal Cycles', icon: <Icons.Cycles /> },
    { to: '/hr/approvals', label: 'Approvals', icon: <Icons.Check /> },
    { to: '/hr/reports', label: 'Reports', icon: <Icons.Chart /> },
    { to: '/admin/settings', label: 'Admin Settings', icon: <Icons.Edit /> },
];

const ROLE_LINKS = {
    employee: EMPLOYEE_LINKS,
    manager: MANAGER_LINKS,
    hr: HR_LINKS,
    admin: ADMIN_LINKS
};
const ROLE_LABELS = { hr: 'HR Administrator', manager: 'Team Manager', employee: 'Employee', admin: 'System Administrator' };

export default function Layout({ children }) {
    const { currentUser, logout, theme, toggleTheme } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const links = ROLE_LINKS[currentUser?.role] || [];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getPageTitle = () => {
        const all = [...HR_LINKS, ...MANAGER_LINKS, ...EMPLOYEE_LINKS, ...ADMIN_LINKS]; // duplicates are fine for find
        const match = all.slice().reverse().find(l =>
            location.pathname.startsWith(l.to) &&
            (l.to !== '/dashboard' || location.pathname === '/dashboard')
        );
        return match?.label || 'Techxl';
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <img src={logo} alt="Logo" style={{ height: '32px', width: 'auto' }} />
                    </div>
                    <span>{ROLE_LABELS[currentUser?.role]}</span>
                </div>
                <nav className="sidebar-nav">
                    {links.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            end={link.to === '/dashboard'}
                            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                        >
                            <span className="icon">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-badge">
                        <div className="avatar" style={{ background: 'var(--blue-gradient)' }}>{currentUser?.avatar || '?'}</div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="topbar-meta">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <button
                            className="theme-toggle-btn"
                            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                        >
                            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
                        </button>
                    </div>
                </div>
                <div className="page-body">{children}</div>
            </div>
        </div>
    );
}
