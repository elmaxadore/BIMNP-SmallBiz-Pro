
import React from 'react';
import { ShieldCheck, Lock, Globe, FileSpreadsheet, Activity, ChevronRight } from 'lucide-react';

const ComplianceModule: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance & Security Audit</h1>
          <p className="text-slate-400 mt-1">Cryptographic session logs and SOC2/GDPR verification.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-lg font-semibold hover:border-slate-700 transition-all">
          <FileSpreadsheet size={18} />
          Export CSV Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><ShieldCheck size={24} /></div>
             <span className="text-[10px] font-bold text-emerald-500">VERIFIED</span>
          </div>
          <h4 className="text-sm font-bold text-slate-200">SOC2 Type II</h4>
          <p className="text-xs text-slate-500 mt-1">System integrity verified via automated proofs.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><Lock size={24} /></div>
             <span className="text-[10px] font-bold text-indigo-500">ENCRYPTED</span>
          </div>
          <h4 className="text-sm font-bold text-slate-200">GDPR Compliance</h4>
          <p className="text-xs text-slate-500 mt-1">Data residency and PII masking active.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Globe size={24} /></div>
             <span className="text-[10px] font-bold text-amber-500">MONITORED</span>
          </div>
          <h4 className="text-sm font-bold text-slate-200">Vector Tracking</h4>
          <p className="text-xs text-slate-500 mt-1">Active monitoring of entry points and device IDs.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold tracking-wide flex items-center gap-2">
              <Activity size={18} className="text-indigo-400"/> Action Ledger (Cryptographic Session Log)
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
               <thead>
                <tr className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-4">Action Token</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Directive</th>
                  <th className="px-6 py-4">Identity</th>
                  <th className="px-6 py-4">Geographic Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[1,2,3,4,5,6].map(i => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 mono text-[10px] text-indigo-400">0xAC_{i}F92...</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">2024-05-18 14:2{i} UTC</td>
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {i % 2 === 0 ? 'Authorized Hire' : 'Modified Ledger Entry'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">ADMIN_SR_V0{i}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-xs text-slate-400">
                         <Globe size={12}/> {37.77 + i / 10}, {-122.41 - i / 10}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-800/30 flex justify-center">
             <button className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-white transition-all">
               Deep Audit History <ChevronRight size={14}/>
             </button>
          </div>
      </div>
    </div>
  );
};

export default ComplianceModule;
