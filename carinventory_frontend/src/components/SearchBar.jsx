import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      brand: brand || undefined,
      model: model || undefined,
      year: year ? parseInt(year) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setBrand('');
    setModel('');
    setYear('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="search-panel glass">
      <div className="search-grid">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Brand</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Toyota"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Model</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Camry"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Year</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Min Price ($)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Max Price ($)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', flexGrow: 1 }}>
            Filter
          </button>
          <button type="button" onClick={handleClear} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
