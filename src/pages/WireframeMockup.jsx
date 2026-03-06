import React, { useState } from 'react';

const WireframeBox = ({ title, children, style }) => (
    <div style={{ border: '2px dashed var(--text-muted)', borderRadius: '12px', padding: '20px', background: '#f8fafc', position: 'relative', minHeight: '100px', ...style }}>
        <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'white', padding: '0 8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            {title}
        </div>
        {children}
    </div>
);

const HRWireframe = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
        <WireframeBox title="PROGRESS TRACKER">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <React.Fragment key={i}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i < 3 ? 'var(--purple)' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i < 3 ? '✓' : i}</div>
                        {i < 5 && <div style={{ flex: 1, height: '2px', background: i < 2 ? 'var(--purple)' : '#e2e8f0' }} />}
                    </React.Fragment>
                ))}
            </div>
        </WireframeBox>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {['TOTAL USERS', 'CYCLES', 'PENDING', 'GOALS'].map(label => (
                <WireframeBox key={label} title={label}>
                    <div style={{ height: '32px', width: '60%', background: '#e2e8f0', borderRadius: '4px', marginTop: '8px' }} />
                </WireframeBox>
            ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <WireframeBox title="CYCLE PROGRESS" style={{ minHeight: '300px' }}>
                <div style={{ height: '20px', width: '100%', background: '#e2e8f0', borderRadius: '10px', margin: '20px 0' }} />
                <div style={{ height: '200px', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>[DATA TABLE PLACEHOLDER]</div>
            </WireframeBox>
            <WireframeBox title="RECENT ACTIVITY" style={{ minHeight: '300px' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ height: '12px', width: '80%', background: '#f1f5f9', borderRadius: '4px', marginBottom: '4px' }} />
                            <div style={{ height: '8px', width: '40%', background: '#f8fafc', borderRadius: '4px' }} />
                        </div>
                    </div>
                ))}
            </WireframeBox>
        </div>
    </div>
);

const ManagerWireframe = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
        <WireframeBox title="TEAM MEMBER SELECTION">
            <div style={{ display: 'flex', gap: '12px' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ width: '120px', height: '48px', border: '1px solid var(--border)', borderRadius: '8px', background: i === 1 ? 'white' : '#f1f5f9', borderColor: i === 1 ? 'var(--purple)' : 'var(--border)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} />
                        <div style={{ height: '10px', width: '40px', background: '#e2e8f0' }} />
                    </div>
                ))}
            </div>
        </WireframeBox>
        <WireframeBox title="PERFORMANCE RATING (GOALS)" style={{ minHeight: '400px' }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{ marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                    <div style={{ height: '16px', width: '200px', background: '#e2e8f0', marginBottom: '8px' }} />
                    <div style={{ height: '12px', width: '400px', background: '#f1f5f9', marginBottom: '16px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} style={{ width: '36px', height: '36px', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>{n}</div>
                        ))}
                    </div>
                </div>
            ))}
        </WireframeBox>
        <div style={{ position: 'sticky', bottom: '0', background: 'white', padding: '20px', border: '2px solid var(--purple)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '40px', background: 'var(--purple)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>85</div>
                <div style={{ height: '12px', width: '120px', background: '#e2e8f0' }} />
            </div>
            <div style={{ width: '150px', height: '44px', background: 'var(--purple)', borderRadius: '8px' }} />
        </div>
    </div>
);

const EmployeeWireframe = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
        <WireframeBox title="OVERALL RESULT" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '10px solid var(--purple)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>85</div>
            <div style={{ width: '200px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--green)', color: 'var(--green)', borderRadius: '20px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>EXCELLENT</div>
        </WireframeBox>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <WireframeBox title="COMPONENT BREAKDOWN" style={{ minHeight: '200px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <div style={{ height: '10px', width: '100px', background: '#e2e8f0' }} />
                            <div style={{ height: '10px', width: '30px', background: '#e2e8f0' }} />
                        </div>
                        <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px' }}>
                            <div style={{ height: '100%', width: i === 1 ? '80%' : i === 2 ? '60%' : '90%', background: 'var(--purple)', borderRadius: '4px' }} />
                        </div>
                    </div>
                ))}
            </WireframeBox>
            <WireframeBox title="MANAGER FEEDBACK" style={{ minHeight: '200px' }}>
                <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: '8px', minHeight: '140px' }}>
                    <div style={{ height: '12px', width: '100%', background: '#e2e8f0', marginBottom: '8px' }} />
                    <div style={{ height: '12px', width: '90%', background: '#e2e8f0', marginBottom: '8px' }} />
                    <div style={{ height: '12px', width: '95%', background: '#e2e8f0', marginBottom: '8px' }} />
                    <div style={{ height: '12px', width: '40%', background: '#e2e8f0' }} />
                </div>
            </WireframeBox>
        </div>
    </div>
);

export default function WireframeMockup() {
    const [view, setView] = useState('hr');

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Structural Wireframes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Interactive high-fidelity structural layouts</p>
                </div>
                <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                    {['hr', 'manager', 'employee'].map(v => (
                        <button key={v} onClick={() => setView(v)} style={{
                            padding: '10px 24px', borderRadius: '8px', border: 'none',
                            background: view === v ? 'white' : 'transparent',
                            color: view === v ? 'black' : 'var(--text-muted)',
                            fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px'
                        }}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {view === 'hr' && <HRWireframe />}
            {view === 'manager' && <ManagerWireframe />}
            {view === 'employee' && <EmployeeWireframe />}

            <div style={{ marginTop: '60px', padding: '40px', border: '1px solid var(--border)', borderRadius: '20px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', textAlign: 'center' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Navigation System (Common Sidebar)</h3>
                <div style={{ width: '200px', height: '400px', background: 'white', border: '1px solid var(--border)', margin: '20px auto', display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '20px' }}>
                    <div style={{ height: '32px', width: '80%', background: '#e2e8f0', marginBottom: '40px' }} />
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ height: '14px', width: '100%', background: '#f1f5f9', marginBottom: '16px', borderRadius: '4px' }} />
                    ))}
                    <div style={{ marginTop: 'auto', height: '48px', width: '100%', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} />
                            <div style={{ height: '10px', width: '60px', background: '#e2e8f0', marginTop: '6px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
