
import React from 'react';
import { TrendingUp, Plus, Star, MapPin, ChevronRight, Target } from 'lucide-react';
import { BusinessState } from '../types';

const CRMModule: React.FC<{ state: BusinessState }> = ({ state }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Growth & CRM</h1>
          <p className="text-slate-400 mt-1">Strategic pipeline valuation and lead prioritization.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500">
          <Plus size={18} />
          Inbound Prospect Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Gross Pipeline Value</h4>
          <h3 className="text-2xl font-bold">$4.2M</h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <TrendingUp size={14} />
            <span>+8% from previous cycle</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Win Probability</h4>
          <h3 className="text-2xl font-bold">64.2%</h3>
          <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[64%]"></div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">High Intensity Leads</h4>
          <h3 className="text-2xl font-bold">12 Active</h3>
          <div className="mt-4 flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                <img src={`https://picsum.photos/seed/${i}/100/100`} alt="Avatar" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h4 className="text-sm font-bold tracking-wide">Strategic Lead Scoreboard</h4>
        </div>
        <div className="divide-y divide-slate-800">
          {state.leads.map(lead => (
            <div key={lead.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 border border-slate-700">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{lead.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-500"/> Lead Score: {lead.score}</span>
                    <span className="flex items-center gap-1 capitalize"><Target size={12}/> Status: {lead.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 md:px-12">
                 <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                   <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter mb-1">Gemini Recommendation</p>
                   <p className="text-xs text-slate-300">"Execute high-level technical demo. Probability of conversion is peaking this week."</p>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-200">${lead.value.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Contract Potential</p>
                </div>
                <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRMModule;
