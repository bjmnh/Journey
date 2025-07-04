// The core user profile data collected during onboarding
export interface CharacterSheet {
  id?: string;
  user_id?: string;
  context: string;
  academics: string;
  familialNotes: string;
  socialNotes: string;
  passionNotes: string;
  created_at?: string;
  updated_at?: string;
}

// A single identified trope returned by the AI
export interface Trope {
  id?: string;
  character_sheet_id?: string;
  name: string;
  description: string;
  created_at?: string;
}

// A single message in a chat conversation
export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  choices?: string[]; // Optional choices provided by the AI for the user to select
}

// User profile from Supabase
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Symbol mapping for different categories
export interface SymbolMapping {
  [key: string]: string;
}