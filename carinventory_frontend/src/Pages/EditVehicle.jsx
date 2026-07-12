import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleForm from '../components/VehicleForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.success('Vehicle updated successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update vehicle.');
      toast.error('Failed to update vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <header className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10 mb-4">
          <PenSquare className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
          Edit Vehicle Details
        </h1>
        <p className="text-slate-400">Modify details for an existing vehicle in the inventory.</p>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
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