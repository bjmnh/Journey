
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { CharacterSheet, Trope } from '../types';
import { ONBOARDING_STEPS } from '../constants';

interface AppContextType {
  characterSheet: CharacterSheet;
  setCharacterSheet: React.Dispatch<React.SetStateAction<CharacterSheet>>;
  tropes: Trope[];
  setTropes: React.Dispatch<React.SetStateAction<Trope[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeTrope: string | null;
  setActiveTrope: React.Dispatch<React.SetStateAction<string | null>>;
}

const initialCharacterSheet = ONBOARDING_STEPS.reduce((acc, step) => {
    acc[step.key as keyof CharacterSheet] = '';
    return acc;
}, {} as CharacterSheet);

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet>(initialCharacterSheet);
  const [tropes, setTropes] = useState<Trope[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTrope, setActiveTrope] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ characterSheet, setCharacterSheet, tropes, setTropes, isLoading, setIsLoading, activeTrope, setActiveTrope }}>
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
