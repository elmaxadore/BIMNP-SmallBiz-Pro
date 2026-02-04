
import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, Download, Search } from 'lucide-react';
import { BusinessState } from '../types';

const FinanceModule: React.FC<{ state: BusinessState }> = ({ state }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Intelligence</h1>
          <p className="text-slate-400 mt-1">Profitability context powered by AI CFO.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white"><Download size={20}/></button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500">
            Connect External Ledger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 bg-indigo-600">
              <div className="flex justify-between items-start text-white/80">
                <CreditCard size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Vault Balance</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-4">$1,245,090</h3>
              <p className="text-indigo-200 text-xs mt-1">Available Liquidity</p>
            </div>
            <div className="p-4 bg-slate-900 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Monthly Burn</span>
                <span className="text-rose-400 font-bold">-$45,000</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Next Forecast</span>
                <span className="text-emerald-400 font-bold">+$120k</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">AI CFO Insight</h4>
            <p className="text-sm text-slate-300 italic">"Current revenue velocity suggests a 14% increase in Q3 if infrastructure costs remain stable. Recommend aggressive expansion in Lead Gen."</p>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold tracking-wide">General Ledger (Cryptographic-Style)</h4>
            <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-slate-500 mr-2" />
              <input type="text" placeholder="Search entries..." className="bg-transparent text-xs border-none focus:ring-0 p-0 w-32" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Descriptor</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {state.ledger.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 mono text-xs text-slate-400">{tx.id}</td>
                    <td className="px-6 py-4 text-slate-300">{tx.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold text-slate-500">{tx.category}</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? <ArrowUpRight size={14} className="inline mr-1" /> : <ArrowDownLeft size={14} className="inline mr-1" />}
                      ${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-800/20 text-center">
            <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Load More Historical Nodes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;
