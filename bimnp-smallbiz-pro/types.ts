
export type ModuleId = 'dashboard' | 'cashflow' | 'expenses' | 'inventory' | 'branches' | 'brain' | 'admin';

export type PricingTier = 'Starter' | 'Growth' | 'Pro';
export type PaymentMethod = 'Xente Wallet' | 'Mobile Money' | 'Visa/Mastercard' | 'Bank Transfer' | 'Apple/Google Pay';

export type SubscriptionStatus = 'active' | 'expired' | 'grace' | 'pending' | 'none';

export interface SubscriptionInfo {
  tier: PricingTier;
  method: PaymentMethod;
  status: SubscriptionStatus;
  expiryDate: string; // ISO Date
  graceDate: string;  // ISO Date (expiry + 2 days)
  isTrial: boolean;
}

export type SyncStatus = 'synced' | 'pending';

export interface TransactionRecord {
  id: string;
  reference: string;
  phoneNumber?: string;
  cardNumber?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'completed' | 'failed' | 'pending' | 'refunded';
  timestamp: string;
  signatureVerified: boolean;
  tier: PricingTier;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  level: 'info' | 'warn' | 'error';
}

export interface BusinessState {
  totalRevenue: number;
  cashOnHand: number;
  tier: PricingTier;
  subscription: SubscriptionInfo;
  currency: CurrencyInfo;
  branches: Branch[];
  inventory: SKU[];
  ledger: Transaction[];
  tasks: Task[];
  leads: Lead[];
  vendors: Vendor[];
  campaigns: Campaign[];
  onboardingSteps: OnboardingStep[];
  partners: Partner[];
}

export interface CurrencyInfo {
  symbol: string;
  code: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  revenue: number;
  expenses: number;
  manager: string;
}

export interface SKU {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  branchId: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  branchId: string;
  syncStatus?: SyncStatus;
}

export interface Task { id: string; title: string; description: string; status: any; priority: number; probabilityOfCompletion?: number; }
export interface Lead { id: string; name: string; score: number; status: string; value: number; }
export interface Vendor { id: string; name: string; category: string; reliability: number; lastOrderDate: string; }
export interface Campaign { id: string; name: string; channel: string; status: 'active' | 'paused'; spend: number; }
export interface OnboardingStep { id: string; label: string; completed: boolean; }
export interface Partner { id: string; name: string; industry: string; location: string; trustScore: number; activeTrades: number; synergyLevel: number; }
