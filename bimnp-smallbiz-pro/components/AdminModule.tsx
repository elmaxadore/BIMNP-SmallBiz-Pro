
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  History, 
  RefreshCw, 
  AlertCircle,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Smartphone,
  CreditCard,
  Building2,
  Wallet as WalletIcon
} from 'lucide-react';
import { TransactionRecord, SystemLog } from '../types';
import { manualAdminAction, logEvent } from '../services/subscriptionService';

const AdminModule: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'telemetry'>('transactions');

  const loadData = () => {
    setTransactions(JSON.parse(localStorage.getItem('transactions') || '[]'));
    setLogs(JSON.parse(localStorage.getItem('system_logs') || '[]'));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleManualActivate = (id: string) => {
    manualAdminAction(id, 'activate');
    loadData();
  };

  const handleRefund = (id: string) => {
    manualAdminAction(id, 'refund');
    loadData();
  };

  const getMethodIcon = (method: string) => {
    if (method === 'Mobile Money') return <Smartphone size={12} />;
    if (method === 'Visa/Mastercard') return <CreditCard size={12} />;
    if (method === 'Bank Transfer') return <Building2 size={12} />;
    return <WalletIcon size={12} />;
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-rose-600/20 ring-1 ring-white/20">
            <Lock size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tight text-white uppercase">Infrastructure Root</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={12} className="text-rose-500"/> Xente Universal Settlement Oversight
            </p>
          </div>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
           <button 
             onClick={() => setActiveTab('transactions')}
             className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             Global Ledger
           </button>
           <button 
             onClick={() => setActiveTab('telemetry')}
             className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'telemetry' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             IPN Telemetry
           </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
        {activeTab === 'transactions' ? (
          <div className="flex flex-col">
            <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500">
                <History size={18} />
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Clearance Log</h3>
              </div>
              <button onClick={loadData} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><RefreshCw size={18}/></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] uppercase tracking-tighter">
                <thead>
                  <tr className="bg-slate-800/50 text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] border-b border-slate-800">
                    <th className="px-6 py-4">TXID / Reference</th>
                    <th className="px-6 py-4">Settlement Channel</th>
                    <th className="px-6 py-4">Identifier</th>
                    <th className="px-6 py-4">Tier / Clearance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Overrides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-bold">
                  {transactions.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-600 italic font-black uppercase tracking-widest">No settlement records found in global cloud.</td></tr>
                  )}
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/20 transition-all text-slate-300">
                      <td className="px-6 py-4 font-black">
                        <p className="text-slate-200 text-xs tracking-widest">{tx.id}</p>
                        <p className="text-[9px] text-slate-500 font-mono tracking-tighter mt-0.5">{tx.reference}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="p-1 bg-slate-800 rounded text-rose-500">{getMethodIcon(tx.method)}</div>
                           <span className="text-[10px] font-black uppercase tracking-widest">{tx.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {tx.phoneNumber || tx.cardNumber || 'EXTERNAL_REF'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-xs">{tx.currency} {tx.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-rose-500 font-black uppercase mt-0.5 tracking-widest">{tx.tier} NODE</p>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.2em] ${
                           tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                           tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                           tx.status === 'refunded' ? 'bg-indigo-500/10 text-indigo-500' :
                           'bg-rose-500/10 text-rose-500'
                         }`}>
                           {tx.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {tx.status === 'pending' && (
                          <button onClick={() => handleManualActivate(tx.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg">FORCE_ACTIVATE</button>
                        )}
                        {tx.status === 'completed' && (
                          <button onClick={() => handleRefund(tx.id)} className="border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg">VOID_SETTLEMENT</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-500">
                <Terminal size={18} />
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Telemetry Stream</h3>
              </div>
              <div className="flex items-center gap-6">
                 <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Universal Cloud Node Ready
                 </span>
                 <button onClick={() => { localStorage.removeItem('system_logs'); loadData(); }} className="text-[10px] font-black text-rose-500 hover:underline uppercase tracking-widest">PURGE_TELEMETRY</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] bg-slate-950/50">
               {logs.length === 0 && <p className="text-slate-700 text-center py-20 italic uppercase font-black tracking-widest">No telemetry data in universal buffer.</p>}
               {logs.map(log => (
                 <div key={log.id} className={`p-3 rounded-xl border flex gap-4 animate-in ${
                   log.level === 'error' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
                   log.level === 'warn' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                   'bg-slate-800/30 border-slate-800/50 text-slate-500'
                 }`}>
                   <span className="text-slate-700 font-black opacity-50 flex-shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                   <span className={`font-black w-32 flex-shrink-0 uppercase tracking-widest ${log.level === 'error' ? 'text-rose-500' : 'text-slate-300'}`}>{log.event}</span>
                   <span className="flex-1 text-slate-400 font-black">{log.details}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModule;
