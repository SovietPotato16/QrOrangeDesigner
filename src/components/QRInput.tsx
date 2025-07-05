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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex items-center gap-2 mb-2">
        <QrCode className="w-4 h-4 text-orange-600" />
        <h3 className="text-base font-semibold text-gray-900">Generar QR</h3>
      </div>

      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        {Object.entries(quickInserts).map(([key, { icon: TabIcon }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-1 px-1 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === key
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TabIcon className="w-3 h-3" />
            {key === 'text' ? 'Texto' : 
             key === 'url' ? 'URL' : 
             key === 'email' ? 'Email' : 
             key === 'phone' ? 'Teléfono' : 
             key === 'wifi' ? 'WiFi' : key}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <Icon className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={currentInsert.placeholder}
            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
            rows={2}
          />
        </div>
        
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full bg-orange-600 text-white py-1 px-2 rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          Generar QR
        </button>
      </form>

      {text && (
        <div className="mt-2 p-1 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">Vista previa: {text.substring(0, 50)}{text.length > 50 ? '...' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default QRInput;