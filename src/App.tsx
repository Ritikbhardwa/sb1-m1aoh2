import React from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { Mic } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">VoiceInvoice</span>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <InvoiceForm />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 VoiceInvoice. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;