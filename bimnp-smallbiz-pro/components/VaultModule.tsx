
import React from 'react';
import { FileText, Cloud, ShieldAlert, Tag, Search, Filter, MoreVertical, Plus } from 'lucide-react';

const VaultModule: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Vault</h1>
          <p className="text-slate-400 mt-1">Encrypted document storage with AI taxonomy tagging.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white">
             <Cloud size={18} /> Cloud Sync
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500">
             <Plus size={18} /> New Asset
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Vault Connectors</h4>
             <div className="space-y-2">
               {['Google Drive', 'OneDrive', 'Box', 'Dropbox'].map(cloud => (
                 <div key={cloud} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-all">
                   <div className="flex items-center gap-3">
                     <Cloud size={16} className="text-blue-500" />
                     <span className="text-xs font-medium text-slate-300">{cloud}</span>
                   </div>
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 </div>
               ))}
             </div>
          </div>
          <div className="bg-indigo-600/10 border border-indigo-600/20 p-4 rounded-2xl">
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldAlert size={14} /> AI Document Audit
            </h4>
            <p className="text-xs text-slate-400">Scan assets for risk levels, automated summaries, and tax labels.</p>
          </div>
        </div>

        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
           <div className="p-4 border-b border-slate-800 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:bg-slate-800 rounded"><Filter size={18}/></button>
                <div className="h-4 w-[1px] bg-slate-800"></div>
                <div className="flex items-center bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                   <Search size={14} className="text-slate-500 mr-2"/>
                   <input type="text" placeholder="Search the ledger..." className="bg-transparent border-none focus:ring-0 text-xs p-0 w-48" />
                </div>
             </div>
             <span className="text-xs text-slate-500 mono">1,240 Assets Indexed</span>
           </div>
           
           <div className="divide-y divide-slate-800">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/20 group">
                 <div className="flex items-center gap-4">
                   <div className="p-2 bg-slate-800 rounded-lg text-slate-500 group-hover:text-indigo-400 transition-all">
                     <FileText size={20} />
                   </div>
                   <div>
                     <h5 className="text-sm font-bold text-slate-300">Financial_Report_Q{i}_2024.pdf</h5>
                     <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-500">2.4 MB</span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-[10px] text-slate-500">Modified 2 days ago</span>
                        <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700">
                           <Tag size={10} /> TAXONOMY_REVENUE
                        </span>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded">AUDITED</span>
                   <button className="p-1.5 text-slate-600 hover:text-white rounded transition-all"><MoreVertical size={16}/></button>
                 </div>
               </div>
             ))}
           </div>
           <div className="p-4 bg-slate-800/30 text-center">
              <button className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-all">Load More Assets</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VaultModule;
