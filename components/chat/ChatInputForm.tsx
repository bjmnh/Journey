
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 p-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-brand-primary focus:outline-none transition resize-none"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="p-3 bg-brand-primary text-white rounded-full hover:bg-opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInputForm;
