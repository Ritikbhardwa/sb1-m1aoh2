export interface InvoiceData {
  clientName: string;
  clientEmail: string;
  amount: string;
  currency: string;
  date: string;
  description: string;
  paymentMethod?: 'stripe' | 'paypal';
  stripeAccountId?: string;
  paypalEmail?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  preview: string;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
] as const;

export const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Stripe', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '💰' },
] as const;