
import React from 'react';
import { Users, UserPlus, CheckCircle2, Circle, Briefcase, MapPin, Search } from 'lucide-react';
import { BusinessState } from '../types';

const HRMModule: React.FC<{ state: BusinessState }> = ({ state }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel & Organization</h1>
          <p className="text-slate-400 mt-1">Entity profile management and onboarding logistics.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500">
          <UserPlus size={18} />
          Trigger Onboarding Flow
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Active Onboarding Pipeline</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {state.onboardingSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {step.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter text-center ${step.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
              {idx < state.onboardingSteps.length - 1 && (
                <div className="hidden md:block flex-1 h-[2px] bg-slate-800 mt-[-1.5rem]"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
           <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold tracking-wide">Identity Matrix (Employee Registry)</h4>
            <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-slate-500 mr-2" />
              <input type="text" placeholder="Find entity..." className="bg-transparent text-xs border-none focus:ring-0 p-0 w-32" />
            </div>
          </div>
          <div className="divide-y divide-slate-800">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i + 20}/100/100`} alt="User" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-200">Entity Node_{100 + i}</h5>
                    <p className="text-[10px] text-slate-500 font-mono">ID: 0x45a...{i}f2</p>
                  </div>
                </div>
                <div className="hidden md:flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Briefcase size={12}/> Engineering
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <MapPin size={12}/> Remote
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800">
            <h4 className="text-sm font-bold tracking-wide">Departmental Segments</h4>
          </div>
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Engineering</span>
                <span>42 Nodes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Growth/CRM</span>
                <span>28 Nodes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[45%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Operations</span>
                <span>54 Nodes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[85%]"></div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
               <h5 className="text-xs font-bold text-rose-400 flex items-center gap-2 mb-2">
                 <Briefcase size={14}/> Workforce Bottleneck
               </h5>
               <p className="text-xs text-slate-300">Operations is currently under-staffed for the current task volume. Expansion recommended.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMModule;
