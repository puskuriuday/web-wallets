import { getData, storeData } from './localStore';
import type { Transaction } from '../components/TransactionList';

// Storage keys per chain
const txKey = (chain: 'ethereum' | 'solana') => chain === 'ethereum' ? 'ethereumTransactions' : 'solanaTransactions';

export const getTransactions = (chain: 'ethereum' | 'solana'): Transaction[] => {
  try {
    const raw = getData(txKey(chain));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Transaction[];
  } catch {
    return [];
  }
};

export const saveTransactions = (chain: 'ethereum' | 'solana', txs: Transaction[]) => {
  storeData(txKey(chain), JSON.stringify(txs));
};

export const addTransaction = (chain: 'ethereum' | 'solana', tx: Transaction) => {
  const existing = getTransactions(chain);
  existing.unshift(tx); // newest first
  // Optional: cap at 500 to avoid unbounded growth
  if (existing.length > 500) existing.length = 500;
  saveTransactions(chain, existing);
  return existing;
};

export const generateTxHash = (chain: 'ethereum' | 'solana') => {
  const prefix = chain === 'ethereum' ? '0x' : 'So';
  return prefix + Math.random().toString(16).slice(2).padEnd(chain === 'ethereum' ? 64 : 48, '0');
};
