
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Sparkles, Send, Target, ChevronRight, Activity } from 'lucide-react';
import { BusinessState } from '../types';
import { getMarketingInsights } from '../services/geminiService';

const MarketingModule: React.FC<{ state: BusinessState }> = ({ state }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runResonanceAnalysis = async () => {
    setLoading(true);
    const result = await getMarketingInsights(state.campaigns);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Intelligence</h1>
          <p className="text-slate-400 mt-1">Growth vectors and audience resonance analytics.</p>
        </div>
        <button 
          onClick={runResonanceAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          <Sparkles size={18} />
          {loading ? 'Analyzing Vector...' : 'AI Resonance Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><TrendingUp size={24} /></div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Excellent</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Avg. ROAS</p>
          <h3 className="text-2xl font-bold mt-1">4.8x</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Target size={24} /></div>
          </div>
          <p className="text-slate-400 text-sm font-medium">Cost Per Acquisition</p>
          <h3 className="text-2xl font-bold mt-1">$42.50</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Activity size={24} /></div>
          </div>
          <p className="text-slate-400 text-sm font-medium">Conversion Velocity</p>
          <h3 className="text-2xl font-bold mt-1">12.2%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-slate-800/20">
            <h4 className="text-sm font-bold tracking-wide">Growth Campaign Matrix</h4>
          </div>
          <div className="divide-y divide-slate-800">
            {state.campaigns?.map(camp => (
              <div key={camp.id} className="p-5 flex items-center justify-between hover:bg-slate-800/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400">
                    <Target size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-200">{camp.name}</h5>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
                      <span>{camp.channel}</span>
                      <span>•</span>
                      <span className={camp.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}>{camp.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-200">${camp.spend.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">Current Load</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">AI Strategy Context</h4>
          {insight ? (
            <div className="prose prose-invert prose-sm">
               <p className="text-slate-300 italic text-sm">"{insight}"</p>
               <button className="mt-4 w-full py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-600/30 rounded-lg text-xs font-bold">Deploy Suggested Scaling</button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="p-4 bg-slate-800 rounded-full text-slate-600">
                <BarChart3 size={32} />
              </div>
              <p className="text-xs text-slate-500">Run an AI Resonance Audit to generate strategic marketing directives.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingModule;
