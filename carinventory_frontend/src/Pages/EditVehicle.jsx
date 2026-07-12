import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import LoadingSpinner from '../components/LoadingSpinner';
import { PenSquare, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const FIELD_STYLE = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'rgba(255,253,248,0.9)',
  border: '1.5px solid rgba(139,120,96,0.25)',
  borderRadius: '10px',
  fontSize: '0.9rem',
  color: '#1a1612',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#5a4f42',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
};

const ERROR_STYLE = {
  color: '#c0392b',
  fontSize: '0.78rem',
  marginTop: '0.3rem',
  display: 'block',
};

const SECTION_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.25rem',
};

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    brand: '',
    model: '',
    category: '',
    year: '',
    price: '',
    quantity: '',
    engine: '',
    horsepower: '',
    transmission: '',
    color: '',
    description: '',
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await vehicleService.getVehicleById(id);
        setForm({
          brand: data.brand || '',
          model: data.model || '',
          category: data.category || '',
          year: data.year || '',
          price: data.price || '',
          quantity: data.quantity || '',
          engine: data.engine || '',
          horsepower: data.horsepower || '',
          transmission: data.transmission || '',
          color: data.color || '',
          description: data.description || '',
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load vehicle details.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    if (!form.model.trim()) newErrors.model = 'Model is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.year || isNaN(form.year) || form.year < 1886) newErrors.year = 'Enter a valid year';
    if (!form.price || isNaN(form.price) || form.price <= 0) newErrors.price = 'Enter a valid price';
    if (form.quantity === '' || isNaN(form.quantity) || form.quantity < 0) newErrors.quantity = 'Enter a valid quantity';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        brand: form.brand.trim(),
        model: form.model.trim(),
        category: form.category.trim(),
        year: parseInt(form.year),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        ...(form.engine && { engine: form.engine.trim() }),
        ...(form.horsepower && { horsepower: form.horsepower.trim() }),
        ...(form.transmission && { transmission: form.transmission.trim() }),
        ...(form.color && { color: form.color.trim() }),
        ...(form.description && { description: form.description.trim() }),
      };
      await vehicleService.updateVehicle(id, payload);
      toast.success(`✅ Vehicle updated successfully!`);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputFocus = (e) => {
    e.target.style.borderColor = 'rgba(200,96,42,0.55)';
    e.target.style.boxShadow = '0 0 0 3px rgba(200,96,42,0.10)';
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = 'rgba(139,120,96,0.25)';
    e.target.style.boxShadow = 'none';
  };

  const Field = ({ label, name, type = 'text', placeholder, required }) => (
    <div>
      <label style={LABEL_STYLE}>
        {label} {required && <span style={{ color: '#c8602a' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        onFocus={inputFocus}
        onBlur={inputBlur}
        placeholder={placeholder}
        style={{
          ...FIELD_STYLE,
          borderColor: errors[name] ? 'rgba(192,57,43,0.6)' : 'rgba(139,120,96,0.25)',
        }}
        autoComplete="off"
      />
      {errors[name] && <span style={ERROR_STYLE}>{errors[name]}</span>}
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '4rem' }}>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#8c7e6e', fontSize: '0.85rem', fontWeight: 600,
          marginBottom: '1.5rem', padding: '0.25rem 0',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#c8602a'}
        onMouseLeave={e => e.currentTarget.style.color = '#8c7e6e'}
      >
        <ArrowLeft size={15} />
        Back to Inventory
      </button>

      {/* Header */}
      <div className="hero-banner fade-up" style={{ padding: '2rem 2rem 1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #2a7cc8, #1a5a9a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(42,124,200,0.35)', flexShrink: 0,
          }}>
            <PenSquare color="white" size={24} />
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: 800, color: '#1a1612', lineHeight: 1,
              letterSpacing: '-0.02em', margin: 0,
            }}>
              Edit Vehicle
            </h1>
            <p style={{ color: '#8c7e6e', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
              Update details for <strong style={{ color: '#1a1612' }}>{form.brand} {form.model}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>

        {/* Core Details */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#1a1612', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Vehicle Details
          </span>

          <div style={{ ...SECTION_STYLE, marginBottom: '1.25rem' }}>
            <Field label="Brand" name="brand" placeholder="e.g. Honda" required />
            <Field label="Model" name="model" placeholder="e.g. City" required />
          </div>

          <div style={{ ...SECTION_STYLE, marginBottom: '1.25rem' }}>
            <Field label="Category" name="category" placeholder="e.g. Sedan" required />
            <Field label="Year" name="year" type="number" placeholder="e.g. 2024" required />
          </div>

          <div style={SECTION_STYLE}>
            <Field label="Price (₹ INR)" name="price" type="number" placeholder="e.g. 1500000" required />
            <Field label="Quantity in Stock" name="quantity" type="number" placeholder="e.g. 10" required />
          </div>
        </div>

        {/* Specs */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#1a1612', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Specifications <span style={{ color: '#8c7e6e', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span>
          </span>

          <div style={{ ...SECTION_STYLE, marginBottom: '1.25rem' }}>
            <Field label="Engine" name="engine" placeholder="e.g. 1.5L VTEC Turbo" />
            <Field label="Horsepower" name="horsepower" placeholder="e.g. 127 HP" />
          </div>

          <div style={SECTION_STYLE}>
            <Field label="Transmission" name="transmission" placeholder="e.g. CVT Automatic" />
            <Field label="Color" name="color" placeholder="e.g. Lunar Silver" />
          </div>
        </div>

        {/* Description */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1.75rem', marginBottom: '2rem' }}>
          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#1a1612', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Description <span style={{ color: '#8c7e6e', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span>
          </span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            onFocus={inputFocus}
            onBlur={inputBlur}
            placeholder="Describe this vehicle's highlights, features, and appeal..."
            rows={4}
            style={{ ...FIELD_STYLE, resize: 'vertical', minHeight: '100px' }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{
            width: '100%', padding: '1rem',
            fontSize: '1rem', fontWeight: 700,
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)',
                borderTop: '2px solid white', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', display: 'inline-block',
              }} />
              Saving Changes...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={18} />
              Save Changes
            </span>
          )}
        </button>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </form>
    </div>
  );
}