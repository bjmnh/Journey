// Symbol mappings for different life aspects and tropes
export const LIFE_SYMBOLS = {
  // Academic/Work symbols
  'high school student': '📚',
  'college student': '🎓',
  'working full-time': '💼',
  'working part-time': '⏰',
  'looking for a job': '🔍',
  'taking a gap year': '🌍',
  
  // Academic strengths
  'humanities and arts': '🎨',
  'STEM subjects': '🔬',
  'social situations': '🤝',
  'practical tasks': '🔧',
  
  // Challenges
  'procrastination': '⏳',
  'difficult coursework': '📖',
  'test anxiety': '😰',
  'lack of motivation': '💭',
  'time management': '⏰',
  
  // Family roles
  'responsible oldest': '👑',
  'free-spirited youngest': '🦋',
  'independent only': '🌟',
  'peacemaker': '☮️',
  
  // Social types
  'large diverse group': '👥',
  'few close friends': '💎',
  'online friends': '💻',
  'looking for people': '🔍',
  
  // Personality traits
  'outgoing extrovert': '🌞',
  'thoughtful introvert': '🌙',
  'planner organizer': '📋',
  'quiet observer': '👁️',
  'life of party': '🎉',
  
  // Passions
  'creative pursuits': '🎨',
  'music': '🎵',
  'sports fitness': '⚽',
  'video games': '🎮',
  'learning': '📚',
  'helping others': '❤️',
  
  // Dreams
  'traveling exploring': '✈️',
  'own project business': '🚀',
  'mastering skill': '🏆',
  'community difference': '🌍',
  'time to relax': '🧘'
};

export const SYNCHRONICITY_SYMBOL = '☯️';

export const getSymbolForText = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  for (const [key, symbol] of Object.entries(LIFE_SYMBOLS)) {
    if (lowerText.includes(key.toLowerCase())) {
      return symbol;
    }
  }
  
  return '✨'; // Default symbol
};