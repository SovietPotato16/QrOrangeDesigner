import React from 'react';
import { EditorElement, TextElement, ShapeElement, QRElement } from '../types/editor';
import { Palette, Move, Maximize as Resize, Type as TypeIcon } from 'lucide-react';

interface PropertyPanelProps {
  selectedElement: EditorElement | null;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onSetBackground: (background: string) => void;
  currentBackground: string;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onSetBackground,
  currentBackground,
}) => {
  const backgroundColors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  ];

  const backgroundGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];

  const renderTextProperties = (element: TextElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido del Texto</label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdateElement(element.id, { content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de Fuente</label>
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => onUpdateElement(element.id, { fontSize: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="8"
            max="72"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Peso de Fuente</label>
          <select
            value={element.fontWeight}
            onChange={(e) => onUpdateElement(element.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="bold">Negrita</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color del Texto</label>
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdateElement(element.id, { color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
        />
      </div>
    </div>
  );

  const renderShapeProperties = (element: ShapeElement) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ancho</label>
          <input
            type="number"
            value={element.width}
            onChange={(e) => onUpdateElement(element.id, { width: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="10"
            max="400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alto</label>
          <input
            type="number"
            value={element.height}
            onChange={(e) => onUpdateElement(element.id, { height: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="10"
            max="400"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color de Relleno</label>
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdateElement(element.id, { color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Grosor del Borde</label>
        <input
          type="number"
          value={element.borderWidth || 0}
          onChange={(e) => onUpdateElement(element.id, { borderWidth: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="0"
          max="10"
        />
      </div>
      
      {(element.borderWidth || 0) > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color del Borde</label>
          <input
            type="color"
            value={element.borderColor || '#000000'}
            onChange={(e) => onUpdateElement(element.id, { borderColor: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>
      )}
    </div>
  );

  const renderQRProperties = (element: QRElement) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño del QR</label>
        <input
          type="number"
          value={element.size}
          onChange={(e) => onUpdateElement(element.id, { size: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min="50"
          max="300"
        />
      </div>
    </div>
  );

  const renderPositionProperties = (element: EditorElement) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Posición X</label>
          <input
            type="number"
            value={element.x}
            onChange={(e) => onUpdateElement(element.id, { x: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Posición Y</label>
          <input
            type="number"
            value={element.y}
            onChange={(e) => onUpdateElement(element.id, { y: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="240"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 min-h-[400px]">
      <h3 className="text-xl font-semibold text-gray-900 mb-5">Propiedades</h3>
      <div className="space-y-6">
        {/* Background Settings */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-purple-600" />
            <span className="font-medium text-gray-700 text-lg">Fondo</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {backgroundColors.map((color) => (
              <button
                key={color}
                onClick={() => onSetBackground(color)}
                className={`w-10 h-10 rounded-md border-2 transition-transform hover:scale-110 ${
                  currentBackground === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {backgroundGradients.map((gradient, index) => (
              <button
                key={index}
                onClick={() => onSetBackground(gradient)}
                className={`w-full h-8 rounded-md border-2 transition-transform hover:scale-105 ${
                  currentBackground === gradient ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                }`}
                style={{ background: gradient }}
              />
            ))}
          </div>
        </div>
        {/* Element Properties */}
        {selectedElement && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <TypeIcon className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-700 text-lg">Propiedades</span>
            </div>
            {selectedElement.type === 'text' && renderTextProperties(selectedElement as TextElement)}
            {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle' || selectedElement.type === 'triangle') && 
              renderShapeProperties(selectedElement as ShapeElement)}
            {selectedElement.type === 'qr' && renderQRProperties(selectedElement as QRElement)}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Resize className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-700 text-lg">Posición</span>
              </div>
              {renderPositionProperties(selectedElement)}
            </div>
          </div>
        )}
        {!selectedElement && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-base">Selecciona un elemento para ver sus propiedades</p>
            <p className="text-sm mt-2">Haz clic en cualquier elemento del canvas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;