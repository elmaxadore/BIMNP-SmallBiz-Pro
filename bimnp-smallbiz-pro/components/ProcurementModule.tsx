
import React, { useState } from 'react';
import { Truck, ShieldAlert, Package, ShoppingCart, Search, Filter, MoreVertical, Plus, CheckCircle2 } from 'lucide-react';
import { BusinessState } from '../types';
import { getProcurementRiskAudit } from '../services/geminiService';

const ProcurementModule: React.FC<{ state: BusinessState }> = ({ state }) => {
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runResilienceAudit = async () => {
    setLoading(true);
    const result = await getProcurementRiskAudit(state.vendors, state.inventory);
    setAuditResult(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement & Sourcing</h1>
          <p className="text-slate-400 mt-1">Acquisition pipelines and supply chain resilience.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={runResilienceAudit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <ShieldAlert size={18} className="text-amber-500" />
            {loading ? 'Auditing Sourcing...' : 'Supply Resilience Audit'}
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500">
            <Plus size={18} />
            Initialize PO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/10">
            <h4 className="text-sm font-bold tracking-wide">Global Vendor Matrix</h4>
            <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
              <Search size={14} className="text-slate-500 mr-2" />
              <input type="text" placeholder="Search suppliers..." className="bg-transparent text-xs border-none focus:ring-0 p-0 w-32" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-4">Vendor Node</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Reliability Index</th>
                  <th className="px-6 py-4">Last Sync</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {state.vendors?.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                          <Truck size={16} />
                        </div>
                        <span className="font-bold text-slate-200">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{vendor.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${vendor.reliability > 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${vendor.reliability * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300">{(vendor.reliability * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 mono">{vendor.lastOrderDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-slate-600 hover:text-white"><MoreVertical size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Acquisition Summary</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-400">Active POs</span>
                 <span className="text-sm font-bold text-slate-200">14</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-400">Pending Receipt</span>
                 <span className="text-sm font-bold text-indigo-400">8 Nodes</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-400">Lead Time Avg.</span>
                 <span className="text-sm font-bold text-slate-200">4.2 Days</span>
               </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
            <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert size={14} /> Intelligence Directive
            </h4>
            {auditResult ? (
              <p className="text-xs text-slate-300 italic">"{auditResult}"</p>
            ) : (
              <p className="text-xs text-slate-500">Run a Resilience Audit to identify supply chain threats.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementModule;
