import React, { useState } from 'react';
import { Mic, MicOff, Save, Send, Download } from 'lucide-react';
import { useInvoiceStore } from '../store/invoiceStore';
import { CURRENCIES, PAYMENT_METHODS } from '../types';
import { InvoicePreview } from './InvoicePreview';
import { PaymentSetup } from './PaymentSetup';

export function InvoiceForm() {
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentSetup, setShowPaymentSetup] = useState(false);
  const { invoice, updateInvoice } = useInvoiceStore();

  const fields = [
    { id: 'clientName', label: 'Client Name', type: 'text' },
    { id: 'clientEmail', label: 'Client Email', type: 'email' },
    { id: 'amount', label: 'Invoice Amount', type: 'number' },
    { id: 'date', label: 'Invoice Date', type: 'date' },
    { id: 'description', label: 'Service Description', type: 'text' },
  ];

  const startListening = async (fieldId: string) => {
    try {
      setError(null);
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setCurrentField(fieldId);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        if (fieldId === 'amount') {
          const numericValue = transcript.replace(/[^0-9.]/g, '');
          updateInvoice({ [fieldId]: numericValue });
        } else {
          updateInvoice({ [fieldId]: transcript });
        }
      };

      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setCurrentField(null);
      };

      recognition.start();
    } catch (error) {
      setError(error.message);
      console.error('Speech recognition error:', error);
    }
  };

  const loadTestData = () => {
    updateInvoice({
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      amount: '20',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      description: 'Web Development Services',
    });
    setShowPreview(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice.paymentMethod) {
      setShowPaymentSetup(true);
    } else {
      setShowPreview(true);
    }
  };

  const handleSendInvoice = async () => {
    try {
      // Here you would integrate with your backend to send the invoice
      console.log('Sending invoice to:', invoice.clientEmail);
      // Show success message
      alert('Invoice sent successfully! 🎉');
    } catch (error) {
      setError('Failed to send invoice. Please try again.');
    }
  };

  const handleDownload = () => {
    // PDF download is handled by @react-pdf/renderer in InvoicePreview
    setShowPreview(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Invoice</h2>
          <button
            type="button"
            onClick={loadTestData}
            className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Load Test Data ($20)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Currency Selection */}
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={invoice.currency}
                onChange={(e) => updateInvoice({ currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {CURRENCIES.map(({ code, symbol }) => (
                  <option key={code} value={code}>
                    {code} ({symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="flex space-x-4">
              {PAYMENT_METHODS.map(({ id, name, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    updateInvoice({ paymentMethod: id as 'stripe' | 'paypal' });
                    setShowPaymentSetup(true);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                    invoice.paymentMethod === id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Other Fields */}
          {fields.map(({ id, label, type }) => (
            <div key={id} className="flex items-start space-x-4">
              <div className="flex-1">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={type}
                    id={id}
                    value={invoice[id] || ''}
                    onChange={(e) => updateInvoice({ [id]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {isListening && currentField === id && (
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-indigo-600 animate-pulse">
                      Listening...
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => startListening(id)}
                disabled={isListening}
                className={`mt-6 p-2 rounded-full ${
                  isListening && currentField === id
                    ? 'bg-red-100 text-red-600'
                    : 'bg-indigo-100 text-indigo-600'
                } hover:opacity-80 transition-opacity`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening && currentField === id ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Generate Invoice</span>
            </button>

            <button
              type="button"
              onClick={handleSendInvoice}
              disabled={!invoice.clientEmail}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              <span>Ship to Client 💸</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download 💻</span>
            </button>
          </div>
        </form>
      </div>

      {showPaymentSetup && (
        <PaymentSetup
          onClose={() => setShowPaymentSetup(false)}
          onComplete={() => {
            setShowPaymentSetup(false);
            setShowPreview(true);
          }}
        />
      )}

      {showPreview && (
        <div className="mt-8">
          <InvoicePreview />
        </div>
      )}
    </div>
  );
}