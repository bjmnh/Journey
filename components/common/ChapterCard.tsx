
import React, { ReactNode } from 'react';

interface ChapterCardProps {
  title: string;
  prompt: string;
  children: ReactNode;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ title, prompt, children }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl transform transition-all duration-500">
      <h2 className="text-xl sm:text-2xl font-bold text-brand-primary mb-2 font-serif">{title}</h2>
      <p className="text-brand-subtle mb-6">{prompt}</p>
      <div>{children}</div>
    </div>
  );
};

export default ChapterCard;
