
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { FileText } from 'lucide-react';

const UserProfileCard: React.FC = () => {
  const { characterSheet } = useAppContext();

  // Create a summary from the first few words of each section
  const summary = Object.values(characterSheet)
    .map(value => value.split(' ').slice(0, 5).join(' '))
    .join('... ') + '...';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-8">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-amber-100 rounded-full mr-4">
          <FileText className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand-text font-serif">Your Character Sheet</h2>
          <p className="text-sm text-brand-subtle">A summary of your story</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-brand-text font-serif">Life Situation</h3>
          <p className="text-brand-subtle text-sm">{characterSheet.context || "No context provided."}</p>
        </div>
         <div>
          <h3 className="font-semibold text-brand-text font-serif">Passions</h3>
          <p className="text-brand-subtle text-sm">{characterSheet.passionNotes || "No passions noted."}</p>
        </div>
         <div>
          <h3 className="font-semibold text-brand-text font-serif">Social Life</h3>
          <p className="text-brand-subtle text-sm">{characterSheet.socialNotes || "No social notes provided."}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
