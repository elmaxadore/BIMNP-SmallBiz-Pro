
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  Package, 
  Store, 
  Cpu,
  Menu,
  Clock,
  Plus,
  LogOut,
  Star,
  Lock,
  AlertTriangle,
  RefreshCcw,
  Settings,
  ShieldAlert,
  Wifi,
  WifiOff,
  CloudLightning
} from 'lucide-react';
import { ModuleId, BusinessState, PricingTier, Transaction, CurrencyInfo, PaymentMethod, SKU, Branch, SyncStatus } from './types';
import DashboardModule from './components/DashboardModule';
import CashflowModule from './components/CashflowModule';
import InventoryModule from './components/InventoryModule';
import BranchModule from './components/BranchModule';
import GlobalBrainModule from './components/GlobalBrainModule';
import AdminModule from './components/AdminModule';
import PersistentAssistant from './components/PersistentAssistant';
import AuthFlow from './components/AuthFlow';
import { getCurrencyInfo } from './services/geminiService';
import { verifySubscriptionStatus, logEvent } from './services/subscriptionService';

const STORAGE_KEY = 'bimnp_business_state';

const INITIAL_STATE: BusinessState = {
  totalRevenue: 45200,
  cashOnHand: 12400,
  tier: 'Starter',
  subscription: {
    tier: 'Starter',
    method: 'Mobile Money',
    status: 'active',
    expiryDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    graceDate: new Date(Date.now() + 86400000 * 32).toISOString(),
    isTrial: true
  },
  currency: { symbol: '$', code: 'USD' },
  branches: [{ id: 'b1', name: 'Main Street Store', location: 'Downtown', revenue: 28000, expenses: 12000, manager: 'Alex' }],
  inventory: [{ id: 'sku-1', name: 'Premium Coffee Beans', quantity: 45, threshold: 10, branchId: 'b1' }],
  ledger: [{ id: 'tx1', date: '2024-05-20', description: 'Daily Sales - Main', amount: 1200, type: 'income', category: 'Sales', branchId: 'b1', syncStatus: 'synced' }],
  tasks: [{ id: 't1', title: 'Q2 Tax Prep', description: 'Coordinate with accountant', status: 'todo', priority: 1, probabilityOfCompletion: 0.4 }],
  leads: [], vendors: [], campaigns: [], onboardingSteps: [], partners: []
};

const App: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('bimnp_onboarded') === 'true';
  });
  
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  
  const [businessState, setBusinessState] = useState<BusinessState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  // Network Status Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logEvent('NETWORK_STATUS', 'Node re-connected to global infrastructure.', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      logEvent('NETWORK_STATUS', 'Node operating in isolated local mode.', 'warn');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Background Sync Logic
  useEffect(() => {
    if (isOnline) {
      const pendingItems = businessState.ledger.filter(tx => tx.syncStatus === 'pending');
      if (pendingItems.length > 0) {
        setSyncing(true);
        logEvent('BACKGROUND_SYNC', `Reconciling ${pendingItems.length} local entries with cloud ledger.`, 'info');
        
        setTimeout(() => {
          setBusinessState(prev => ({
            ...prev,
            ledger: prev.ledger.map(tx => ({ ...tx, syncStatus: 'synced' as SyncStatus }))
          }));
          setSyncing(false);
        }, 2000);
      }
    }
  }, [isOnline]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businessState));
  }, [businessState]);

  useEffect(() => {
    localStorage.setItem('bimnp_onboarded', hasOnboarded.toString());
  }, [hasOnboarded]);

  useEffect(() => {
    const checkSub = () => {
      const currentStatus = verifySubscriptionStatus(businessState.subscription.expiryDate, businessState.subscription.graceDate);
      if (currentStatus !== businessState.subscription.status) {
        setBusinessState(prev => ({
          ...prev,
          subscription: { ...prev.subscription, status: currentStatus }
        }));
      }
    };
    checkSub();
    const subInterval = setInterval(checkSub, 15000); 
    return () => clearInterval(subInterval);
  }, [businessState.subscription.expiryDate, businessState.subscription.graceDate, businessState.subscription.status]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        if (businessState.currency.code === 'USD' && !localStorage.getItem(STORAGE_KEY)) {
            try {
              const currency = await getCurrencyInfo(lat, lng);
              setBusinessState(prev => ({ ...prev, currency }));
            } catch (e) { console.error("Currency detection failed", e); }
        }
      },
      (err) => console.error("Location error", err)
    );
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOnboardingComplete = (data: any) => {
    setBusinessState(prev => ({
      ...prev,
      tier: data.tier,
      subscription: {
        ...prev.subscription,
        tier: data.tier,
        method: data.paymentMethod,
        status: 'active',
        expiryDate: data.expiryDate,
        graceDate: data.graceDate,
        isTrial: false
      }
    }));
    setHasOnboarded(true);
  };

  const isExpired = businessState.subscription.status === 'expired';
  const isGrace = businessState.subscription.status === 'grace';

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newId = `tx-${Date.now()}`;
    setBusinessState(prev => {
      // Fix: Explicitly define syncStatus as SyncStatus type to avoid string widening issues in state updates.
      const syncStatus: SyncStatus = isOnline ? 'synced' : 'pending';
      const updatedLedger: Transaction[] = [{ ...tx, id: newId, syncStatus }, ...prev.ledger];
      let newTotalRevenue = prev.totalRevenue;
      let newCashOnHand = prev.cashOnHand;
      
      if (tx.type === 'income') {
        newTotalRevenue += tx.amount;
        newCashOnHand += tx.amount;
      } else {
        newCashOnHand -= tx.amount;
      }

      const updatedBranches = prev.branches.map(b => {
        if (b.id === tx.branchId) {
          return {
            ...b,
            revenue: tx.type === 'income' ? b.revenue + tx.amount : b.revenue,
            expenses: tx.type === 'expense' ? b.expenses + tx.amount : b.expenses
          };
        }
        return b;
      });

      return { ...prev, ledger: updatedLedger, totalRevenue: newTotalRevenue, cashOnHand: newCashOnHand, branches: updatedBranches };
    });
  };

  const addInventoryItem = (item: Omit<SKU, 'id'>) => {
    const newId = `sku-${Date.now()}`;
    setBusinessState(prev => ({ ...prev, inventory: [{ ...item, id: newId }, ...prev.inventory] }));
  };

  const addBranch = (branch: Omit<Branch, 'id' | 'revenue' | 'expenses'>) => {
    const newId = `b-${Date.now()}`;
    setBusinessState(prev => ({ ...prev, branches: [...prev.branches, { ...branch, id: newId, revenue: 0, expenses: 0 }] }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, premium: false },
    { id: 'cashflow', label: 'Income & Sales', icon: Wallet, premium: false },
    { id: 'expenses', label: 'Expenses & Bills', icon: Receipt, premium: false },
    { id: 'inventory', label: 'Stock Levels', icon: Package, premium: false },
    { id: 'branches', label: 'Branches (1-5)', icon: Store, premium: true },
    { id: 'brain', label: 'Business AI Brain', icon: Cpu, premium: true },
    { id: 'admin', label: 'System Admin', icon: Settings, premium: false },
  ];

  const renderModule = () => {
    const activeNavItem = navItems.find(n => n.id === activeModule);
    if (isExpired && activeNavItem?.premium) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in py-20">
          <div className="w-28 h-28 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
            <Lock size={56} />
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Infrastructure Locked</h2>
            <p className="text-slate-400 mt-4 leading-relaxed uppercase tracking-tight font-bold">Node Deactivated. Grace period concluded. Re-initialize global settlement via Xente to resume operations.</p>
          </div>
          <button onClick={() => setHasOnboarded(false)} className="flex items-center gap-3 px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] font-black shadow-2xl transition-all">
            <RefreshCcw size={20} /> Resolve Settlement Node
          </button>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard': return <DashboardModule state={businessState} selectedBranchId={selectedBranchId} />;
      case 'cashflow': 
      case 'expenses': return <CashflowModule state={businessState} type={activeModule === 'expenses' ? 'expense' : 'income'} onAddTransaction={addTransaction} />;
      case 'inventory': return <InventoryModule state={businessState} onAddItem={addInventoryItem} />;
      case 'branches': return <BranchModule state={businessState} onAddBranch={addBranch} />;
      case 'brain': return <GlobalBrainModule location={location} />;
      case 'admin': return <AdminModule />;
      default: return <DashboardModule state={businessState} selectedBranchId={selectedBranchId} />;
    }
  };

  if (!hasOnboarded) {
    return <AuthFlow onComplete={handleOnboardingComplete} detectedCurrency={businessState.currency} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans tracking-tight">
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg">B</div>
          {sidebarOpen && <span className="font-black text-lg tracking-tighter italic uppercase">BIMNP OS</span>}
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ModuleId)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all relative group ${
                activeModule === item.id 
                  ? (item.id === 'admin' ? 'bg-rose-600 text-white shadow-lg' : 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 shadow-inner')
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
              } ${isExpired && item.premium ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>}
              {isExpired && item.premium && <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className={`p-4 mx-4 mb-4 border rounded-2xl transition-all ${isExpired ? 'bg-rose-500/5 border-rose-500/20' : isGrace ? 'bg-amber-500/5 border-amber-500/30 animate-pulse' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
             <div className={`flex items-center gap-2 mb-1.5 ${isExpired ? 'text-rose-500' : isGrace ? 'text-amber-500 font-black' : 'text-emerald-500'}`}>
                {isExpired ? <AlertTriangle size={14} /> : isGrace ? <ShieldAlert size={14} /> : <Star size={14} fill="currentColor" />}
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isExpired ? 'Locked' : isGrace ? 'Overdue' : 'Global Node Active'}</span>
             </div>
             <p className="text-[8px] text-slate-500 leading-tight font-black uppercase tracking-tighter">
               {isExpired ? 'Access Hard-Locked.' : isGrace ? 'Global Grace: 48hrs Remaining.' : `Renewal: ${new Date(businessState.subscription.expiryDate).toLocaleDateString()}`}
             </p>
          </div>
        )}

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
           <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
             <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden ring-2 ring-emerald-500/20">
                <img src="https://picsum.photos/seed/owner/100/100" alt="Owner" />
             </div>
             {sidebarOpen && (
               <div className="text-left overflow-hidden">
                 <p className="text-[10px] font-black truncate uppercase tracking-widest text-slate-200">Shop Owner</p>
                 <p className="text-[9px] text-emerald-500 font-black uppercase tracking-tighter">{businessState.tier} Universal Node</p>
               </div>
             )}
             {sidebarOpen && (
               <button onClick={() => { setHasOnboarded(false); localStorage.removeItem('bimnp_onboarded'); }} className="ml-auto text-slate-600 hover:text-rose-400 transition-colors">
                 <LogOut size={14}/>
               </button>
             )}
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-all"><Menu size={20} /></button>
            <div className="flex items-center gap-3 bg-slate-800/40 p-1 rounded-lg border border-slate-700/50">
               <label className="text-[9px] font-black text-slate-600 uppercase px-2 tracking-[0.2em]">Infrastructure Context</label>
               <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="bg-slate-950 border-none text-[10px] text-emerald-400 font-black rounded px-3 py-1 outline-none uppercase tracking-widest">
                 <option value="all">Global Consolidation</option>
                 {businessState.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
               </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-black uppercase tracking-widest">
                <Clock size={12} className="text-emerald-500" /> {time}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {syncing ? (
                  <span className="text-[8px] text-indigo-400 font-black uppercase flex items-center gap-1 animate-pulse">
                    <CloudLightning size={10} className="animate-bounce" /> SYNCING LEDGER...
                  </span>
                ) : isOnline ? (
                  <span className="text-[8px] text-emerald-500 font-black uppercase flex items-center gap-1">
                    <Wifi size={10} /> GLOBAL SYNC ACTIVE
                  </span>
                ) : (
                  <span className="text-[8px] text-amber-500 font-black uppercase flex items-center gap-1">
                    <WifiOff size={10} /> LOCAL MODE (CACHE ACTIVE)
                  </span>
                )}
              </div>
            </div>
            {isExpired || isGrace ? (
              <button onClick={() => setHasOnboarded(false)} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-xl animate-pulse tracking-widest">RESOLVE INFRASTRUCTURE</button>
            ) : (
              <button onClick={() => setActiveModule('cashflow')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-xl tracking-widest">NEW SETTLEMENT</button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-emerald-500/5 to-transparent">
          <div className="max-w-7xl mx-auto">{renderModule()}</div>
        </div>
        {!isExpired && <PersistentAssistant activeModule={activeModule} location={location} />}
      </main>
    </div>
  );
};

export default App;
