import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import ChatWidget from '../components/ChatKit/ChatWidget';
import UserMenu from '../components/UserMenu';
import PersonalizeTips from '../components/PersonalizeTips';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Urdu route guard component
function UrduRouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Check if user is accessing Urdu locale (/ur/ routes)
    if (location.pathname.startsWith('/ur/') && !isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = location.pathname + location.search;
      history.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);

      // Show a toast notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'Login required to access Urdu translation',
            type: 'info'
          }
        });
        window.dispatchEvent(event);
      }
    }
  }, [location.pathname, isAuthenticated, isLoading, history, location.search]);

  // Show loading state while checking auth
  if (location.pathname.startsWith('/ur/') && isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}

// Root wrapper component
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UrduRouteGuard>
        {children}
      </UrduRouteGuard>
      <ChatWidget />
      <UserMenu />
      <PersonalizeTips />
    </AuthProvider>
  );
}
