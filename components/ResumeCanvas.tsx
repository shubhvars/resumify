'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

// Types for OCR data
interface TextBlock {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontWeight?: string;
    type?: string;
}

interface OCRData {
    pageWidth: number;
    pageHeight: number;
    textBlocks: TextBlock[];
}

interface ResumeCanvasProps {
    ocrData: OCRData | null;
    onSelectionChange: (hasSelection: boolean, selectedObject: any) => void;
}

// Canvas handle type for external access
export interface CanvasHandle {
    addText: (text?: string) => void;
    deleteSelected: () => void;
    updateStyle: (property: string, value: any) => void;
    exportToPDF: () => Promise<Blob>;
    getCanvas: () => any;
}

const ResumeCanvas = forwardRef<CanvasHandle, ResumeCanvasProps>(({
    ocrData,
    onSelectionChange,
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<any>(null);
    const fabricModule = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const initRef = useRef(false);

    // Load Fabric.js and initialize canvas ONCE
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        import('fabric').then((mod) => {
            fabricModule.current = mod;

            if (!canvasRef.current) return;

            const { Canvas } = mod;

            // Use 1000x1100 to match OCR coordinate system (wide format)
            const canvas = new Canvas(canvasRef.current, {
                width: 1000,
                height: 1100,
                backgroundColor: '#ffffff',
                selection: true,
            });

            fabricCanvasRef.current = canvas;

            // Selection events
            canvas.on('selection:created', (e: any) => {
                onSelectionChange(true, e.selected?.[0] || null);
            });

            canvas.on('selection:updated', (e: any) => {
                onSelectionChange(true, e.selected?.[0] || null);
            });

            canvas.on('selection:cleared', () => {
                onSelectionChange(false, null);
            });

            setIsReady(true);
            console.log('Canvas initialized successfully');
        });

        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
    }, []); // Empty deps - only run once

    // Load OCR data onto canvas when data changes
    useEffect(() => {
        if (!fabricCanvasRef.current || !ocrData || !fabricModule.current || !isReady) return;

        const { IText } = fabricModule.current;
        const canvas = fabricCanvasRef.current;

        // Clear existing objects
        canvas.clear();
        canvas.backgroundColor = '#ffffff';

        // Scale factor - canvas is 850x1100, OCR uses same
        const scaleX = canvas.width / ocrData.pageWidth;
        const scaleY = canvas.height / ocrData.pageHeight;

        console.log('Loading', ocrData.textBlocks.length, 'text blocks. Scale:', scaleX, scaleY);

        // Add each text block
        ocrData.textBlocks.forEach((block: any) => {
            const scaledFontSize = Math.max(10, block.fontSize * Math.min(scaleX, scaleY));

            const text = new IText(block.text, {
                left: block.x * scaleX,
                top: block.y * scaleY,
                fontSize: scaledFontSize,
                fontFamily: 'Arial',
                fontWeight: block.fontWeight === 'bold' ? 'bold' : 'normal',
                fill: '#000000',
                textAlign: block.textAlign || 'left',
                editable: true,
                selectable: true,
                hasControls: true,
                hasBorders: true,
                lockUniScaling: false,
                cornerColor: '#6366f1',
                cornerStyle: 'circle',
                cornerSize: 8,
                transparentCorners: false,
                borderColor: '#6366f1',
                borderScaleFactor: 2,
            });

            canvas.add(text);
        });

        canvas.renderAll();
        console.log('Canvas rendered with text blocks');
    }, [ocrData, isReady]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        addText: (text = 'New Text') => {
            if (!fabricCanvasRef.current || !fabricModule.current) return;
            const { IText } = fabricModule.current;
            const canvas = fabricCanvasRef.current;

            const newText = new IText(text, {
                left: 100,
                top: 100,
                fontSize: 16,
                fontFamily: 'Arial',
                fill: '#000000',
                editable: true,
                selectable: true,
                hasControls: true,
                hasBorders: true,
                cornerColor: '#6366f1',
                cornerStyle: 'circle',
                cornerSize: 8,
                transparentCorners: false,
                borderColor: '#6366f1',
            });

            canvas.add(newText);
            canvas.setActiveObject(newText);
            canvas.renderAll();
        },

        deleteSelected: () => {
            if (!fabricCanvasRef.current) return;
            const canvas = fabricCanvasRef.current;
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
                canvas.renderAll();
            }
        },

        updateStyle: (property: string, value: any) => {
            if (!fabricCanvasRef.current) return;
            const canvas = fabricCanvasRef.current;
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.set(property, value);
                canvas.renderAll();
            }
        },

        exportToPDF: async () => {
            if (!fabricCanvasRef.current) {
                throw new Error('Canvas not initialized');
            }

            const canvas = fabricCanvasRef.current;

            // Get canvas as data URL
            const dataUrl = canvas.toDataURL({
                format: 'png',
                quality: 1,
                multiplier: 2,
            });

            // Dynamic import jsPDF
            const { jsPDF } = await import('jspdf');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(
                dataUrl,
                'PNG',
                0,
                0,
                canvas.width,
                canvas.height
            );

            return pdf.output('blob');
        },

        getCanvas: () => fabricCanvasRef.current,
    }), []);

    return (
        <div className="relative border rounded-lg overflow-auto shadow-lg bg-gray-100 p-4" style={{ maxHeight: '80vh' }}>
            <div className="bg-white shadow-xl mx-auto" style={{ width: 1000, height: 1100 }}>
                <canvas ref={canvasRef} />
            </div>
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="text-muted-foreground">Loading editor...</div>
                </div>
            )}
        </div>
    );
});

ResumeCanvas.displayName = 'ResumeCanvas';

export default ResumeCanvas;
