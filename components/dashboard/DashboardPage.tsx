
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import UserProfileCard from './UserProfileCard';
import TropeCard from './TropeCard';

const DashboardPage: React.FC = () => {
  const { tropes, characterSheet } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to onboarding if no data is present
    if (tropes.length === 0 || !characterSheet.context) {
      navigate('/');
    }
  }, [tropes, characterSheet, navigate]);
  
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text font-serif">Your Narrative Dashboard</h1>
        <p className="text-brand-subtle mt-1">Here are the archetypes we've identified in your story.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1">
          <UserProfileCard />
        </aside>
        <main className="lg:col-span-2">
          <div className="space-y-6">
            {tropes.map((trope, index) => (
              <TropeCard key={index} trope={trope} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
