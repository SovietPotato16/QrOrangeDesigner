import { useState, useCallback } from 'react';
import { EditorState, EditorElement, QRData } from '../types/editor';
import { generateQRCode } from '../utils/qr-generator';
import { defaultTemplates } from '../data/templates';

// Usar la primera plantilla (Minimalist White) como estado inicial
const defaultTemplate = defaultTemplates[0];
const initialState: EditorState = {
  elements: defaultTemplate.elements,
  selectedElement: null,
  qrData: { text: '', qrCode: '' },
  background: defaultTemplate.background,
  canvasWidth: defaultTemplate.width,
  canvasHeight: defaultTemplate.height,
};

export const useEditor = () => {
  const [state, setState] = useState<EditorState>(initialState);

  const updateQRData = useCallback(async (text: string) => {
    try {
      const qrCode = await generateQRCode(text);
      setState(prev => {
        const updatedElements = prev.elements.map(element => 
          element.type === 'qr' 
            ? { ...element, qrData: text }
            : element
        );
        
        return {
          ...prev,
          qrData: { text, qrCode },
          elements: updatedElements,
        };
      });
    } catch (error) {
      console.error('Failed to update QR data:', error);
    }
  }, []);

  const addElement = useCallback((element: EditorElement) => {
    setState(prev => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<EditorElement>) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(element =>
        element.id === id ? { ...element, ...updates } : element
      ),
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.filter(element => element.id !== id),
      selectedElement: prev.selectedElement === id ? null : prev.selectedElement,
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedElement: id,
    }));
  }, []);

  const setBackground = useCallback((background: string) => {
    setState(prev => ({
      ...prev,
      background,
    }));
  }, []);

  const loadTemplate = useCallback((template: any) => {
    setState(prev => ({
      ...prev,
      elements: template.elements,
      background: template.background,
      canvasWidth: template.width,
      canvasHeight: template.height,
    }));
  }, []);

  const clearCanvas = useCallback(() => {
    setState(prev => ({
      ...prev,
      elements: [],
      selectedElement: null,
    }));
  }, []);

  return {
    state,
    updateQRData,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    setBackground,
    loadTemplate,
    clearCanvas,
  };
};