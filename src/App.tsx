import React, { useCallback } from 'react';
import { useEditor } from './hooks/useEditor';
import QRInput from './components/QRInput';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertyPanel from './components/PropertyPanel';
import TemplateSelector from './components/TemplateSelector';
import { Template } from './types/editor';
import { Palette, QrCode } from 'lucide-react';

function App() {
  const {
    state,
    updateQRData,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    setBackground,
    loadTemplate,
    clearCanvas,
  } = useEditor();

  const handleAddElement = useCallback((type: 'text' | 'rectangle' | 'circle' | 'triangle' | 'qr') => {
    const id = `${type}-${Date.now()}`;
    
    // Calculate better default positions based on canvas center
    const centerX = state.canvasWidth / 2;
    const centerY = state.canvasHeight / 2;
    
    const baseElement = {
      id,
      type,
      x: centerX - 50, // Center horizontally with offset
      y: centerY - 30, // Center vertically with offset
    };

    switch (type) {
      case 'text':
        addElement({
          ...baseElement,
          type: 'text',
          content: 'Texto de ejemplo',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          fontFamily: 'Inter, sans-serif',
        });
        break;
      case 'rectangle':
        addElement({
          ...baseElement,
          type: 'rectangle',
          width: 100,
          height: 60,
          color: '#3b82f6',
          borderColor: '#000000',
          borderWidth: 0,
        });
        break;
      case 'circle':
        addElement({
          ...baseElement,
          type: 'circle',
          width: 80,
          height: 80,
          color: '#10b981',
          borderColor: '#000000',
          borderWidth: 0,
        });
        break;
      case 'triangle':
        addElement({
          ...baseElement,
          type: 'triangle',
          width: 60,
          height: 60,
          color: '#f59e0b',
          borderColor: '#000000',
          borderWidth: 0,
        });
        break;
      case 'qr':
        addElement({
          ...baseElement,
          x: centerX - 60, // Center QR code properly
          y: centerY - 60,
          type: 'qr',
          size: 120,
          qrData: state.qrData.text,
        });
        break;
    }
  }, [addElement, state.qrData.text]);

  const handleDuplicateElement = useCallback((id: string) => {
    const element = state.elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };
      addElement(newElement);
    }
  }, [state.elements, addElement]);

  const handleSelectTemplate = useCallback((template: Template) => {
    loadTemplate(template);
    // Immediately update QR elements with current QR data if available
    setTimeout(() => {
      if (state.qrData.text) {
        updateQRData(state.qrData.text);
      }
    }, 50);
  }, [loadTemplate, state.qrData.text, updateQRData]);

  const selectedElement = state.elements.find(el => el.id === state.selectedElement);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR OrangeDesigner</h1>
                <p className="text-sm text-gray-500">Crea tarjetas QR profesionales</p>
              </div>
            </div>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors"
            >
              Limpiar Canvas
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <QRInput
              onGenerateQR={updateQRData}
              currentText={state.qrData.text}
            />
            
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
            
            <Toolbar
              onAddElement={handleAddElement}
              selectedElement={state.selectedElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={handleDuplicateElement}
            />
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Canvas
              elements={state.elements}
              selectedElement={state.selectedElement}
              onSelectElement={selectElement}
              onUpdateElement={updateElement}
              background={state.background}
              width={state.canvasWidth}
              height={state.canvasHeight}
              qrCode={state.qrData.qrCode}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <PropertyPanel
              selectedElement={selectedElement || null}
              onUpdateElement={updateElement}
              onSetBackground={setBackground}
              currentBackground={state.background}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Desarrollado con ❤️ por{' '}
              <a 
                href="https://digitalorange.com.mx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                🍊 DigitalOrange.com.mx
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;