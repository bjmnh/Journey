
import React from 'react';
import type { ChatMessage } from '../../types';
import ChoiceButtons from './ChoiceButtons';

interface MessageBubbleProps {
  message: ChatMessage;
  onChoiceSelect: (choice: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onChoiceSelect }) => {
  const isUser = message.role === 'user';
  
  // Basic markdown to HTML conversion for bold text
  const formatContent = (content: string) => {
      return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow ${
          isUser
            ? 'bg-brand-primary text-white rounded-br-lg'
            : 'bg-white text-brand-text rounded-bl-lg'
        }`}
      >
        <p className="text-base" dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}></p>
      </div>
      {message.choices && message.choices.length > 0 && (
        <ChoiceButtons choices={message.choices} onSelect={onChoiceSelect} />
      )}
    </div>
  );
};

export default MessageBubble;
