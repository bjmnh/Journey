import { getSymbolForText } from './utils/symbols';

export const ONBOARDING_STEPS = [
  {
    key: 'context',
    title: 'Chapter 1: Setting the Scene',
    placeholder: 'Review your answers and add any other details, e.g., "I\'m trying to balance AP classes with my part-time job..."',
    questions: [
      {
        prompt: 'First, which of these best describes you right now?',
        options: ['A high school student', 'A college student', 'Working full-time', 'Working part-time', 'Looking for a job', 'Taking a gap year'],
        prefix: 'I am '
      },
      {
        prompt: 'And what is your main focus at the moment?',
        options: ['Balancing school and work', 'Improving my grades', 'College applications', 'Focusing on my career', 'Exploring new hobbies'],
        prefix: 'My main focus is '
      }
    ]
  },
  {
    key: 'academics',
    title: 'Chapter 2: The Scholarly Pursuits',
    placeholder: 'Feel free to add more about your academic or work life...',
    questions: [
        {
            prompt: 'In school or at work, where do your strengths lie?',
            options: ['In the humanities and arts', 'In STEM subjects', 'In social situations and networking', 'In practical, hands-on tasks'],
            prefix: 'My strengths lie '
        },
        {
            prompt: 'What is your biggest challenge in this area?',
            options: ['Procrastination', 'Difficult coursework', 'Test anxiety or performance pressure', 'Lack of motivation', 'Time management'],
            prefix: 'My biggest challenge is '
        }
    ]
  },
  {
    key: 'familialNotes',
    title: 'Chapter 3: The Family Dynamic',
    placeholder: 'You can add more about your family here...',
    questions: [
      {
        prompt: 'How would you describe your role in your family?',
        options: ['The responsible oldest child', 'The free-spirited youngest child', 'The independent only child', 'The peacemaker'],
        prefix: 'In my family, I am often seen as '
      },
      {
        prompt: 'What is your family life like?',
        options: ['Generally supportive and close', 'A bit complicated right now', 'Loving but with high expectations', 'Independent; we all do our own thing'],
        prefix: 'My family life is '
      }
    ]
  },
  {
    key: 'socialNotes',
    title: 'Chapter 4: The Social Circle',
    placeholder: 'Add any other thoughts about your friendships or social experiences...',
    questions: [
      {
        prompt: 'How would you describe your group of friends?',
        options: ['A large, diverse group', 'A few very close friends', 'Mostly online friends', 'I\'m currently looking for my people'],
        prefix: 'I have '
      },
      {
        prompt: 'And in social settings, you tend to be...',
        options: ['An outgoing extrovert', 'A thoughtful introvert', 'The planner and organizer', 'The quiet observer', 'The life of the party'],
        prefix: 'I tend to be '
      }
    ]
  },
  {
    key: 'passionNotes',
    title: 'Chapter 5: The Inner Fire',
    placeholder: 'Is there anything else you\'re passionate about? Write it here...',
    questions: [
      {
        prompt: 'Outside of school or work, what truly excites you?',
        options: ['Creative pursuits like art or writing', 'Music, either playing or listening', 'Competitive sports or fitness', 'Video games and digital worlds', 'Learning new things', 'Helping others'],
        prefix: 'I am passionate about '
      },
      {
        prompt: 'What do you dream of doing more of?',
        options: ['Traveling and exploring', 'Starting my own project or business', 'Mastering a skill', 'Making a difference in my community', 'Just having more time to relax'],
        prefix: 'I dream of '
      }
    ]
  }
];