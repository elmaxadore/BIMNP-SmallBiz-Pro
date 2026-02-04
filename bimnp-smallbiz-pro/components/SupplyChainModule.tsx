
import React from 'react';
import { Warehouse, ShoppingCart, BarChart3, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { BusinessState } from '../types';

const SupplyChainModule: React.FC<{ state: BusinessState }> = ({ state }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supply Chain & POS</h1>
          <p className="text-slate-400 mt-1">Warehouse intelligence and real-time SKU intensity.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg font-semibold hover:border-slate-700 transition-all">
            <ShoppingCart size={18} />
            Open POS Terminal
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-all">
            <RefreshCw size={18} />
            Forensic Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {state.inventory.map(sku => (
          <div key={sku.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-400"><Layers size={20} /></div>
              {sku.quantity < sku.threshold && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500 animate-pulse">
                  <AlertCircle size={12} /> CRITICAL STOCK
                </div>
              )}
            </div>
            <h4 className="font-bold text-slate-200">{sku.name}</h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Quantity</span>
                <span className="text-slate-200 font-bold">{sku.quantity}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${sku.quantity < sku.threshold ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min((sku.quantity / sku.threshold) * 50, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mono pt-1">
                <span>Min: {sku.threshold}</span>
                <span>Max Capacity: 500</span>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-slate-900 transition-all">
          <div className="p-2 bg-slate-800 rounded-full text-slate-500 group-hover:text-slate-300 transition-all"><Warehouse size={20} /></div>
          <p className="text-xs font-bold text-slate-500 group-hover:text-slate-300">Register New SKU</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-sm font-bold tracking-wide mb-6 flex items-center gap-2">
             <BarChart3 size={18} className="text-indigo-400"/> Stock Intensity Index
          </h4>
          <div className="space-y-4">
            {['Warehouse Alpha', 'Warehouse Beta', 'Distribution Hub'].map((hub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>{hub}</span>
                  <span>{90 - (i * 15)}% Load</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded flex overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${60 - i * 10}%` }}></div>
                  <div className="bg-emerald-500 h-full" style={{ width: `${20}%` }}></div>
                  <div className="bg-amber-500 h-full" style={{ width: `${10}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Warehouse size={120} />
          </div>
          <h4 className="text-sm font-bold tracking-wide mb-4 text-indigo-400">Forensic Stock Insight</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            "Anomalies detected in SKU-104 inventory logs between 04:00 - 06:00 UTC. Discrepancy of 12 units identified. Cross-referencing with POS terminal logs suggests an unrecorded adjustment or logistical slippage."
          </p>
          <div className="mt-6">
             <button className="text-xs font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg">Authorize Full Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainModule;
