import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="glass-panel" style={{
            margin: '20px',
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '20px',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex'
                }}>
                    <Sprout color="white" size={24} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Krishi<span style={{ color: '#10b981' }}>AI</span></span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/disease" className={isActive('/disease')}>Disease Detection</Link>
                <Link to="/crop" className={isActive('/crop')}>Crop Recommendation</Link>
                <Link to="/fertilizer" className={isActive('/fertilizer')}>Fertilizer</Link>
            </div>
        </nav>
    );
};

export default Navbar;
