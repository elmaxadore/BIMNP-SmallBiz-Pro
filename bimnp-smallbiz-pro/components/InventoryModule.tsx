
import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, RefreshCw, BarChart3, X } from 'lucide-react';
import { BusinessState, SKU } from '../types';

interface InventoryModuleProps {
  state: BusinessState;
  onAddItem: (item: Omit<SKU, 'id'>) => void;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ state, onAddItem }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    threshold: '',
    branchId: state.branches[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.threshold) return;

    onAddItem({
      name: formData.name,
      quantity: parseInt(formData.quantity),
      threshold: parseInt(formData.threshold),
      branchId: formData.branchId
    });

    setFormData({ name: '', quantity: '', threshold: '', branchId: state.branches[0]?.id || '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Stock & Inventory</h1>
          <p className="text-slate-400 mt-1">Keep track of items across all your active branch locations.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus size={16} /> New Item Entry
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-100">Register New Inventory SKU</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Item Name</label>
              <input 
                type="text" 
                placeholder="e.g. Arabica Roast" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Initial Quantity</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Threshold</label>
              <input 
                type="number" 
                placeholder="Low stock point" 
                value={formData.threshold}
                onChange={(e) => setFormData({...formData, threshold: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500" 
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10 transition-all"
              >
                Create SKU
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.inventory.map(sku => (
          <div key={sku.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform"><Package size={20} /></div>
              {sku.quantity <= sku.threshold && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">
                  LOW STOCK
                </div>
              )}
            </div>
            <h4 className="font-bold text-slate-100">{sku.name}</h4>
            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">
              Branch: {state.branches.find(b => b.id === sku.branchId)?.name || 'Unknown'}
            </p>
            
            <div className="mt-6 space-y-2">
               <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400">Current Level</span>
                 <span className={sku.quantity <= sku.threshold ? 'text-rose-500' : 'text-emerald-400'}>{sku.quantity} units</span>
               </div>
               <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sku.quantity <= sku.threshold ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.max(5, Math.min((sku.quantity / (sku.threshold * 2)) * 100, 100))}%` }}
                  ></div>
               </div>
               <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Safety Min: {sku.threshold}</span>
                  <span>Health: {sku.quantity > sku.threshold ? 'Optimal' : 'Needs Restock'}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryModule;
