
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Wallet, Receipt, Trash2, X, ChevronDown, CheckCircle2, CloudLightning } from 'lucide-react';
import { BusinessState, Transaction } from '../types';

interface CashflowModuleProps {
  state: BusinessState;
  type: 'income' | 'expense';
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

const INCOME_CATEGORIES = ['Sales', 'Services', 'Rent', 'Interest', 'Consulting', 'Other'];
const EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Payroll', 'Supplies', 'Marketing', 'Taxes', 'Inventory', 'Other'];

const CashflowModule: React.FC<CashflowModuleProps> = ({ state, type, onAddTransaction }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    branchId: state.branches[0]?.id || ''
  });

  const { symbol } = state.currency;
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const filteredTransactions = useMemo(() => {
    return state.ledger
      .filter(tx => tx.type === type)
      .filter(tx => categoryFilter === 'all' || tx.category === categoryFilter)
      .filter(tx => 
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [state.ledger, type, categoryFilter, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;
    
    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      type,
      category: newTx.category,
      branchId: newTx.branchId
    });

    setNewTx({ 
      description: '', 
      amount: '', 
      category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0], 
      branchId: state.branches[0]?.id || '' 
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic uppercase">
            {type === 'income' ? <Wallet className="text-emerald-500" /> : <Receipt className="text-rose-500" />}
            {type === 'income' ? 'Income & Sales' : 'Expenses & Spending'}
          </h1>
          <p className="text-slate-400 mt-1 font-bold text-[10px] uppercase tracking-[0.2em]">
            Global Node Settlement Ledger • {state.currency.code} ({symbol})
          </p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowAddForm(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 italic ${
              type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
            }`}
           >
             <Plus size={16} /> Record {type === 'income' ? 'Sale' : 'Expense'}
           </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-2xl italic tracking-tighter text-white uppercase">New {type} Entry</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-xl transition-all"><X size={20}/></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <input 
                type="text" 
                placeholder="e.g. Bulk Product Sale" 
                value={newTx.description}
                onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <select 
                value={newTx.category}
                onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount ({symbol})</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={newTx.amount}
                onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" 
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all italic ${
                  type === 'income' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                Authorize Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between bg-slate-800/20 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-2xl px-5 py-2.5 focus-within:border-emerald-500 transition-all shadow-inner flex-1 md:flex-none">
               <Search size={14} className="text-slate-500 mr-3" />
               <input 
                type="text" 
                placeholder="Search ledger..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[10px] border-none focus:ring-0 p-0 font-bold text-white placeholder-slate-600 uppercase tracking-widest" 
               />
             </div>
             
             <div className="relative group">
               <div className="flex items-center bg-slate-900 border border-slate-700 rounded-2xl px-5 py-2.5 transition-all shadow-inner">
                  <Filter size={14} className="text-slate-500 mr-3" />
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-transparent text-[10px] border-none focus:ring-0 p-0 font-black text-slate-300 uppercase tracking-widest appearance-none pr-4 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown size={12} className="text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
             </div>
          </div>
          <button className="text-[10px] font-black text-slate-500 flex items-center gap-2 hover:text-white transition-colors uppercase tracking-[0.2em] italic">
            <Download size={14} className="text-emerald-500" /> Export Forensic CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] border-b border-slate-800">
                <th className="px-8 py-5">Sync</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Descriptor</th>
                <th className="px-8 py-5">Category Mapping</th>
                <th className="px-8 py-5">Origin Node</th>
                <th className="px-8 py-5 text-right">Settlement Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-700 italic font-black uppercase tracking-widest text-xs">
                    No matching ledger entries recorded.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="px-8 py-5">
                      {tx.syncStatus === 'synced' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <CloudLightning size={16} className="text-amber-500 animate-pulse" />
                      )}
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-black text-[10px] italic">{tx.date}</td>
                    <td className="px-8 py-5 font-black text-slate-200 uppercase tracking-tight text-xs">{tx.description}</td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 bg-slate-950 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] border border-indigo-500/20 italic">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {state.branches.find(b => b.id === tx.branchId)?.name || 'Central Infrastructure'}
                    </td>
                    <td className={`px-8 py-5 text-right font-black italic ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <div className="flex items-center justify-end gap-2 text-sm">
                        {type === 'income' ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                        {symbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-800/10 border-t border-slate-800 flex justify-between items-center">
           <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Total Page Volume</p>
           <p className={`text-sm font-black italic ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {symbol}{filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
           </p>
        </div>
      </div>
    </div>
  );
};

export default CashflowModule;
