import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleForm from '../components/VehicleForm';

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load vehicle details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await vehicleService.updateVehicle(id, data);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1>Edit Vehicle Details</h1>
        <p>Modify details for an existing vehicle in the inventory.</p>
      </header>

      {error && (
        <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1.5rem', textTransform: 'none', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="form-panel glass">
          <div className="skeleton skeleton-title" style={{ width: '40%', marginBottom: '1.5rem' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '40px', marginBottom: '1.25rem' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '40px', marginBottom: '1.25rem' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '40px', marginBottom: '1.25rem' }}></div>
        </div>
      ) : (
        vehicle && (
          <VehicleForm
            initialData={{
              brand: vehicle.brand,
              model: vehicle.model,
              category: vehicle.category,
              year: vehicle.year,
              price: vehicle.price,
              quantity: vehicle.quantity,
            }}
            onSubmit={onSubmit}
            submitLabel="Update Vehicle"
            loading={submitting}
          />
        )
      )}
    </div>
  );
}