import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function VehicleForm({ initialData, onSubmit, submitLabel, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      brand: '',
      model: '',
      category: '',
      year: '',
      price: '',
      quantity: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Brand</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Tesla"
            {...register('brand', { required: 'Brand is required' })}
          />
          {errors.brand && <span className="text-red-400 text-xs mt-1 block">{errors.brand.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Model S"
            {...register('model', { required: 'Model is required' })}
          />
          {errors.model && <span className="text-red-400 text-xs mt-1 block">{errors.model.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Electric Sedan"
          {...register('category', { required: 'Category is required' })}
        />
        {errors.category && <span className="text-red-400 text-xs mt-1 block">{errors.category.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 2024"
            {...register('year', {
              required: 'Year is required',
              valueAsNumber: true,
              min: { value: 1886, message: 'Year must be valid' },
            })}
          />
          {errors.year && <span className="text-red-400 text-xs mt-1 block">{errors.year.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 10"
            {...register('quantity', {
              required: 'Quantity is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Quantity cannot be negative' },
            })}
          />
          {errors.quantity && <span className="text-red-400 text-xs mt-1 block">{errors.quantity.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹ INR)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            placeholder="e.g. 1500000.00"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Price must be greater than zero' },
            })}
          />
          {errors.price && <span className="text-red-400 text-xs mt-1 block">{errors.price.message}</span>}
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
          {loading ? 'Submitting...' : submitLabel || 'Submit'}
        </button>
      </div>
    </form>
  );
}
