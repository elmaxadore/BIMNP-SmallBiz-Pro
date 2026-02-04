
import React from 'react';
import { MessageSquare, Paperclip, Smile, Send, Cpu, Hash, User } from 'lucide-react';

const MessagingModule: React.FC = () => {
  return (
    <div className="h-full flex gap-6 animate-in fade-in duration-500">
      {/* Channels Sidebar */}
      <div className="w-64 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-800">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Communications Channels</h4>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {['general', 'engineering', 'ops-war-room', 'strategic-growth', 'compliance-alerts'].map(chan => (
               <button key={chan} className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all ${chan === 'general' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                 <Hash size={14} /> {chan}
               </button>
             ))}
           </div>
           <div className="p-4 border-t border-slate-800">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Direct Tunnels</h4>
             <div className="space-y-1">
                {[1,2,3].map(i => (
                  <button key={i} className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
                    <User size={14} /> Agent_00{i}
                  </button>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><Hash size={18}/></div>
             <div>
               <h4 className="text-sm font-bold text-slate-200">#general</h4>
               <p className="text-[10px] text-slate-500">Executive directives and organizational sync.</p>
             </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-lg text-[10px] font-bold hover:bg-indigo-600/20 transition-all">
            <Cpu size={14} /> Summarize Intelligence
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
           <div className="flex gap-4">
             <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 flex-shrink-0"></div>
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-bold text-indigo-400">Chief Executive</span>
                 <span className="text-[10px] text-slate-600 mono">10:42 AM</span>
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                 The Q3 audit report looks promising. Let's ensure the Ops team has all necessary SKU allocations finalized by Friday.
               </p>
               <div className="flex gap-2 mt-2">
                 <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white cursor-pointer transition-all">👍 4</span>
                 <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white cursor-pointer transition-all">🚀 2</span>
               </div>
             </div>
           </div>

           <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tactical Intelligence Summary</span>
              </div>
              <p className="text-xs text-slate-400 italic">
                A consensus has been reached on Q3 objectives. Key action item: Verify SKU allocations for Operations. Sentiment: Focused and Productive.
              </p>
           </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-1 flex items-center shadow-inner">
            <button className="p-2.5 text-slate-500 hover:text-slate-300"><Paperclip size={20}/></button>
            <input 
              type="text" 
              placeholder="Send message to tunnel..." 
              className="bg-transparent border-none focus:ring-0 flex-1 px-3 text-sm text-slate-200"
            />
            <button className="p-2.5 text-slate-500 hover:text-slate-300"><Smile size={20}/></button>
            <button className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all">
              <Send size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-2 px-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase mr-2 mt-1">Smart Replies:</span>
            <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] rounded border border-slate-700 transition-all">Understood, confirming allocations.</button>
            <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] rounded border border-slate-700 transition-all">On it.</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModule;
