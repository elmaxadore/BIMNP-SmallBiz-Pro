
import React, { useState, useRef, useEffect } from 'react';
// Added Users to imports
import { Send, Cpu, Globe, Map as MapIcon, Image as ImageIcon, Sparkles, Users } from 'lucide-react';
import { getGlobalBrainResponse } from '../services/geminiService';

const GlobalBrainModule: React.FC<{ location: any }> = ({ location }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'brain', text: string, grounding?: any[]}[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'standard' | 'search' | 'maps'>('standard');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getGlobalBrainResponse(userMsg, mode, location);
      setMessages(prev => [...prev, { 
        role: 'brain', 
        text: response.text || "System could not generate a response.",
        grounding: response.grounding
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'brain', text: "Critical System Error: Connection to Intelligence Engine severed." }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Cpu className="text-indigo-500" /> Gemini Business Brain
          </h1>
          <p className="text-slate-400 mt-1">Cross-module context and multimodal organizational intelligence.</p>
        </div>
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl">
          <button 
            onClick={() => setMode('standard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Sparkles size={14} /> Intelligence
          </button>
          <button 
            onClick={() => setMode('search')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Globe size={14} /> Search
          </button>
          <button 
            onClick={() => setMode('maps')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'maps' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MapIcon size={14} /> Maps
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500 mb-6">
                <Cpu size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-200">System Ready</h3>
              <p className="text-slate-400 mt-2">I have access to your financials, lead pipeline, and operational status. What would you like to analyze?</p>
              <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                <button onClick={() => setInput("Audit our current Q3 growth potential.")} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-all">"Audit Q3 growth potential"</button>
                <button onClick={() => setInput("Who are our highest risk clients right now?")} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-all">"Identify high-risk clients"</button>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10 rounded-tr-none' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {/* Fixed missing Users icon */}
                  {msg.role === 'brain' ? <Cpu size={14} className="text-indigo-400" /> : <Users size={14} />}
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{msg.role === 'user' ? 'Executive' : 'Business Brain'}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.grounding && msg.grounding.length > 0 && (
                   <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-widest">Grounding Resources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.grounding.map((chunk, idx) => {
                          const uri = chunk.web?.uri || chunk.maps?.uri;
                          const title = chunk.web?.title || chunk.maps?.title || 'Source';
                          return uri ? (
                            <a key={idx} href={uri} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400 hover:text-white transition-all underline decoration-indigo-500 underline-offset-2">
                              {title}
                            </a>
                          ) : null;
                        })}
                      </div>
                   </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest">GEMINI PROCESSING...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 flex items-center ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
            <button className="p-2.5 text-slate-500 hover:text-slate-300"><ImageIcon size={20}/></button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'standard' ? 'Type command...' : `Query via ${mode.toUpperCase()}...`}
              className="bg-transparent border-none focus:ring-0 flex-1 px-3 text-sm text-slate-200"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalBrainModule;
