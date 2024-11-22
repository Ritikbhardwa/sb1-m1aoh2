import { create } from 'zustand';
import { InvoiceData } from '../types';

interface InvoiceStore {
  invoice: InvoiceData;
  updateInvoice: (data: Partial<InvoiceData>) => void;
  resetInvoice: () => void;
}

const initialState: InvoiceData = {
  clientName: '',
  amount: '',
  currency: 'USD',
  date: new Date().toISOString().split('T')[0],
  description: '',
};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoice: initialState,
  updateInvoice: (data) =>
    set((state) => ({
      invoice: { ...state.invoice, ...data },
    })),
  resetInvoice: () => set({ invoice: initialState }),
}));