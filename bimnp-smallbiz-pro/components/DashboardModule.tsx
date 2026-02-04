
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Package, Store, ArrowUpRight, ArrowDownRight, Clock, Zap, TrendingUp } from 'lucide-react';
import { BusinessState } from '../types';

const data = [
  { name: 'Mon', income: 820, expenses: 400 },
  { name: 'Tue', income: 1100, expenses: 450 },
  { name: 'Wed', income: 980, expenses: 520 },
  { name: 'Thu', income: 1400, expenses: 580 },
  { name: 'Fri', income: 1850, expenses: 700 },
  { name: 'Sat', income: 2400, expenses: 850 },
  { name: 'Sun', income: 2100, expenses: 600 },
];

const DashboardModule: React.FC<{ state: BusinessState, selectedBranchId: string }> = ({ state, selectedBranchId }) => {
  const { symbol } = state.currency;
  
  const f = (val: number) => {
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const filteredRevenue = selectedBranchId === 'all' 
    ? state.totalRevenue 
    : state.branches.find(b => b.id === selectedBranchId)?.revenue || 0;

  const filteredExpenses = selectedBranchId === 'all'
    ? state.branches.reduce((acc, b) => acc + b.expenses, 0)
    : state.branches.find(b => b.id === selectedBranchId)?.expenses || 0;

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Overview</h1>
          <p className="text-slate-400 mt-1">
            {selectedBranchId === 'all' ? `Global health across all ${state.branches.length} locations.` : `Live performance for ${state.branches.find(b => b.id === selectedBranchId)?.name}`}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
           <Zap size={14} className="text-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Growth Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 -mr-4 -mt-4 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Sales</p>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold text-white">{f(filteredRevenue)}</h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border-emerald-500/30 shadow-lg shadow-emerald-500/5">
          <p className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-widest mb-2">Cash on Hand</p>
          <h3 className="text-3xl font-bold text-emerald-400">{f(state.cashOnHand)}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Available for payroll & restock</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Expenses</p>
          <h3 className="text-3xl font-bold text-rose-400">{f(filteredExpenses)}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Rent, Utilities, Staff</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-transparent">
          <p className="text-indigo-400/70 text-[10px] font-bold uppercase tracking-widest mb-2">Daily Net Profit</p>
          <h3 className="text-3xl font-bold text-white">{f(filteredRevenue - filteredExpenses)}</h3>
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp size={10} className="text-emerald-400"/> Over {data.length} day cycle
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">7-Day Cashflow Projection</h4>
            <div className="flex items-center gap-4 text-[10px] font-bold">
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Income</div>
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Expenses</div>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val}`} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(val: any) => [`${symbol}${val}`, '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl">
          <div className="p-5 border-b border-slate-800 bg-slate-800/20">
             <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Local Branch Health</h4>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
            {state.branches.map((b, i) => (
              <div key={b.id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Store size={16} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-100">{b.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Daily Burn: {f(b.expenses / 30)}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">{f(b.revenue)}</p>
                      <div className="w-16 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(b.revenue / (b.revenue + b.expenses)) * 100}%` }}></div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-bold text-slate-600 hover:text-emerald-500 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2">
               <Store size={14} /> Register Branch 3 of 5
            </button>
          </div>
          
          <div className="mt-auto p-5 border-t border-slate-800 bg-indigo-600/5">
             <div className="flex items-start gap-3">
               <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400"><Zap size={16}/></div>
               <div>
                 <p className="text-xs font-bold text-indigo-300">Smart Alert</p>
                 <p className="text-[10px] text-slate-500 leading-relaxed mt-1">"Main Street Store" shows a 15% revenue gap vs projected expenses this week. Recommend reducing inventory overhead.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
