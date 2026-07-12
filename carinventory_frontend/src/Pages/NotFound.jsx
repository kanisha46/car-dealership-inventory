import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--danger) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </h1>
        <h3 style={{ marginBottom: '1rem' }}>Page Not Found</h3>
        <p style={{ marginBottom: '2rem' }}>
          The path you are trying to access does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}