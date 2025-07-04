
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Trope } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { MessageSquarePlus } from 'lucide-react';

interface TropeCardProps {
  trope: Trope;
}

const TropeCard: React.FC<TropeCardProps> = ({ trope }) => {
  const navigate = useNavigate();
  const { setActiveTrope } = useAppContext();

  const handleDiscuss = () => {
    setActiveTrope(trope.name);
    navigate(`/chat/${encodeURIComponent(trope.name)}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] duration-300">
      <h3 className="text-xl font-bold text-brand-primary mb-2 font-serif">{trope.name}</h3>
      <p className="text-brand-subtle mb-4">{trope.description}</p>
      <button
        onClick={handleDiscuss}
        className="inline-flex items-center px-4 py-2 font-semibold text-sm text-brand-primary bg-red-50 rounded-full hover:bg-red-100 transition"
      >
        <MessageSquarePlus className="w-4 h-4 mr-2" />
        Discuss this Trope
      </button>
    </div>
  );
};

export default TropeCard;
