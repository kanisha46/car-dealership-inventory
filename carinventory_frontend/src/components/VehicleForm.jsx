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
    <form onSubmit={handleSubmit(onSubmit)} className="form-panel glass">
      <div className="form-group">
        <label className="form-label">Brand</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Tesla"
          {...register('brand', { required: 'Brand is required' })}
        />
        {errors.brand && <span className="form-error">{errors.brand.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Model</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Model S"
          {...register('model', { required: 'Model is required' })}
        />
        {errors.model && <span className="form-error">{errors.model.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Electric Sedan"
          {...register('category', { required: 'Category is required' })}
        />
        {errors.category && <span className="form-error">{errors.category.message}</span>}
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Year</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 2024"
            {...register('year', {
              required: 'Year is required',
              valueAsNumber: true,
              min: { value: 1886, message: 'Year must be valid' },
            })}
          />
          {errors.year && <span className="form-error">{errors.year.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 10"
            {...register('quantity', {
              required: 'Quantity is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Quantity cannot be negative' },
            })}
          />
          {errors.quantity && <span className="form-error">{errors.quantity.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Price ($)</label>
        <input
          type="number"
          step="0.01"
          className="form-input"
          placeholder="e.g. 79990.00"
          {...register('price', {
            required: 'Price is required',
            valueAsNumber: true,
            min: { value: 0.01, message: 'Price must be greater than zero' },
          })}
        />
        {errors.price && <span className="form-error">{errors.price.message}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
        {loading ? 'Submitting...' : submitLabel || 'Submit'}
      </button>
    </form>
  );
}
