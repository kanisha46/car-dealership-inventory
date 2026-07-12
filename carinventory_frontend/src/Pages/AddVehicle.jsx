import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleForm from '../components/VehicleForm';
import { CarFront } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await vehicleService.createVehicle(data);
      toast.success('Vehicle added successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create vehicle. Please verify input.');
      toast.error('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <header className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10 mb-4">
          <CarFront className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
          Add New Fleet Vehicle
        </h1>
        <p className="text-slate-400">Register a brand new automobile to the showroom roster.</p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center mb-6">
          {error}
        </div>
      )}

      <VehicleForm onSubmit={onSubmit} submitLabel="Register Vehicle" loading={loading} />
    </div>
  );
}