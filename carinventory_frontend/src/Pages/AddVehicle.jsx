import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleForm from '../components/VehicleForm';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await vehicleService.createVehicle(data);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create vehicle. Please verify input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1>Add New Fleet Vehicle</h1>
        <p>Register a brand new automobile to the showroom roster.</p>
      </header>

      {error && (
        <div className="badge badge-danger" style={{ display: 'block', padding: '0.75rem', marginBottom: '1.5rem', textTransform: 'none', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <VehicleForm onSubmit={onSubmit} submitLabel="Register Vehicle" loading={loading} />
    </div>
  );
}