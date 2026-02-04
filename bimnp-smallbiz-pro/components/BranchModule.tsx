
import React, { useState } from 'react';
import { Store, User, MapPin, TrendingUp, AlertCircle, Plus, X } from 'lucide-react';
import { BusinessState, Branch } from '../types';

interface BranchModuleProps {
  state: BusinessState;
  onAddBranch: (branch: Omit<Branch, 'id' | 'revenue' | 'expenses'>) => void;
}

const BranchModule: React.FC<BranchModuleProps> = ({ state, onAddBranch }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: ''
  });

  const { symbol } = state.currency;
  const f = (val: number) => `${symbol}${val.toLocaleString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.manager) return;

    onAddBranch({
      name: formData.name,
      location: formData.location,
      manager: formData.manager
    });

    setFormData({ name: '', location: '', manager: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Branch Management</h1>
          <p className="text-slate-400 mt-1">Manage operations for your {state.branches.length} physical locations.</p>
        </div>
        {state.branches.length < 5 && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} /> Open New Branch
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {state.branches.map(branch => (
          <div key={branch.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-emerald-500/20 transition-all">
             <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/20">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-600/20">
                      <Store size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-slate-100">{branch.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {branch.location}
                      </p>
                   </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">ACTIVE NODE</span>
             </div>
             
             <div className="p-6 grid grid-cols-2 gap-8">
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Monthly Revenue</p>
                   <p className="text-xl font-bold text-slate-200">{f(branch.revenue)}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operating Cost</p>
                   <p className="text-xl font-bold text-rose-400">{f(branch.expenses)}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Manager</p>
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                      <User size={14} className="text-emerald-500" /> {branch.manager}
                   </div>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status Health</p>
                   <p className={`text-sm font-bold ${branch.revenue >= branch.expenses ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {branch.revenue >= branch.expenses ? 'Profitable' : 'Loss Context'}
                   </p>
                </div>
             </div>

             <div className="px-6 pb-6 pt-2">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
                   <AlertCircle size={16} className="text-amber-500" />
                   <p className="text-[10px] text-slate-400">Node operational. Real-time data streams synchronized.</p>
                </div>
             </div>
          </div>
        ))}

        {showForm ? (
          <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-100">Register Branch {state.branches.length + 1} of 5</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Branch Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. West Coast Outlet" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Location</label>
                    <input 
                      type="text" 
                      placeholder="City/District" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Manager</label>
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={formData.manager}
                      onChange={(e) => setFormData({...formData, manager: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all mt-4"
                >
                  Activate Branch Node
                </button>
             </form>
          </div>
        ) : (
          state.branches.length < 5 && (
            <div 
              onClick={() => setShowForm(true)}
              className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-slate-900 hover:border-emerald-500/50 transition-all"
            >
               <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all mb-4">
                  <Plus size={32} />
               </div>
               <p className="font-bold text-slate-500 group-hover:text-slate-300">Add Growth Node</p>
               <p className="text-xs text-slate-600 mt-1">Scale your business by adding another branch location.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BranchModule;
