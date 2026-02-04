
import React, { useState } from 'react';
// Added Cpu to the imports to fix the "Cannot find name 'Cpu'" error.
import { Globe, Users, Zap, ShieldCheck, MessageSquare, ArrowUpRight, BarChart3, Sparkles, Network, Briefcase, Cpu } from 'lucide-react';
import { BusinessState } from '../types';
import { getNetworkSynergyAnalysis } from '../services/geminiService';

const GlobalNetworkModule: React.FC<{ state: BusinessState, location: any }> = ({ state, location }) => {
  const [synergyReport, setSynergyReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'network' | 'support'>('network');

  const runSynergyAnalysis = async () => {
    setLoading(true);
    const result = await getNetworkSynergyAnalysis(state.partners, state);
    setSynergyReport(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Trade Network</h1>
          <p className="text-slate-400 mt-1">Cross-entity collaboration nodes and shared intelligence.</p>
        </div>
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl">
          <button 
            onClick={() => setActiveTab('network')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'network' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Network Matrix
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'support' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Global Support
          </button>
        </div>
      </div>

      {activeTab === 'network' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          {/* Main Network Graph / List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.partners?.map(partner => (
                <div key={partner.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-600/20 group-hover:scale-110 transition-transform">
                      <Network size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                         <ShieldCheck size={10} /> {partner.trustScore}% Trust
                       </span>
                       <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{partner.location}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-slate-200">{partner.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{partner.industry} Sector</p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Trades</p>
                      <p className="text-sm font-bold text-slate-200">{partner.activeTrades} Nodes</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Synergy Level</p>
                      <p className="text-sm font-bold text-indigo-400">{partner.synergyLevel}%</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 gap-3 group cursor-pointer hover:bg-slate-900 transition-all">
                <div className="p-3 bg-slate-800 rounded-full text-slate-600 group-hover:text-indigo-400 transition-all">
                   <Globe size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-400 group-hover:text-slate-200">Expand Network</p>
                  <p className="text-[10px] text-slate-600 mt-1">Discover compatible organizational nodes</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Cross-Entity Shared Intelligence</h3>
                 <BarChart3 size={18} className="text-slate-600" />
               </div>
               <div className="space-y-4">
                 {[
                   { label: 'Market Anomaly Detection', status: 'Optimal', val: 92 },
                   { label: 'Network Supply Resilience', status: 'High', val: 84 },
                   { label: 'Collaborative Lead Flow', status: 'Active', val: 76 }
                 ].map(intel => (
                   <div key={intel.label} className="space-y-2">
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{intel.label}</span>
                        <span className="text-indigo-400 font-bold">{intel.status} ({intel.val}%)</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600" style={{ width: `${intel.val}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* AI Synergy Analysis Panel */}
          <div className="flex flex-col gap-6">
            <div className="bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12">
                <Sparkles size={100} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Zap size={20} fill="currentColor" /> Network Synergy Audit
              </h3>
              <p className="text-indigo-100/70 text-sm mb-6">Analyze cross-business vectors to uncover hidden trade opportunities.</p>
              <button 
                onClick={runSynergyAnalysis}
                disabled={loading}
                className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing Synergies...' : 'Run Analysis'}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-800 bg-slate-800/30">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Intelligence Report</h4>
               </div>
               <div className="p-6 overflow-y-auto flex-1">
                 {synergyReport ? (
                   <div className="prose prose-invert prose-sm">
                      <p className="text-slate-300 italic leading-relaxed">"{synergyReport}"</p>
                      <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded"><ArrowUpRight size={14} /></div>
                          <span className="text-[10px] font-bold text-slate-300">Suggested Action: Shared Inventory Pool</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded"><MessageSquare size={14} /></div>
                          <span className="text-[10px] font-bold text-slate-300">Proposed: Cross-Entity Marketing Node</span>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                     <Network size={40} className="mb-4 text-slate-700" />
                     <p className="text-xs text-slate-500">Run a synergy audit to see collaborative intelligence from the network.</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6">
          <div className="w-80 space-y-4">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Node Connectivity Status</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Global Trade API', status: 'Online', color: 'bg-emerald-500' },
                    { label: 'Support Neural Link', status: 'Active', color: 'bg-emerald-500' },
                    { label: 'Dispute Resolution Hub', status: 'Standby', color: 'bg-blue-500' },
                    { label: 'Escrow Verification', status: 'Active', color: 'bg-emerald-500' }
                  ].map(status => (
                    <div key={status.label} className="flex items-center justify-between text-xs">
                       <span className="text-slate-400">{status.label}</span>
                       <div className="flex items-center gap-2 font-bold text-slate-200">
                         <span className={`w-1.5 h-1.5 rounded-full ${status.color}`}></span>
                         {status.status}
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-2xl p-5">
               <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2 mb-3"><Users size={14}/> Support Consensus</h4>
               <p className="text-[10px] text-slate-400 leading-relaxed">The Global Support Node handles cross-entity logistics friction. All support tickets are analyzed by Gemini to identify systemic network improvements.</p>
             </div>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><MessageSquare size={18}/></div>
                  <h4 className="font-bold text-slate-200">Global Support Interface</h4>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">24/7 AI Node Support Active</span>
             </div>

             <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-start">
                   <div className="max-w-[80%] bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex items-center gap-2 mb-2 text-indigo-400">
                        <Cpu size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">BIMNP Global Support Agent</span>
                      </div>
                      <p className="text-sm text-slate-200">Welcome to the Global Network Support terminal. I am currently monitoring all 1,240 organizational nodes. How can I assist with your cross-entity logistics or network integration today?</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                   <button className="text-left p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                      <p className="text-xs font-bold text-slate-200">Logistics Friction</p>
                      <p className="text-[10px] text-slate-500 mt-1">Resolve delays between partner distribution hubs.</p>
                   </button>
                   <button className="text-left p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                      <p className="text-xs font-bold text-slate-200">Trade Verification</p>
                      <p className="text-[10px] text-slate-500 mt-1">Audit an existing cross-business transaction ledger.</p>
                   </button>
                   <button className="text-left p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                      <p className="text-xs font-bold text-slate-200">Security Discrepancy</p>
                      <p className="text-[10px] text-slate-500 mt-1">Report or investigate unauthorized network access.</p>
                   </button>
                   <button className="text-left p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                      <p className="text-xs font-bold text-slate-200">Protocol Update</p>
                      <p className="text-[10px] text-slate-500 mt-1">Request new connectivity schemas for external partners.</p>
                   </button>
                </div>
             </div>

             <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-1.5 flex items-center shadow-inner">
                  <input 
                    type="text" 
                    placeholder="Describe the network issue or cross-entity request..." 
                    className="bg-transparent border-none focus:ring-0 flex-1 px-3 text-sm text-slate-200 placeholder-slate-600"
                  />
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-500 transition-all">Initiate Support Directive</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalNetworkModule;
