export interface QRData {
  text: string;
  qrCode: string;
}

export interface TextElement {
  id: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: string;
  fontFamily: string;
}

export interface ShapeElement {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface QRElement {
  id: string;
  type: 'qr';
  x: number;
  y: number;
  size: number;
  qrData: string;
}

export type EditorElement = TextElement | ShapeElement | QRElement;

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  elements: EditorElement[];
  background: string;
  width: number;
  height: number;
}

export interface EditorState {
  elements: EditorElement[];
  selectedElement: string | null;
  qrData: QRData;
  background: string;
  canvasWidth: number;
  canvasHeight: number;
}