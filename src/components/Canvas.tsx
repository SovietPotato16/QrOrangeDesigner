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

// Modal para visualización 3D
const Tilt3DModal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Maneja el efecto tilt interactivo
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 12; // inclinación vertical
    const rotateY = ((x - centerX) / centerX) * -12; // inclinación horizontal
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 flex flex-col items-center">
        <button onClick={onClose} className="absolute top-2 right-2 bg-white rounded-full shadow p-2 hover:bg-gray-100 text-gray-700">✕</button>
        <div
          ref={cardRef}
          className="transition-transform duration-200 ease-out shadow-2xl rounded-xl bg-white"
          style={{ width: 400, height: 240, willChange: 'transform' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
        <div className="mt-4 text-white text-sm">Arrastra el mouse sobre la tarjeta para inspeccionar en 3D</div>
      </div>
    </div>
  );
};

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
  const [show3D, setShow3D] = useState(false);

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

  // Renderiza la tarjeta completa (canvas) para el modal 3D
  const renderCard = () => (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden"
      style={{ width, height, background }}
    >
      {elements.map(renderElement)}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );

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
          {/* Botón Visualizar en 3D */}
          <button
            onClick={() => setShow3D(true)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <span role="img" aria-label="3d">🕶️</span>
            Visualizar en 3D
          </button>
        </div>
      </div>
      {/* Responsive canvas container */}
      <div className="flex justify-center">
        <div className="relative canvas-container">
          <div
            ref={canvasRef}
            className="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white select-none mx-auto"
            style={{
              width: width,
              height: height,
              background: background,
              transform: 'scale(1)',
              transformOrigin: 'center',
            }}
            onClick={handleCanvasClick}
          >
            {elements.map(renderElement)}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            {width} × {height} px
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500">
        <p>Haz clic para seleccionar • Arrastra para mover • Doble clic en texto para editar</p>
      </div>
      {/* Modal 3D */}
      <Tilt3DModal open={show3D} onClose={() => setShow3D(false)}>
        {renderCard()}
      </Tilt3DModal>
    </div>
  );
};

export default Canvas;