import React, { useState } from 'react';
import { useInvoiceStore } from '../store/invoiceStore';

interface PaymentSetupProps {
  onClose: () => void;
  onComplete: () => void;
}

export function PaymentSetup({ onClose, onComplete }: PaymentSetupProps) {
  const { invoice, updateInvoice } = useInvoiceStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (invoice.paymentMethod === 'stripe' && !invoice.stripeAccountId) {
      setError('Please enter your Stripe Account ID');
      return;
    }

    if (invoice.paymentMethod === 'paypal' && !invoice.paypalEmail) {
      setError('Please enter your PayPal email');
      return;
    }

    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          Setup {invoice.paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'} Payment
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {invoice.paymentMethod === 'stripe' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stripe Account ID
              </label>
              <input
                type="text"
                value={invoice.stripeAccountId || ''}
                onChange={(e) => updateInvoice({ stripeAccountId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="acct_..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PayPal Email
              </label>
              <input
                type="email"
                value={invoice.paypalEmail || ''}
                onChange={(e) => updateInvoice({ paypalEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your@email.com"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}