import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false, isProcessing = false }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onCancel(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(26, 22, 18, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div
        className="scale-in"
        style={{
          background: '#faf7f2',
          border: '1px solid rgba(139, 120, 96, 0.22)',
          borderRadius: '20px',
          boxShadow: '0 24px 72px rgba(100, 70, 30, 0.22)',
          maxWidth: '420px',
          width: '100%',
          padding: '2rem',
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDestructive ? 'rgba(220,38,38,0.1)' : 'rgba(200,96,42,0.1)',
            border: `1px solid ${isDestructive ? 'rgba(220,38,38,0.2)' : 'rgba(200,96,42,0.2)'}`,
          }}>
            {isDestructive
              ? <AlertTriangle size={26} color="#b91c1c" />
              : <CheckCircle size={26} color="#c8602a" />
            }
          </div>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#1a1612', textAlign: 'center', marginBottom: '0.6rem' }}>
          {title}
        </h3>
        <p style={{ color: '#5a4f42', textAlign: 'center', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '1.75rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="btn-secondary"
            style={{ minWidth: '110px' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={isDestructive ? 'btn-danger' : 'btn-primary'}
            style={{ minWidth: '140px' }}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin" style={{ marginRight: '6px' }} width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
