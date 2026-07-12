import React, { useEffect, useState } from 'react';
import { X, ShoppingCart, Star, Shield, Zap, Gauge, Palette, Settings, Calendar, Package, ChevronRight } from 'lucide-react';

export default function CarDetailModal({ vehicle, onClose, onPurchase }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;
  const gradClass = vehicle.gradientClass || 'car-img-porsche';

  const features = vehicle.features || [
    'Advanced Safety System', 'Premium Sound System', 'Panoramic Sunroof',
    'Heated & Ventilated Seats', 'Wireless Charging', 'Lane Assist Technology',
  ];
  const specs = vehicle.specs || {};

  // SVG Silhouette
  const CarSilhouette = () => (
    <svg viewBox="0 0 340 130" fill="none" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '75%', opacity: 0.3 }}>
      <path d="M25 92 L68 50 Q95 22 140 20 L200 20 Q242 22 268 50 L308 92 L318 102 L318 115 L22 115 L22 102 Z" fill="white"/>
      <ellipse cx="78" cy="115" rx="28" ry="22" fill="white"/>
      <ellipse cx="263" cy="115" rx="28" ry="22" fill="white"/>
      <path d="M75 70 L90 45 Q105 28 130 26 L205 26 Q228 28 242 45 L255 70 Z" fill="rgba(255,255,255,0.18)"/>
    </svg>
  );

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(20, 16, 10, 0.65)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div
        className="scale-in"
        style={{
          background: 'linear-gradient(165deg, #fdf9f4 0%, #f5efe4 100%)',
          borderRadius: '28px',
          border: '1px solid rgba(200, 140, 80, 0.25)',
          boxShadow: '0 32px 100px rgba(80, 50, 20, 0.35), 0 0 0 1px rgba(255,255,255,0.5) inset',
          maxWidth: '900px', width: '100%', maxHeight: '93vh', overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 20,
            width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer',
            background: 'rgba(255,253,248,0.9)', border: '1px solid rgba(139,120,96,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#5a4f42', transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#c8602a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#c8602a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,253,248,0.9)'; e.currentTarget.style.color = '#5a4f42'; e.currentTarget.style.borderColor = 'rgba(139,120,96,0.25)'; }}
        >
          <X size={18} />
        </button>

        {/* Hero Image / Gradient */}
        <div
          className={gradClass}
          style={{ position: 'relative', height: '300px', borderRadius: '28px 28px 0 0', overflow: 'hidden' }}
        >
          {/* Always show gradient base */}
          <div className={gradClass} style={{ position: 'absolute', inset: 0 }} />

          {/* SVG silhouette as fallback decoration */}
          <CarSilhouette />

          {/* Actual image */}
          {vehicle.imageUrl && !imgError && (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              onError={() => setImgError(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
            />
          )}

          {/* Bottom fade to card background */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: 'linear-gradient(to top, #f5efe4 0%, rgba(245,239,228,0.6) 30%, transparent 65%)',
          }} />

          {/* Category + Brand tags */}
          <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(200,96,42,0.92)', backdropFilter: 'blur(8px)', color: '#fff', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              {vehicle.category}
            </div>
            <div style={{ background: 'rgba(26,22,18,0.7)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.85rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em' }}>
              {vehicle.year}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '0 2.25rem 2.25rem', marginTop: '-2.5rem', position: 'relative', zIndex: 5 }}>

          {/* Title + Price row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c8602a', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.4rem' }}>
                {vehicle.brand}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', fontWeight: 800, color: '#1a1612', lineHeight: 1.05, marginBottom: '0.2rem' }}>
                {vehicle.model}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {'★★★★★'.split('').map((_, i) => (
                  <span key={i} style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★</span>
                ))}
                <span style={{ color: '#8c7e6e', fontSize: '0.8rem', marginLeft: '4px' }}>4.9 / 5.0</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#c8602a', lineHeight: 1, letterSpacing: '-0.03em' }}>
                ${vehicle.price?.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8c7e6e', marginTop: '0.2rem', fontWeight: 500 }}>Starting price (USD)</div>
            </div>
          </div>

          {/* Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(138px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { icon: <Gauge size={15} />, label: 'Engine', value: specs.engine || vehicle.engine || '2.0L Turbo' },
              { icon: <Zap size={15} />, label: 'Horsepower', value: specs.horsepower || vehicle.horsepower || '250 HP' },
              { icon: <Settings size={15} />, label: 'Gearbox', value: specs.transmission || vehicle.transmission || 'Automatic' },
              { icon: <Palette size={15} />, label: 'Color', value: specs.color || vehicle.color || 'Metallic Silver' },
              { icon: <Shield size={15} />, label: 'Warranty', value: specs.warranty || '3 Years' },
              { icon: <Package size={15} />, label: 'Delivery', value: 'Free Nationwide' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                background: 'rgba(255,253,248,0.8)', border: '1px solid rgba(200,160,80,0.18)',
                borderRadius: '14px', padding: '1rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(100,70,30,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.45rem' }}>
                  <span style={{ color: '#c8602a' }}>{icon}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#8c7e6e' }}>{label}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1612' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{
            background: 'rgba(200,96,42,0.04)', border: '1px solid rgba(200,96,42,0.12)',
            borderRadius: '14px', padding: '1.25rem', marginBottom: '1.75rem',
          }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c8602a', marginBottom: '0.7rem' }}>
              About this vehicle
            </h4>
            <p style={{ color: '#5a4f42', lineHeight: 1.75, fontSize: '0.93rem' }}>
              {vehicle.description || `Experience the pinnacle of automotive engineering with the ${vehicle.brand} ${vehicle.model}. Combining sophisticated design with cutting-edge technology, this ${vehicle.year} model delivers unmatched performance, comfort, and style.`}
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c7e6e', marginBottom: '0.9rem' }}>
              Key Features
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.55rem' }}>
              {features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#5a4f42' }}>
                  <ChevronRight size={13} color="#c8602a" strokeWidth={2.5} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Purchase CTA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(200,96,42,0.08) 0%, rgba(180,130,50,0.06) 100%)',
            border: '1px solid rgba(200,96,42,0.2)',
            borderRadius: '18px', padding: '1.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1rem', flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c7e6e', marginBottom: '0.5rem' }}>
                Availability
              </div>
              {isOutOfStock ? (
                <span className="badge-danger" style={{ fontSize: '0.78rem' }}>Out of Stock</span>
              ) : vehicle.quantity <= 3 ? (
                <span className="badge-warning" style={{ fontSize: '0.78rem' }}>⚡ Only {vehicle.quantity} Left!</span>
              ) : (
                <span className="badge-success" style={{ fontSize: '0.78rem' }}>✓ {vehicle.quantity} Units Ready</span>
              )}
              <p style={{ color: '#8c7e6e', fontSize: '0.78rem', marginTop: '0.5rem' }}>
                📦 Free delivery · 🔧 Service included · 🏦 Finance available
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onClose} className="btn-secondary" style={{ minWidth: '100px' }}>
                Back
              </button>
              <button
                onClick={() => { onClose(); onPurchase(); }}
                disabled={isOutOfStock}
                className="btn-primary"
                style={{ minWidth: '200px', fontSize: '1rem', padding: '0.85rem 1.75rem' }}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? 'Unavailable' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
