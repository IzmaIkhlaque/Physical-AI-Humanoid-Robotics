import { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '../hooks/useAuth';

// Login page
export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    const { success, error } = await login(formData.email, formData.password);

    if (!success) {
      setError(error || 'Login failed. Please try again.');
    } else {
      // Check for redirect parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');

      // Redirect to the original page or home
      setTimeout(() => {
        window.location.href = redirectUrl || '/';
      }, 500);
    }
  };

  return (
    <Layout title="Login" description="Login to your Physical AI Textbook account">
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #001F3F 0%, #003366 50%, #001F3F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, #001F3F, #003366)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#001F3F',
              marginBottom: '0.5rem',
            }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Login to access your personalized content
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                background: isLoading
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #001F3F, #003366)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Signup Link */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#666',
            fontSize: '0.95rem',
          }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#4a9eff',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </p>

          {/* Premium Features Info */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.05), rgba(74, 158, 255, 0.1))',
            borderRadius: '0.5rem',
            border: '1px solid rgba(74, 158, 255, 0.2)',
          }}>
            <h4 style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#001F3F',
              marginBottom: '0.5rem',
            }}>
              Login to unlock:
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '1.25rem',
              fontSize: '0.85rem',
              color: '#555',
            }}>
              <li>AI-powered ChatKit assistant</li>
              <li>Urdu/English translation toggle</li>
              <li>Personalized learning tips</li>
              <li>Progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
