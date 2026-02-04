
import { PricingTier, SubscriptionStatus, TransactionRecord, SystemLog, PaymentMethod } from '../types';

/**
 * XENTE GLOBAL BACKEND PROXY (Simulated)
 */
const XENTE_CONFIG = {
  key: process.env.XENTE_API_KEY || '4FE1A9B163C54CB4B39AE872C1869466',
  password: process.env.XENTE_PASSWORD || 'BC72B9A7A917476AB63CB5E1A964F8A8'
};

const getDB = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveDB = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const logEvent = (event: string, details: string, level: SystemLog['level'] = 'info') => {
  const logs = getDB<SystemLog>('system_logs');
  const newLog: SystemLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    event,
    details,
    level
  };
  saveDB('system_logs', [newLog, ...logs].slice(0, 150));
};

export const initiateXenteCollection = async (
  payload: { 
    phone?: string, 
    card?: string, 
    method: PaymentMethod, 
    amount: number, 
    currency: string,
    tier: PricingTier 
  }
): Promise<any> => {
  logEvent('XENTE_GLOBAL_INIT', `Requesting ${payload.method} settlement: ${payload.currency} ${payload.amount}`, 'info');

  const lastReqTime = localStorage.getItem('last_xente_req');
  if (lastReqTime && Date.now() - parseInt(lastReqTime) < 5000) {
    logEvent('SECURITY_RATE_LIMIT', `Spam protection triggered for global request.`, 'warn');
    throw new Error('Rate limit exceeded. Please wait 5 seconds.');
  }
  localStorage.setItem('last_xente_req', Date.now().toString());

  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionId = `XEN-GLO-${Date.now()}`;
      const record: TransactionRecord = {
        id: transactionId,
        reference: `REF-${Math.random().toString(36).toUpperCase().substr(2, 12)}`,
        phoneNumber: payload.phone,
        cardNumber: payload.card ? `**** **** **** ${payload.card.slice(-4)}` : undefined,
        amount: payload.amount,
        currency: payload.currency,
        method: payload.method,
        status: 'pending',
        timestamp: new Date().toISOString(),
        signatureVerified: true,
        tier: payload.tier
      };
      
      const transactions = getDB<TransactionRecord>('transactions');
      saveDB('transactions', [record, ...transactions]);
      
      resolve({ success: true, transactionId });
    }, 1500);
  });
};

export const simulateXenteWebhook = async (transactionId: string): Promise<TransactionRecord> => {
  logEvent('GLOBAL_IPN_RECEIVED', `IPN verification in progress for ${transactionId}`, 'info');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const transactions = getDB<TransactionRecord>('transactions');
      const index = transactions.findIndex(t => t.id === transactionId);

      if (index === -1) {
        logEvent('WEBHOOK_FORGERY_ALERT', `Unrecognized TXID: ${transactionId}`, 'error');
        reject('Transaction not found');
        return;
      }

      const tx = transactions[index];
      if (tx.status === 'completed') {
        resolve(tx);
        return;
      }

      // Final signature check simulation
      tx.status = 'completed';
      saveDB('transactions', transactions);
      
      logEvent('GLOBAL_SETTLEMENT_SUCCESS', `TX ${transactionId} settled. Multi-currency clearance granted.`, 'info');
      resolve(tx);
    }, 2000);
  });
};

export const verifySubscriptionStatus = (expiryDate: string, graceDate: string): SubscriptionStatus => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const grace = new Date(graceDate);

  if (now > grace) return 'expired';
  if (now > expiry) return 'grace';
  return 'active';
};

export const calculateDates = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  const grace = new Date(expiry);
  grace.setDate(grace.getDate() + 2);
  
  return {
    expiryDate: expiry.toISOString(),
    graceDate: grace.toISOString()
  };
};

export const manualAdminAction = (id: string, action: 'activate' | 'refund') => {
  const transactions = getDB<TransactionRecord>('transactions');
  const index = transactions.findIndex(t => t.id === id);
  
  if (index !== -1) {
    if (action === 'activate') transactions[index].status = 'completed';
    else if (action === 'refund') transactions[index].status = 'refunded';
    saveDB('transactions', transactions);
    logEvent('ADMIN_OVERRIDE', `Manual ${action} for TX ${id}`, 'warn');
  }
};
