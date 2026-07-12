import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '1rem' }}>
      <div
        className="scale-in"
        style={{
          background: '#faf7f2', border: '1px solid rgba(139,120,96,0.2)',
          borderRadius: '24px', padding: '2.5rem',
          width: '100%', maxWidth: '440px',
          boxShadow: '0 16px 60px rgba(100, 70, 30, 0.14)',
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(200,96,42,0.15), rgba(200,96,42,0.08))',
            border: '1px solid rgba(200,96,42,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(200,96,42,0.12)',
          }}>
            <LogIn color="#c8602a" size={28} />
          </div>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#1a1612', textAlign: 'center', marginBottom: '0.5rem' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#8c7e6e', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Sign in to manage the showroom inventory
        </p>

        {apiError && (
          <div style={{
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.22)',
            color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '10px',
            fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem',
          }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a4f42', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Email Address
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="name@dealership.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
              })}
            />
            {errors.email && <span style={{ color: '#b91c1c', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>{errors.email.message}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5a4f42', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <span style={{ color: '#b91c1c', fontSize: '0.78rem', marginTop: '0.35rem', display: 'block' }}>{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#8c7e6e' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#c8602a', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}