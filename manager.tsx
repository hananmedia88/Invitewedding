
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';

const ManagerApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real app, invitation data and RSVPs would be fetched from an API
  const dummyInvitationData = {
    couple: { brideName: 'Siti', groomName: 'Budi' },
    event: { date: '2025-08-20', time: '09:00', locationName: 'Gedung Jakarta', address: 'Jl. Merdeka' },
    theme: 'classic' as const,
    music: { url: '', title: '', isAutoPlay: true }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLoginSuccess={() => setIsAuthenticated(true)} 
        onBack={() => window.location.href = 'index.html'} 
      />
    );
  }

  return (
    <AdminPanel 
      rsvps={[]} 
      onBack={() => window.location.href = 'index.html'} 
      invitationData={dummyInvitationData as any} 
    />
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<ManagerApp />);
}
