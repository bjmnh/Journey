
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import type { ChatMessage } from '../../types';
import { getChatResponse } from '../../services/geminiService';
import MessageBubble from './MessageBubble';
import ChatInputForm from './ChatInputForm';
import { ArrowLeft } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { tropeName } = useParams<{ tropeName: string }>();
  const navigate = useNavigate();
  const { characterSheet, activeTrope, isLoading, setIsLoading } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const decodedTropeName = tropeName ? decodeURIComponent(tropeName) : 'this topic';

  useEffect(() => {
    if (!activeTrope) {
      navigate('/dashboard');
      return;
    }
    // Initial message from AI
    setMessages([
      {
        role: 'ai',
        content: `Let's talk about the trope: **${decodedTropeName}**. What's on your mind about it? Or, where should we start?`,
      },
    ]);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const aiResponse = await getChatResponse(characterSheet, newMessages);
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiResponse.question,
        choices: aiResponse.choices,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get chat response:", error);
      const errorMessage: ChatMessage = {
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-2xl">
      <header className="flex items-center p-4 border-b border-slate-200 bg-amber-50">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-slate-200 mr-4">
          <ArrowLeft className="w-5 h-5 text-brand-subtle" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-brand-text font-serif">{decodedTropeName}</h1>
          <p className="text-sm text-brand-subtle">AI-guided conversation</p>
        </div>
      </header>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-bg">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} onChoiceSelect={handleSendMessage} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2">
                <div className="p-2 bg-slate-200 rounded-full">
                   <div className="w-2 h-2 bg-brand-subtle rounded-full animate-bounce delay-75"></div>
                </div>
                <div className="p-2 bg-slate-200 rounded-full">
                   <div className="w-2 h-2 bg-brand-subtle rounded-full animate-bounce delay-150"></div>
                </div>
                 <div className="p-2 bg-slate-200 rounded-full">
                   <div className="w-2 h-2 bg-brand-subtle rounded-full animate-bounce delay-300"></div>
                </div>
             </div>
          </div>
        )}
      </div>
      <ChatInputForm onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatPage;
