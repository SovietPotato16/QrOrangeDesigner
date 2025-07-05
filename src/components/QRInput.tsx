import React, { useState } from 'react';
import { QrCode, Link, Mail, Phone, Wifi } from 'lucide-react';

interface QRInputProps {
  onGenerateQR: (text: string) => void;
  currentText: string;
}

const QRInput: React.FC<QRInputProps> = ({ onGenerateQR, currentText }) => {
  const [text, setText] = useState(currentText);
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'email' | 'phone' | 'wifi'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerateQR(text.trim());
    }
  };

  const quickInserts = {
    text: { placeholder: 'Enter any text...', icon: QrCode },
    url: { placeholder: 'https://example.com', icon: Link },
    email: { placeholder: 'name@example.com', icon: Mail },
    phone: { placeholder: '+1234567890', icon: Phone },
    wifi: { placeholder: 'WIFI:S:NetworkName;T:WPA;P:password;;', icon: Wifi },
  };

  const currentInsert = quickInserts[activeTab];
  const Icon = currentInsert.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Generar Código QR</h3>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {Object.entries(quickInserts).map(([key, { icon: TabIcon }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TabIcon className="w-4 h-4" />
            {key === 'text' ? 'Texto' : 
             key === 'url' ? 'URL' : 
             key === 'email' ? 'Email' : 
             key === 'phone' ? 'Teléfono' : 
             key === 'wifi' ? 'WiFi' : key}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={currentInsert.placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Generar Código QR
        </button>
      </form>

      {text && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Vista previa: {text.substring(0, 100)}{text.length > 100 ? '...' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default QRInput;