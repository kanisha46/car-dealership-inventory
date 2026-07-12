import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import SearchBar from '../components/SearchBar';
import VehicalCard from '../components/VehicalCard';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const fetchVehicles = async (searchParams = {}) => {
    setLoading(true);
    setError('');
    try {
      let data;
      // If there are search parameters, use searchVehicles, otherwise use getAllVehicles
      if (Object.keys(searchParams).length > 0) {
        data = await vehicleService.searchVehicles(searchParams);
      } else {
        data = await vehicleService.getAllVehicles();
      }
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch vehicle list. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handlePurchase = async (id) => {
    try {
      const updated = await vehicleService.purchaseVehicle(id);
      setVehicles(vehicles.map((v) => (v.id === id ? updated : v)));
      showNotification('Vehicle purchased successfully!');
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Failed to complete purchase.', 'error');
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      const updated = await vehicleService.restockVehicle(id, quantity);
      setVehicles(vehicles.map((v) => (v.id === id ? updated : v)));
      showNotification('Vehicle restocked successfully!');
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Failed to restock vehicle.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
      showNotification('Vehicle deleted successfully!');
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || 'Failed to delete vehicle.', 'error');
    }
  };

  // Compute Stats
  const totalVehiclesCount = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const uniqueCategories = new Set(vehicles.map((v) => v.category)).size;

  return (
    <div className="container">
      {notification && (
        <div className={`alert-banner alert-banner-${notification.type}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            {notification.type === 'success' ? (
              <polyline points="20 6 9 17 4 12"></polyline>
            ) : (
              <>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </>
            )}
          </svg>
          <span>{notification.message}</span>
        </div>
      )}

      <header style={{ marginBottom: '2.5rem' }}>
        <h1>Showroom Fleet</h1>
        <p>Live inventory management system for premium vehicles.</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-label">Total Inventory Units</div>
          <div className="stat-value">{loading ? '...' : totalVehiclesCount}</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-label">Total Value ($)</div>
          <div className="stat-value">
            {loading ? '...' : totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{loading ? '...' : uniqueCategories}</div>
        </div>
      </div>

      <SearchBar onSearch={fetchVehicles} />

      {error && (
        <div className="badge badge-danger" style={{ display: 'block', padding: '1rem', marginBottom: '2rem', textTransform: 'none', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="vehicles-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="vehicle-card glass" style={{ minHeight: '300px' }}>
              <div className="vehicle-card-body">
                <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%', height: '80px', marginTop: '1rem' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No Vehicles Found</h3>
          <p>Try modifying your search criteria or add new items to the fleet.</p>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <VehicalCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              onDelete={handleDelete}
              onRestock={handleRestock}
            />
          ))}
        </div>
      )}
    </div>
  );
}