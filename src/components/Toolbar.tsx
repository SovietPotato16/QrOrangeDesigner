import React from 'react';
import { Type, Square, Circle, Triangle, Trash2, Copy, Eye, EyeOff } from 'lucide-react';

interface ToolbarProps {
  onAddElement: (type: 'text' | 'rectangle' | 'circle' | 'triangle' | 'qr') => void;
  selectedElement: string | null;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddElement,
  selectedElement,
  onDeleteElement,
  onDuplicateElement,
}) => {
  const tools = [
    { id: 'text', icon: Type, label: 'Text', color: 'text-blue-600' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', color: 'text-green-600' },
    { id: 'circle', icon: Circle, label: 'Circle', color: 'text-purple-600' },
    { id: 'triangle', icon: Triangle, label: 'Triangle', color: 'text-orange-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Herramientas</h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {tools.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => onAddElement(id as any)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors group ${color}`}
            >
              <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-gray-700">
                {id === 'text' ? 'Texto' : 
                 id === 'rectangle' ? 'Rectángulo' : 
                 id === 'circle' ? 'Círculo' : 
                 id === 'triangle' ? 'Triángulo' : label}
              </span>
            </button>
          ))}
        </div>

        {selectedElement && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Elemento Seleccionado</p>
            <div className="flex gap-2">
              <button
                onClick={() => onDuplicateElement(selectedElement)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
              <button
                onClick={() => onDeleteElement(selectedElement)}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;