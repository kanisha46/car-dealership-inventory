import React, { useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    onSearch({
      brand: brand || undefined,
      model: model || undefined,
      year: year ? parseInt(year) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setBrand(''); setModel(''); setYear(''); setMinPrice(''); setMaxPrice('');
    onSearch({});
  };

  return (
    <div
      style={{
        background: '#faf7f2', border: '1px solid rgba(139,120,96,0.2)',
        borderRadius: '16px', marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(100, 70, 30, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Quick Search Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search
            size={18}
            color="#8c7e6e"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '42px', height: '46px', fontSize: '0.95rem' }}
            placeholder="Search by brand (e.g. BMW, Ferrari, Tesla)..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            height: '46px', padding: '0 1rem',
            display: 'flex', alignItems: 'center', gap: '6px',
            borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
            transition: 'all 0.2s',
            ...(isExpanded
              ? { background: 'rgba(200,96,42,0.12)', color: '#c8602a', border: '1.5px solid rgba(200,96,42,0.3)' }
              : { background: 'rgba(139,120,96,0.1)', color: '#5a4f42', border: '1.5px solid rgba(139,120,96,0.22)' }
            ),
          }}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          onClick={handleSubmit}
          className="btn-primary"
          style={{ height: '46px', padding: '0 1.25rem', fontSize: '0.9rem' }}
        >
          Search
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '1.25rem 1rem 1rem',
            borderTop: '1px solid rgba(139,120,96,0.15)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Model', placeholder: 'e.g. Camry', value: model, onChange: (v) => setModel(v), type: 'text' },
              { label: 'Year', placeholder: 'e.g. 2024', value: year, onChange: (v) => setYear(v), type: 'number' },
              { label: 'Min Price (₹)', placeholder: '0', value: minPrice, onChange: (v) => setMinPrice(v), type: 'number' },
              { label: 'Max Price (₹)', placeholder: 'Any', value: maxPrice, onChange: (v) => setMaxPrice(v), type: 'number' },
            ].map(({ label, placeholder, value, onChange, type }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8c7e6e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                  {label}
                </label>
                <input
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="submit" className="btn-primary" style={{ minWidth: '160px' }}>
              Apply Filters
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
