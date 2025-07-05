import html2canvas from 'html2canvas';

export const exportCanvasAsImage = async (
  canvasElement: HTMLElement,
  filename: string = 'qr-card'
): Promise<void> => {
  try {
    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting canvas:', error);
    throw new Error('Failed to export canvas as image');
  }
};

export const exportCanvasAsPDF = async (
  canvasElement: HTMLElement,
  filename: string = 'qr-card'
): Promise<void> => {
  try {
    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = imgData;
    link.click();
  } catch (error) {
    console.error('Error exporting canvas as PDF:', error);
    throw new Error('Failed to export canvas as PDF');
  }
};