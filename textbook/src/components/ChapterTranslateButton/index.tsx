import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { useAuth } from '../../hooks/useAuth';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface ChapterTranslateButtonProps {
  chapterSlug: string;
}

export default function ChapterTranslateButton({ chapterSlug }: ChapterTranslateButtonProps): JSX.Element | null {
  const { isAuthenticated, isLoading, user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { i18n } = useDocusaurusContext();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationPoints, setTranslationPoints] = useState<number | null>(null);

  // Check if already on Urdu version
  const isUrduVersion = i18n.currentLocale === 'ur' || location.pathname.startsWith('/ur/');

  // Don't show button on Urdu pages (already translated)
  if (isUrduVersion) {
    return null;
  }

  const handleTranslate = async () => {
    // Check authentication
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const currentPath = location.pathname;
      history.push(`/login?redirect=${encodeURIComponent(currentPath)}`);

      // Show toast
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'Login required to access Urdu translation',
            type: 'info'
          }
        });
        window.dispatchEvent(event);
      }
      return;
    }

    setIsTranslating(true);

    try {
      // Track this translation on backend
      const apiUrl = (window as any).docusaurusConfig?.customFields?.apiUrl || '';
      const response = await fetch(`${apiUrl}/api/user/track-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          chapterSlug,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslationPoints(data.totalPoints);

        // Show success message with points
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('show-toast', {
            detail: {
              message: `+${data.pointsEarned || 5} points! Total: ${data.totalPoints}/50`,
              type: 'success'
            }
          });
          window.dispatchEvent(event);
        }
      }

      // Navigate to Urdu version
      const urduPath = `/ur${location.pathname}`;

      // Small delay for visual feedback
      setTimeout(() => {
        window.location.href = urduPath;
      }, 800);

    } catch (error) {
      console.error('Translation tracking error:', error);

      // Still navigate to Urdu even if tracking failed
      const urduPath = `/ur${location.pathname}`;
      window.location.href = urduPath;
    }
  };

  // Don't render while checking auth
  if (isLoading) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <h3 style={{
          color: 'white',
          margin: '0 0 8px 0',
          fontSize: '1.3rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌐</span>
          Read in Urdu / اردو میں پڑھیں
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          margin: 0,
          fontSize: '0.95rem',
        }}>
          {isAuthenticated
            ? '📚 Earn bonus points by reading this chapter in Urdu!'
            : '🔒 Login to unlock Urdu translation and earn bonus points'
          }
        </p>
        {translationPoints !== null && (
          <p style={{
            color: '#ffd700',
            margin: '8px 0 0 0',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}>
            ⭐ Your Progress: {translationPoints}/50 points
          </p>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        style={{
          background: 'white',
          color: '#667eea',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 28px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: isTranslating ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1,
          opacity: isTranslating ? 0.7 : 1,
          transform: isTranslating ? 'scale(0.95)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!isTranslating) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isTranslating) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
          }
        }}
      >
        {isTranslating ? (
          <>
            <span style={{ marginRight: '8px' }}>⏳</span>
            Loading...
          </>
        ) : (
          <>
            <span style={{ marginRight: '8px' }}>اردو</span>
            {isAuthenticated ? 'Translate' : 'Login to Translate'}
          </>
        )}
      </button>
    </div>
  );
}
