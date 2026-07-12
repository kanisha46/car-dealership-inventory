import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1503376760359-740751efb709?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'
];

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
  // Use vehicle ID to deterministically pick an image
  const imageUrl = CAR_IMAGES[(vehicle.id || 0) % CAR_IMAGES.length];

  return (
    <div className="vehicle-card glass model-card">
      <div className="vehicle-card-image-container">
        <img src={imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-card-image" />
        <div className="vehicle-card-image-overlay"></div>
        <div className="vehicle-category-badge">{vehicle.category}</div>
      </div>
      
      <div className="vehicle-card-body">
        <div className="vehicle-card-header">
          <div>
            <span className="vehicle-brand">{vehicle.brand}</span>
            <h3 className="vehicle-title">{vehicle.model}</h3>
          </div>
          <span className="badge badge-secondary">{vehicle.year}</span>
        </div>

        <div className="vehicle-meta">
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
              'Purchase Vehicle'
            )}
          </button>

          {isAdmin && (
            <div className="admin-controls">
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
                  className="btn btn-secondary btn-sm"
                  style={{ flexGrow: 1 }}
                >
                  {restocking ? '...' : 'Restock'}
                </button>
              </form>

              <div className="admin-actions">
                <Link
                  to={`/vehicles/edit/${vehicle.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                >
                  {deleting ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
