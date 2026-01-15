
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { getDieticianResponse } from '../services/geminiService';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface DieticianProps {
  profile: UserProfile;
}

const Dietician: React.FC<DieticianProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const response = await getDieticianResponse(userMsg, history, profile);
      setMessages(prev => [...prev, { role: 'model', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-6 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-inner">
            <span className="text-xl font-black">AI</span>
          </div>
          <div>
            <h2 className="font-bold text-slate-800">NutriScan Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-xs text-slate-400 font-medium">Virtual Dietician Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4 opacity-60">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
               <PaperAirplaneIcon className="w-8 h-8 text-slate-400 -rotate-45" />
            </div>
            <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
              Ask me about portion sizes, recipes, or health tips!
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${
              m.role === 'user' 
                ? 'bg-emerald-500 text-white rounded-br-none' 
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your dietician anything..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-emerald-500 text-white rounded-full shadow-md active:scale-90 disabled:opacity-50 transition-all"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dietician;
