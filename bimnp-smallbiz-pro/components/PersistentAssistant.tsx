
import React, { useState, useRef, useEffect } from 'react';
import { Cpu, X, Send, Sparkles, MessageSquare, Zap, ShieldAlert } from 'lucide-react';
import { getGlobalBrainResponse } from '../services/geminiService';
import { ModuleId } from '../types';

interface PersistentAssistantProps {
  activeModule: ModuleId;
  location: any;
}

const PersistentAssistant: React.FC<PersistentAssistantProps> = ({ activeModule, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'brain', text: string}[]>([
    { role: 'brain', text: "Hey! I'm your Shop Assistant. I'm keeping an eye on your cashflow and stock levels. How can I help you save or earn more today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    const contextPrompt = `You are a friendly and practical Small Business Shop Assistant. The user is managing 1-5 local branches. Focus on cashflow, profit, and stock management. Current module: ${activeModule}. User says: ${userMsg}`;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getGlobalBrainResponse(contextPrompt, 'standard', location);
      setMessages(prev => [...prev, { role: 'brain', text: response.text || "I'm having trouble connecting to the business brain. Let me try again." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'brain', text: "Something went wrong with my connection. Check your internet!" }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 h-[450px] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in">
          <div className="p-4 bg-emerald-600 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg text-white"><Cpu size={14} /></div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Shop Assistant</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] text-slate-500 font-bold animate-pulse">Assistant is thinking...</div>}
          </div>

          <div className="p-3 bg-slate-800/50 border-t border-slate-700/50">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-1 flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for business advice..." 
                className="bg-transparent border-none focus:ring-0 flex-1 px-3 text-xs text-slate-200"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 disabled:opacity-50"
              ><Send size={14} /></button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
          isOpen ? 'bg-slate-800 rotate-90 border border-slate-700' : 'bg-emerald-600 shadow-emerald-500/20'
        }`}
      >
        {isOpen ? <X size={20} /> : <Cpu size={24} />}
      </button>
    </div>
  );
};

export default PersistentAssistant;
