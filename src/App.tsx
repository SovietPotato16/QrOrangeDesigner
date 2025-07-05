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
          x: centerX - 80,
          y: centerY - 100,
          type: 'qr',
          size: 120,
          qrData: state.qrData.text,
        });
        break;
    }
  }, [addElement, state.qrData.text, state.canvasWidth, state.canvasHeight]);

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
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
            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors"
              >
                Limpiar Canvas
              </button>
              <a
                href="https://ko-fi.com/saulhinojosa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white border border-pink-400 shadow rounded-full text-pink-600 hover:bg-pink-50 hover:shadow-md transition-all text-sm font-semibold"
                style={{ boxShadow: '0 2px 12px 0 rgba(255, 0, 128, 0.10)' }}
                title="Apóyame en Ko-fi"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 3.5H6.5C4.01472 3.5 2 5.51472 2 8V13.5C2 15.9853 4.01472 18 6.5 18H12.5C12.5 19.3807 13.6193 20.5 15 20.5C16.3807 20.5 17.5 19.3807 17.5 18V18.5C19.9853 18.5 22 16.4853 22 14V8C22 5.51472 19.9853 3.5 17.5 3.5Z" stroke="#FF5E5B" strokeWidth="1.5"/><path d="M7.5 10.5C7.5 9.39543 8.39543 8.5 9.5 8.5C10.6046 8.5 11.5 9.39543 11.5 10.5C11.5 12.5 9.5 13.5 9.5 13.5C9.5 13.5 7.5 12.5 7.5 10.5Z" fill="#FF5E5B"/></svg>
                Ko-fi
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Improved responsive layout */}
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-2">
        {/* Mobile Layout (stacked) */}
        <div className="lg:hidden space-y-4">
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
          <PropertyPanel
            selectedElement={selectedElement || null}
            onUpdateElement={updateElement}
            onSetBackground={setBackground}
            currentBackground={state.background}
          />
        </div>

        {/* Desktop Layout (grid) */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(280px,340px)_1fr_minmax(280px,340px)] lg:gap-6">
          {/* Left Sidebar - Only Plantillas y Herramientas */}
          <div className="h-full flex flex-col space-y-6">
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
            <Toolbar
              onAddElement={handleAddElement}
              selectedElement={state.selectedElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={handleDuplicateElement}
            />
          </div>

          {/* QRInput arriba, Canvas abajo */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-lg">
              <QRInput
                onGenerateQR={updateQRData}
                currentText={state.qrData.text}
              />
            </div>
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

          {/* Right Sidebar - Properties */}
          <div className="h-full flex flex-col">
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
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Desarrollado con ❤️ por{' '}
              <a 
                href="https://digitalorange.com.mx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Digital Orange
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;