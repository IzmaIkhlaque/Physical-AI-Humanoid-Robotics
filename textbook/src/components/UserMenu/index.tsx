import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  // Don't show on login/signup pages
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('/login') || path.includes('/signup')) {
      return null;
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '1.5rem',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 31, 63, 0.1)',
          borderRadius: '2rem',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #4a9eff, #7ab8ff)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
          }}
        >
          {(user.name || user.email)[0].toUpperCase()}
        </div>
        <span style={{ color: '#333', fontSize: '0.9rem' }}>
          {user.name || user.email.split('@')[0]}
        </span>
      </button>

      {showMenu && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>
              {user.name || user.email}
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#666' }}>
              {user.experienceLevel} • {user.primaryInterest?.replace('-', ' ')}
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#ef4444',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
