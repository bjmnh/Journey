import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { CharacterSheet, Trope, UserProfile } from '../types';
import { ONBOARDING_STEPS } from '../constants';
import { supabase } from '../lib/supabase';
import { getUserProfile, createUserProfile, getCharacterSheet, getTropes } from '../services/supabaseService';

interface AppContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  characterSheet: CharacterSheet;
  setCharacterSheet: React.Dispatch<React.SetStateAction<CharacterSheet>>;
  tropes: Trope[];
  setTropes: React.Dispatch<React.SetStateAction<Trope[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeTrope: string | null;
  setActiveTrope: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loadUserData: () => Promise<void>;
}

const initialCharacterSheet = ONBOARDING_STEPS.reduce((acc, step) => {
    acc[step.key as keyof CharacterSheet] = '';
    return acc;
}, {} as CharacterSheet);

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet>(initialCharacterSheet);
  const [tropes, setTropes] = useState<Trope[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTrope, setActiveTrope] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const loadUserData = async () => {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setUser(profile);
        
        const sheet = await getCharacterSheet();
        if (sheet) {
          setCharacterSheet(sheet);
          const userTropes = await getTropes(sheet.id!);
          setTropes(userTropes);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        loadUserData();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        
        // Create user profile if it doesn't exist
        let profile = await getUserProfile();
        if (!profile) {
          profile = await createUserProfile(session.user.email!);
        }
        
        if (profile) {
          setUser(profile);
          await loadUserData();
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setCharacterSheet(initialCharacterSheet);
        setTropes([]);
        setActiveTrope(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      characterSheet, 
      setCharacterSheet, 
      tropes, 
      setTropes, 
      isLoading, 
      setIsLoading, 
      activeTrope, 
      setActiveTrope,
      isAuthenticated,
      setIsAuthenticated,
      loadUserData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};