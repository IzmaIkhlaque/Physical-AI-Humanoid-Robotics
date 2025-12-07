import React from 'react';
import ChatWidget from '../components/ChatKit/ChatWidget';
import UserMenu from '../components/UserMenu';
import { AuthProvider } from '../context/AuthContext';

// Root wrapper component
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ChatWidget />
      <UserMenu />
    </AuthProvider>
  );
}
