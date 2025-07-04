
// The core user profile data collected during onboarding
export interface CharacterSheet {
  context: string;
  academics: string;
  familialNotes: string;
  socialNotes: string;
  passionNotes: string;
}

// A single identified trope returned by the AI
export interface Trope {
  name: string;
  description:string;
}

// A single message in a chat conversation
export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  choices?: string[]; // Optional choices provided by the AI for the user to select
}
