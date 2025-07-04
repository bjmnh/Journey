import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import LandingPage from './components/auth/LandingPage';
import OnboardingPage from './components/onboarding/OnboardingPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ChatPage from './components/chat/ChatPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, loadUserData } = useAppContext();

  const handleAuthSuccess = () => {
    loadUserData();
  };

  if (!isAuthenticated) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans">
      <main>
        <HashRouter>
          <Routes>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chat/:tropeName" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;