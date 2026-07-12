import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, PackagePlus, Eye, Zap } from 'lucide-react';

export default function VehicalCard({ vehicle, onPurchase, onDelete, onRestock, onViewDetail }) {
  const { isAdmin } = useAuth();
  const [restockQty, setRestockQty] = useState('');
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isOutOfStock = vehicle.quantity <= 0;
  const gradClass = vehicle.gradientClass || 'car-img-porsche';

  // SVG Car silhouette for gradient card background
  const CarSilhouette = () => (
    <svg viewBox="0 0 280 120" fill="none" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '80%', opacity: 0.35 }}>
      <path d="M20 80 L55 45 Q80 20 115 18 L165 18 Q200 20 220 45 L255 80 L265 88 L265 100 L15 100 L15 88 Z" fill="white"/>
      <ellipse cx="65" cy="100" rx="22" ry="18" fill="white"/>
      <ellipse cx="215" cy="100" rx="22" ry="18" fill="white"/>
      <path d="M60 60 L75 38 Q88 25 110 24 L160 24 Q182 25 192 38 L205 60 Z" fill="rgba(255,255,255,0.2)"/>
    </svg>
  );

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '20px', overflow: 'hidden' }}>

      {/* ── Image / Gradient Header ── */}
      <div
        onClick={() => onViewDetail && onViewDetail(vehicle)}
        className={imgError || !vehicle.imageUrl ? gradClass : ''}
        style={{
          position: 'relative', height: '210px', overflow: 'hidden', cursor: 'pointer',
          background: imgError || !vehicle.imageUrl ? undefined : '#e8ddd0',
        }}
      >
        {/* Gradient background always shown */}
        <div className={gradClass} style={{ position: 'absolute', inset: 0 }} />

        {/* Shimmer while loading */}
        {!imgLoaded && !imgError && vehicle.imageUrl && (
          <div className="shimmer" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)', backgroundSize: '200% auto' }} />
        )}

        {/* Car image */}
        {vehicle.imageUrl && !imgError && (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'opacity 0.4s ease, transform 0.6s ease',
              opacity: imgLoaded ? 1 : 0,
              transform: 'scale(1.02)',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.10)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1.02)'}
          />
        )}

        {/* SVG silhouette shown on gradient (when image fails or is missing) */}
        {(imgError || !vehicle.imageUrl) && <CarSilhouette />}

        {/* Bottom gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(255,253,248,0.97) 0%, rgba(255,253,248,0.4) 38%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(26,22,18,0.75)', backdropFilter: 'blur(8px)',
          color: '#fff', padding: '0.2rem 0.65rem', borderRadius: '999px',
          fontSize: '0.63rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em',
          border: '1px solid rgba(255,255,255,0.15)', zIndex: 2,
        }}>
          {vehicle.category}
        </div>

        {/* Hover "View" overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(200,96,42,0.0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.3s ease',
          zIndex: 2,
        }}
          className="img-hover-overlay"
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,96,42,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,96,42,0)'; }}
        >
          <div style={{
            background: 'rgba(255,253,248,0.92)', backdropFilter: 'blur(8px)',
            borderRadius: '999px', padding: '0.5rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.8rem', fontWeight: 700, color: '#c8602a',
            border: '1px solid rgba(200,96,42,0.3)',
            opacity: 0, transition: 'opacity 0.3s ease',
          }} className="view-label">
            <Eye size={14} /> View Details
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '1rem 1.4rem 1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: '-1.6rem', position: 'relative', zIndex: 1 }}>

        {/* Brand + Year */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#c8602a', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {vehicle.brand}
          </span>
          <span className="badge-secondary">{vehicle.year}</span>
        </div>

        {/* Model */}
        <h3
          onClick={() => onViewDetail && onViewDetail(vehicle)}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.45rem', fontWeight: 800, color: '#1a1612',
            marginBottom: '0.7rem', cursor: 'pointer', lineHeight: 1.15,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#c8602a'}
          onMouseLeave={e => e.target.style.color = '#1a1612'}
        >
          {vehicle.model}
        </h3>

        {/* Specs mini row */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {vehicle.horsepower && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#8c7e6e', background: 'rgba(139,120,96,0.08)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(139,120,96,0.15)' }}>
              <Zap size={10} color="#c8602a" /> {vehicle.horsepower}
            </div>
          )}
          {vehicle.engine && (
            <div style={{ fontSize: '0.72rem', color: '#8c7e6e', background: 'rgba(139,120,96,0.08)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(139,120,96,0.15)' }}>
              {vehicle.engine}
            </div>
          )}
        </div>

        {/* Stock badge */}
        <div style={{ marginBottom: '0.9rem' }}>
          {isOutOfStock ? (
            <span className="badge-danger">Out of Stock</span>
          ) : vehicle.quantity <= 3 ? (
            <span className="badge-warning">⚡ Only {vehicle.quantity} Left</span>
          ) : (
            <span className="badge-success">✓ {vehicle.quantity} Available</span>
          )}
        </div>

        {/* Price */}
        <div style={{
          borderTop: '1px solid rgba(139,120,96,0.18)',
          borderBottom: '1px solid rgba(139,120,96,0.18)',
          padding: '0.7rem 0', marginBottom: '1rem',
          display: 'flex', alignItems: 'baseline', gap: '0.4rem',
        }}>
          <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#c8602a', letterSpacing: '-0.03em', lineHeight: 1 }}>
            ${vehicle.price?.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#8c7e6e', fontWeight: 500 }}>USD</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewDetail && onViewDetail(vehicle)}
          className="btn-primary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', marginBottom: isAdmin ? '0.75rem' : 0 }}
        >
          <Eye size={16} />
          View Details & Purchase
        </button>

        {/* Admin Panel */}
        {isAdmin && (
          <div style={{
            background: 'rgba(232,224,208,0.5)', border: '1px solid rgba(139,120,96,0.18)',
            borderRadius: '12px', padding: '0.85rem',
            display: 'flex', flexDirection: 'column', gap: '0.55rem',
          }}>
            <form onSubmit={(e) => { e.preventDefault(); onRestock(vehicle.id, parseInt(restockQty)); setRestockQty(''); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number" min="1"
                className="input-field"
                style={{ width: '5rem', textAlign: 'center', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                placeholder="Qty" value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)} required
              />
              <button type="submit" className="btn-secondary" style={{ flexGrow: 1, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <PackagePlus size={13} /> Restock
              </button>
            </form>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/vehicles/edit/${vehicle.id}`} className="btn-secondary" style={{ flex: 1, textDecoration: 'none', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <Edit size={13} /> Edit
              </Link>
              <button onClick={() => onDelete(vehicle)} className="btn-danger" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for hover overlay */}
      <style>{`
        .img-hover-overlay:hover .view-label { opacity: 1 !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
