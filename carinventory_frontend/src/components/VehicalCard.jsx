import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VehicalCard({ vehicle, onPurchase, onDelete, onRestock }) {
  const { isAdmin } = useAuth();
  const [restockQty, setRestockQty] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [restocking, setRestocking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePurchase = async () => {
    if (purchasing || vehicle.quantity <= 0) return;
    setPurchasing(true);
    try {
      await onPurchase(vehicle.id);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    const qty = parseInt(restockQty);
    if (isNaN(qty) || qty <= 0 || restocking) return;
    setRestocking(true);
    try {
      await onRestock(vehicle.id, qty);
      setRestockQty('');
    } finally {
      setRestocking(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the ${vehicle.brand} ${vehicle.model}?`)) {
      setDeleting(true);
      try {
        await onDelete(vehicle.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="vehicle-card glass">
      <div className="vehicle-card-body">
        <div className="vehicle-card-header">
          <div>
            <span className="vehicle-brand">{vehicle.brand}</span>
            <h3 className="vehicle-title">{vehicle.model}</h3>
          </div>
          <span className="badge badge-primary">{vehicle.category}</span>
        </div>

        <div className="vehicle-meta">
          <span className="badge badge-secondary">{vehicle.year}</span>
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : vehicle.quantity <= 3 ? (
            <span className="badge badge-warning">Low Stock ({vehicle.quantity} left)</span>
          ) : (
            <span className="badge badge-success">{vehicle.quantity} Available</span>
          )}
        </div>

        <div className="vehicle-price-section">
          <span className="vehicle-price">${vehicle.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="vehicle-card-actions">
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || purchasing}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {purchasing ? (
              <span className="skeleton-text" style={{ width: '60px', margin: 0, background: 'rgba(255,255,255,0.3)' }}></span>
            ) : isOutOfStock ? (
              'Unavailable'
            ) : (
              'Purchase'
            )}
          </button>

          {isAdmin && (
            <>
              <form onSubmit={handleRestock} className="restock-section">
                <input
                  type="number"
                  min="1"
                  className="form-input restock-input"
                  placeholder="Qty"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={restocking}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {restocking ? 'Restocking...' : 'Restock'}
                </button>
              </form>

              <div className="admin-actions">
                <Link
                  to={`/vehicles/edit/${vehicle.id}`}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
