
import React from 'react';

interface ChoiceButtonsProps {
  choices: string[];
  onSelect: (choice: string) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onSelect(choice)}
          className="px-4 py-2 text-sm font-semibold text-brand-primary bg-white border border-brand-secondary rounded-full hover:bg-red-50 transition-colors duration-200"
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;
