import React, { useRef, useState, useCallback } from 'react';
import { EditorElement, QRElement, TextElement, ShapeElement } from '../types/editor';
import { Download, Printer } from 'lucide-react';
import { exportCanvasAsImage } from '../utils/canvas-export';

interface CanvasProps {
  elements: EditorElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  background: string;
  width: number;
  height: number;
  qrCode: string;
}

interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startX: number;
  startY: number;
  elementStartX: number;
  elementStartY: number;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  background,
  width,
  height,
  qrCode,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
  });
  const [editingText, setEditingText] = useState<string | null>(null);

  const handleExport = async () => {
    if (canvasRef.current) {
      try {
        await exportCanvasAsImage(canvasRef.current, 'qr-card');
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Seleccionar el elemento inmediatamente al hacer clic
    onSelectElement(elementId);

    setDragState({
      isDragging: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      elementStartX: element.x,
      elementStartY: element.y,
    });
  }, [elements, onSelectElement]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;

    const newX = Math.max(0, Math.min(width - 50, dragState.elementStartX + deltaX));
    const newY = Math.max(0, Math.min(height - 50, dragState.elementStartY + deltaY));

    onUpdateElement(dragState.elementId, { x: newX, y: newY });
  }, [dragState, onUpdateElement, width, height]);

  const handleMouseUp = useCallback(() => {
    // Mantener la selección activa después del drag
    setDragState({
      isDragging: false,
      elementId: null,
      startX: 0,
      startY: 0,
      elementStartX: 0,
      elementStartY: 0,
    });
  }, []);

  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const handleTextDoubleClick = (elementId: string) => {
    onSelectElement(elementId);
    setEditingText(elementId);
  };

  const handleTextChange = (elementId: string, newContent: string) => {
    onUpdateElement(elementId, { content: newContent });
  };

  const handleTextBlur = (e: React.FocusEvent) => {
    e.stopPropagation();
    setEditingText(null);
    // Mantener la selección después de editar
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditingText(null);
      // Mantener la selección después de editar
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingText(null);
      // Mantener la selección después de cancelar
    }
  };

  // Manejar clic en el canvas para deseleccionar
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Solo deseleccionar si se hace clic directamente en el canvas
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  }, [onSelectElement]);

  // Manejar clic en elementos para seleccionar
  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectElement(elementId);
  }, [onSelectElement]);

  const renderElement = (element: EditorElement) => {
    const isSelected = selectedElement === element.id;
    const isDragging = dragState.isDragging && dragState.elementId === element.id;
    const baseClasses = `absolute cursor-pointer transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    } ${isDragging ? 'cursor-grabbing' : 'hover:shadow-lg'}`;

    switch (element.type) {
      case 'text':
        const textElement = element as TextElement;
        const isEditing = editingText === element.id;
        
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={{
              left: textElement.x,
              top: textElement.y,
              fontSize: textElement.fontSize,
              fontWeight: textElement.fontWeight,
              color: textElement.color,
              fontFamily: textElement.fontFamily,
              minWidth: '50px',
              zIndex: isSelected ? 10 : 1,
              userSelect: isEditing ? 'text' : 'none',
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => handleTextDoubleClick(element.id)}
            onClick={(e) => handleElementClick(e, element.id)}
          >
            {isEditing ? (
              <input
                type="text"
                value={textElement.content}
                onChange={(e) => handleTextChange(element.id, e.target.value)}
                onBlur={handleTextBlur}
                onKeyDown={handleTextKeyDown}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="bg-transparent border-none outline-none"
                style={{
                  fontSize: textElement.fontSize,
                  fontWeight: textElement.fontWeight,
                  color: textElement.color,
                  fontFamily: textElement.fontFamily,
                  width: 'auto',
                  minWidth: '100px',
                }}
              />
            ) : (
              <span 
                className="block w-full h-full"
                style={{ userSelect: 'none' }}
              >
                {textElement.content}
              </span>
            )}
          </div>
        );

      case 'qr':
        const qrElement = element as QRElement;
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={{
              left: qrElement.x,
              top: qrElement.y,
              width: qrElement.size,
              height: qrElement.size,
              zIndex: isSelected ? 10 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => handleElementClick(e, element.id)}
          >
            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code"
                className="w-full h-full object-contain pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-xs">Sin QR</p>
                  <p className="text-xs">Genera uno arriba</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'rectangle':
        const rectElement = element as ShapeElement;
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={{
              left: rectElement.x,
              top: rectElement.y,
              width: rectElement.width,
              height: rectElement.height,
              backgroundColor: rectElement.color,
              border: rectElement.borderWidth 
                ? `${rectElement.borderWidth}px solid ${rectElement.borderColor}` 
                : 'none',
              zIndex: isSelected ? 10 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => handleElementClick(e, element.id)}
          />
        );

      case 'circle':
        const circleElement = element as ShapeElement;
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={{
              left: circleElement.x,
              top: circleElement.y,
              width: circleElement.width,
              height: circleElement.height,
              backgroundColor: circleElement.color,
              borderRadius: '50%',
              border: circleElement.borderWidth 
                ? `${circleElement.borderWidth}px solid ${circleElement.borderColor}` 
                : 'none',
              zIndex: isSelected ? 10 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => handleElementClick(e, element.id)}
          />
        );

      case 'triangle':
        const triangleElement = element as ShapeElement;
        return (
          <div
            key={element.id}
            className={baseClasses}
            style={{
              left: triangleElement.x,
              top: triangleElement.y,
              width: 0,
              height: 0,
              borderLeft: `${triangleElement.width / 2}px solid transparent`,
              borderRight: `${triangleElement.width / 2}px solid transparent`,
              borderBottom: `${triangleElement.height}px solid ${triangleElement.color}`,
              zIndex: isSelected ? 10 : 1,
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onClick={(e) => handleElementClick(e, element.id)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Canvas</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          ref={canvasRef}
          className="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white select-none"
          style={{
            width: width,
            height: height,
            background: background,
          }}
          onClick={handleCanvasClick}
        >
          {elements.map(renderElement)}
          
          {/* Grid overlay for better positioning */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Haz clic para seleccionar • Arrastra para mover • Doble clic en texto para editar</p>
      </div>
    </div>
  );
};

export default Canvas;