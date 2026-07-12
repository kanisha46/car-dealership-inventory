import React from 'react';

export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        {/* Outer glow */}
        <div style={{
          position: 'absolute', inset: '-4px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,96,42,0.2) 0%, transparent 70%)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        {/* Spinner ring */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3.5px solid rgba(139,120,96,0.2)',
          borderTopColor: '#c8602a',
          animation: 'spin 0.8s linear infinite',
          position: 'relative', zIndex: 1,
        }} />
      </div>
      <p style={{
        color: '#8c7e6e', fontSize: '0.75rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.15em',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        Loading vehicles...
      </p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(245,240,232,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 2rem', width: '100%' }}>
      {spinner}
    </div>
  );
}
