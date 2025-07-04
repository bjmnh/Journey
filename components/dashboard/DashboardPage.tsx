import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import UserProfileCard from './UserProfileCard';
import TropeCard from './TropeCard';
import { LogOut } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { tropes, characterSheet, setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to onboarding if no data is present
    if (tropes.length === 0 || !characterSheet.context) {
      navigate('/');
    }
  }, [tropes, characterSheet, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text font-serif">Your Narrative Dashboard</h1>
          <p className="text-brand-subtle mt-1">Here are the archetypes we've identified in your story.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 text-brand-subtle hover:text-brand-text transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1">
          <UserProfileCard />
        </aside>
        <main className="lg:col-span-2">
          <div className="space-y-6">
            {tropes.map((trope, index) => (
              <TropeCard key={trope.id || index} trope={trope} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;