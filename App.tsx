
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import OnboardingPage from './components/onboarding/OnboardingPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ChatPage from './components/chat/ChatPage';

function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}

export default App;
