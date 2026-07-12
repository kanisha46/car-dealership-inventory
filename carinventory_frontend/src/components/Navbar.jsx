import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(250, 245, 235, 0.82)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderBottom: '1px solid rgba(200, 140, 70, 0.18)',
      boxShadow: '0 4px 24px rgba(100, 70, 30, 0.12), 0 1px 0 rgba(255,255,255,0.7) inset',
    }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div style={{
              background: 'linear-gradient(135deg, #c8602a, #a04820)',
              borderRadius: '10px',
              padding: '7px',
              boxShadow: '0 4px 14px rgba(200,96,42,0.35)',
              transition: 'transform 0.2s ease',
            }} className="group-hover:scale-110">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem', color: '#1a1612', letterSpacing: '-0.01em' }}>
              AutoVault
            </span>
          </Link>

          {/* Center Nav */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              style={{ color: '#5a4f42', fontWeight: 500, fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#c8602a'}
              onMouseLeave={e => e.target.style.color = '#5a4f42'}
            >
              Showroom
            </Link>
            {isAdmin && (
              <Link
                to="/vehicles/add"
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '0.85rem', fontWeight: 600,
                  color: '#c8602a',
                  background: 'rgba(200,96,42,0.1)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(200,96,42,0.22)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Vehicle
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2" style={{ fontSize: '0.875rem', color: '#5a4f42' }}>
                  Hi, <strong style={{ color: '#1a1612' }}>{user?.name || 'User'}</strong>
                  {isAdmin && (
                    <span style={{
                      background: 'rgba(200,96,42,0.12)', color: '#a04820',
                      fontSize: '0.65rem', fontWeight: 700,
                      padding: '0.15rem 0.5rem', borderRadius: '999px',
                      border: '1px solid rgba(200,96,42,0.25)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>Admin</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                    color: '#5a4f42', background: 'rgba(139,120,96,0.1)',
                    border: '1.5px solid rgba(139,120,96,0.25)', borderRadius: '9px',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(200,96,42,0.1)'; e.target.style.color = '#a04820'; e.target.style.borderColor = 'rgba(200,96,42,0.3)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(139,120,96,0.1)'; e.target.style.color = '#5a4f42'; e.target.style.borderColor = 'rgba(139,120,96,0.25)'; }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  style={{
                    padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                    color: '#5a4f42', background: 'rgba(139,120,96,0.1)',
                    border: '1.5px solid rgba(139,120,96,0.25)', borderRadius: '9px',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                >Login</Link>
                <Link
                  to="/register"
                  style={{
                    padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #c8602a, #a04820)',
                    borderRadius: '9px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(200,96,42,0.35)',
                    transition: 'all 0.2s',
                  }}
                >Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
