import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useAuth } from '../hooks/useAuth';

// Signup page with 2 required questions
export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    experienceLevel: '',
    primaryInterest: '',
  });
  const [error, setError] = useState('');

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to robotics and AI' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience with programming/electronics' },
    { value: 'advanced', label: 'Advanced', description: 'Professional or academic experience' },
  ];

  const interests = [
    { value: 'humanoid-robots', label: 'Humanoid Robots', icon: '🤖' },
    { value: 'industrial-automation', label: 'Industrial Automation', icon: '🏭' },
    { value: 'ai-machine-learning', label: 'AI & Machine Learning', icon: '🧠' },
    { value: 'research-academia', label: 'Research & Academia', icon: '🔬' },
    { value: 'healthcare-robotics', label: 'Healthcare Robotics', icon: '🏥' },
    { value: 'space-exploration', label: 'Space Exploration', icon: '🚀' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!formData.experienceLevel) {
      setError('Please select your experience level.');
      return;
    }

    if (!formData.primaryInterest) {
      setError('Please select your primary interest.');
      return;
    }

    const { success, error } = await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      experienceLevel: formData.experienceLevel as 'beginner' | 'intermediate' | 'advanced',
      primaryInterest: formData.primaryInterest,
    });

    if (!success) {
      setError(error || 'Signup failed. Please try again.');
    } else {
      // Redirect to home after success
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  return (
    <Layout title="Sign Up" description="Create your Physical AI Textbook account">
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
          maxWidth: '500px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#001F3F',
              marginBottom: '0.5rem',
            }}>
              Create Your Account
            </h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Join the Physical AI & Humanoid Robotics learning community
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
            {/* Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                Name (optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                Confirm Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Divider */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              margin: '1.5rem 0',
              paddingTop: '1.5rem',
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#001F3F',
                marginBottom: '0.5rem',
              }}>
                Personalization Questions
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                Help us personalize your learning experience
              </p>
            </div>

            {/* Question 1: Experience Level */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>
                1. What is your experience level? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {experienceLevels.map((level) => (
                  <label
                    key={level.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      border: formData.experienceLevel === level.value
                        ? '2px solid #4a9eff'
                        : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: formData.experienceLevel === level.value
                        ? 'rgba(74, 158, 255, 0.1)'
                        : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level.value}
                      checked={formData.experienceLevel === level.value}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#001F3F' }}>{level.label}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2: Primary Interest */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>
                2. What is your primary interest? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem',
              }}>
                {interests.map((interest) => (
                  <label
                    key={interest.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: formData.primaryInterest === interest.value
                        ? '2px solid #4a9eff'
                        : '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: formData.primaryInterest === interest.value
                        ? 'rgba(74, 158, 255, 0.1)'
                        : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="primaryInterest"
                      value={interest.value}
                      checked={formData.primaryInterest === interest.value}
                      onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{interest.icon}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
                      {interest.label}
                    </span>
                  </label>
                ))}
              </div>
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
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#666',
            fontSize: '0.95rem',
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#4a9eff',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
