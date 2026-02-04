
import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Lock, 
  Smartphone, 
  ShieldCheck,
  ShieldEllipsis,
  Smartphone as PhoneIcon,
  Loader2,
  Zap,
  Globe,
  AlertCircle,
  CreditCard,
  Building2,
  Wallet as WalletIcon
} from 'lucide-react';
import { PricingTier, PaymentMethod, CurrencyInfo } from '../types';
import { initiateXenteCollection, simulateXenteWebhook, calculateDates } from '../services/subscriptionService';

interface AuthFlowProps {
  onComplete: (data: { 
    name: string; 
    company: string; 
    tier: PricingTier;
    paymentMethod: PaymentMethod;
    expiryDate: string;
    graceDate: string;
  }) => void;
  detectedCurrency?: CurrencyInfo;
}

const XenteIcon = () => (
  <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg border border-slate-800">
    <div className="font-black text-white text-xl italic tracking-tighter">X</div>
  </div>
);

const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete, detectedCurrency }) => {
  const currency = detectedCurrency || { symbol: '$', code: 'USD' };
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [step, setStep] = useState(1);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'pending' | 'verifying' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    tier: 'Starter' as PricingTier,
    paymentMethod: 'Mobile Money' as PaymentMethod,
    phoneNumber: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  // Conversion rates simulation based on USD base
  const getPrice = (baseUSD: number) => {
    if (currency.code === 'UGX') return baseUSD * 3800;
    if (currency.code === 'KES') return baseUSD * 130;
    if (currency.code === 'EUR') return baseUSD * 0.92;
    if (currency.code === 'NGN') return baseUSD * 1500;
    return baseUSD;
  };

  const TIERS = [
    { id: 'Starter', name: 'Starter Node', baseUSD: 5, features: ['1 Branch', 'AI Summary'] },
    { id: 'Growth', name: 'Growth Node', baseUSD: 15, features: ['3 Branches', 'Risk Audit'] },
    { id: 'Pro', name: 'Pro Node', baseUSD: 30, features: ['5 Branches', 'Master Brain'] }
  ];

  const PAYMENT_CHANNELS: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'Mobile Money', label: 'Mobile Money', icon: Smartphone },
    { id: 'Visa/Mastercard', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'Bank Transfer', label: 'Bank Transfer', icon: Building2 },
    { id: 'Xente Wallet', label: 'Xente Wallet', icon: WalletIcon },
  ];

  const handleTriggerPush = async () => {
    setCheckoutStatus('pending');
    setError(null);
    
    try {
      const baseUSD = TIERS.find(t => t.id === formData.tier)?.baseUSD || 5;
      const amount = getPrice(baseUSD);
      
      const initResponse = await initiateXenteCollection({
        phone: formData.phoneNumber,
        card: formData.cardNumber,
        method: formData.paymentMethod,
        amount,
        currency: currency.code,
        tier: formData.tier
      });

      setTimeout(async () => {
        setCheckoutStatus('verifying');
        try {
          await simulateXenteWebhook(initResponse.transactionId);
          setCheckoutStatus('success');
          setTimeout(() => processCompletion(), 1500);
        } catch (e) {
          setError('Verification failed. Gateway timeout.');
          setCheckoutStatus('idle');
        }
      }, 3000);
    } catch (e: any) {
      setError(e.message);
      setCheckoutStatus('idle');
    }
  };

  const processCompletion = () => {
    setLoading(true);
    setIsCheckoutVisible(false);
    const dates = calculateDates();
    setTimeout(() => {
      onComplete({
        name: formData.name || 'Owner',
        company: formData.company || 'Enterprise',
        tier: formData.tier,
        paymentMethod: formData.paymentMethod,
        expiryDate: dates.expiryDate,
        graceDate: dates.graceDate
      });
      setLoading(false);
    }, 1000);
  };

  const renderSignup = () => (
    <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in relative overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => setView('landing')} className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><ArrowLeft size={16} /> Exit</button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`}></div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="max-w-xl mx-auto space-y-8 animate-in text-center">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Initialize Identity</h2>
          <div className="space-y-4">
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="Full Legal Name" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-emerald-500 transition-all" />
            <input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} type="text" placeholder="Enterprise Legal Name" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-emerald-500 transition-all" />
            <button onClick={() => setStep(2)} className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl text-white font-black text-lg transition-all shadow-2xl">CONTINUE</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in text-center">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Operational Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map(tier => (
              <div key={tier.id} onClick={() => setFormData({...formData, tier: tier.id as PricingTier})} className={`relative p-8 rounded-3xl border cursor-pointer transition-all ${formData.tier === tier.id ? 'bg-emerald-600/10 border-emerald-500 ring-2 ring-emerald-500 shadow-2xl' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}>
                <h4 className="font-black text-white text-xl">{tier.name}</h4>
                <p className="text-2xl font-black text-white mt-2">{currency.symbol}{getPrice(tier.baseUSD).toLocaleString()}<span className="text-[10px] text-slate-500 uppercase ml-1">/mo</span></p>
                <ul className="space-y-3 mt-6 text-[10px] text-slate-400 text-left font-bold uppercase tracking-widest">
                  {tier.features.map(f => <li key={f} className="flex items-center gap-2"><Check size={12} className="text-emerald-500"/> {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(3)} className="px-16 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl">NEXT: SELECT PAYMENT CHANNEL</button>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in text-center">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Global Settlement</h2>
          <div className="grid grid-cols-2 gap-4">
             {PAYMENT_CHANNELS.map(ch => (
               <button key={ch.id} onClick={() => setFormData({...formData, paymentMethod: ch.id})} className={`p-6 rounded-[2rem] border flex flex-col items-center gap-3 transition-all ${formData.paymentMethod === ch.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl ring-2 ring-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'}`}>
                  <ch.icon size={32} />
                  <span className="text-xs font-black uppercase tracking-widest">{ch.label}</span>
               </button>
             ))}
          </div>
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-3">
             <Globe size={20} className="text-indigo-400" />
             <p className="text-[10px] text-slate-400 font-bold uppercase text-left tracking-tight leading-relaxed">Cross-border settlement active. Transaction will be cleared in {currency.code} via Xente International Gateway.</p>
          </div>
          <button onClick={() => setStep(4)} className="px-16 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl">CONFIRM SETTLEMENT DETAILS</button>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-xl mx-auto text-center space-y-8 animate-in">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Authorization</h2>
          
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl">
            {formData.paymentMethod === 'Visa/Mastercard' ? (
              <div className="space-y-4 text-left">
                <input type="text" placeholder="Card Number" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-white font-bold outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-white font-bold outline-none" />
                  <input type="text" placeholder="CVV" className="bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-white font-bold outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Account Identification (Phone/Account)</label>
                <input type="text" placeholder="International Format" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-5 px-8 text-white font-black text-xl outline-none" />
              </div>
            )}
          </div>

          <button onClick={() => setIsCheckoutVisible(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-3xl text-white font-black text-2xl shadow-2xl transition-all">AUTHORIZE SETTLEMENT</button>
        </div>
      )}

      {isCheckoutVisible && (
        <div className="absolute inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-md w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-950 p-10 text-white flex justify-between items-center">
              <div className="flex items-center gap-5"><XenteIcon /> <h3 className="font-black text-2xl leading-none italic">Global Checkout</h3></div>
              <button onClick={() => setIsCheckoutVisible(false)} className="hover:bg-white/10 p-3 rounded-full text-white"><ArrowLeft size={28}/></button>
            </div>
            
            <div className="p-12 space-y-10 text-center">
               <div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Amount</p>
                 <h2 className="text-3xl font-black text-slate-950 mt-2">{currency.symbol}{getPrice(TIERS.find(t => t.id === formData.tier)?.baseUSD || 0).toLocaleString()}</h2>
               </div>

               {error && <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-xs font-black uppercase tracking-tight flex items-center gap-3"><AlertCircle size={20}/> {error}</div>}

               {checkoutStatus === 'idle' ? (
                 <button onClick={handleTriggerPush} className="w-full bg-slate-950 hover:bg-slate-900 py-6 rounded-2xl text-white font-black text-xl flex items-center justify-center gap-4 transition-all">INITIATE CLEARANCE <ArrowRight size={24}/></button>
               ) : (
                 <div className="flex flex-col items-center py-8 text-center space-y-6">
                    {checkoutStatus === 'pending' && <><div className="w-16 h-16 border-4 border-slate-100 border-t-slate-950 rounded-full animate-spin"></div><p className="font-black text-slate-950 italic uppercase tracking-tighter">Connecting to {formData.paymentMethod} Gateway...</p></>}
                    {checkoutStatus === 'verifying' && <><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center animate-pulse"><ShieldEllipsis size={32} /></div><p className="font-black text-slate-950 italic uppercase tracking-tighter">Validating Global IPN Response...</p></>}
                    {checkoutStatus === 'success' && <><div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl"><Check size={32} /></div><p className="font-black text-emerald-600 italic uppercase tracking-tighter">Node Activated Globally</p></>}
                 </div>
               )}

               <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] pt-10 border-t border-slate-100">
                 <Lock size={14}/> XENTE GLOBAL SECURE
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-950/50 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-950/50 rounded-full blur-[180px] animate-pulse [animation-delay:2s]"></div>
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        {view === 'landing' && (
          <div className="max-w-md w-full text-center space-y-12 animate-in">
            <div className="w-28 h-28 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl rotate-12 transition-transform hover:rotate-0"><Cpu size={64} /></div>
            <h1 className="text-7xl font-black tracking-tighter text-white mb-2 italic uppercase">BIMNP OS</h1>
            <p className="text-slate-500 text-lg font-black uppercase tracking-[0.3em]">Enterprise Infrastructure</p>
            <div className="grid gap-5">
              <button onClick={() => setView('signup')} className="flex items-center justify-between p-10 bg-emerald-600 border border-emerald-500 rounded-[2.5rem] hover:bg-emerald-500 transition-all text-left shadow-2xl shadow-emerald-600/30 font-black italic uppercase text-white text-3xl">Initialize <ArrowRight size={32} /></button>
              <button onClick={() => setView('login')} className="flex items-center justify-between p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] hover:bg-slate-800 transition-all text-left shadow-2xl font-black italic uppercase text-white text-3xl">Access <Lock size={32} /></button>
            </div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] pt-10 border-t border-slate-800/50"><Globe size={14} className="inline mr-2"/> Xente Universal Gateway Integrated</p>
          </div>
        )}
        {(view === 'login' || view === 'signup') && (view === 'signup' ? renderSignup() : null)}
        {view === 'login' && (
          <div className="max-w-md w-full text-center space-y-10 animate-in">
            <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-2xl"><Lock size={40} /></div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Resume Session</h2>
            <div className="space-y-5">
              <input type="email" placeholder="owner@business.node" className="w-full bg-slate-800 border-slate-700 rounded-3xl py-6 px-8 text-white font-black text-xl outline-none" />
              <button onClick={() => processCompletion()} className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-3xl text-white font-black text-2xl shadow-2xl">ACCESS CONSOLE</button>
            </div>
            <button onClick={() => setView('landing')} className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-[0.4em]">Back to Launchpad</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFlow;
