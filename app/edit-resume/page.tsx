'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Upload,
    FileImage,
    Loader2,
    Download,
    RefreshCw,
    Sparkles,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import ResumeCanvas, { CanvasHandle } from '@/components/ResumeCanvas';
import EditingToolbar from '@/components/EditingToolbar';

interface OCRData {
    pageWidth: number;
    pageHeight: number;
    textBlocks: {
        text: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fontSize: number;
        fontWeight?: string;
        type?: string;
    }[];
}

type EditorState = 'upload' | 'processing' | 'editing' | 'error';

// Load PDF.js from CDN
function loadPdfJs(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if ((window as any).pdfjsLib) {
            resolve((window as any).pdfjsLib);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            const pdfjsLib = (window as any).pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(pdfjsLib);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Convert PDF to image using PDF.js from CDN
async function pdfToImage(pdfFile: File): Promise<Blob> {
    const pdfjsLib = await loadPdfJs();

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1); // Get first page

    // Scale for good quality
    const scale = 2;
    const viewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render PDF page to canvas
    await page.render({
        canvasContext: context,
        viewport: viewport,
    }).promise;

    // Convert to blob
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob!);
        }, 'image/png', 1.0);
    });
}

export default function EditResumePage() {
    const [state, setState] = useState<EditorState>('upload');
    const [ocrData, setOcrData] = useState<OCRData | null>(null);
    const [error, setError] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [processingStep, setProcessingStep] = useState('');

    // Canvas ref
    const canvasRef = useRef<CanvasHandle>(null);
    const [hasSelection, setHasSelection] = useState(false);
    const [selectedObject, setSelectedObject] = useState<any>(null);

    // Toolbar state
    const [selectedFont, setSelectedFont] = useState('Arial');
    const [selectedSize, setSelectedSize] = useState(16);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    // Handle file upload
    const handleFileUpload = useCallback(async (file: File) => {
        setUploadedFile(file);
        setState('processing');
        setError('');

        try {
            let imageBlob: Blob;

            // Check if it's a PDF
            if (file.type === 'application/pdf') {
                setProcessingStep('Converting PDF to image...');
                imageBlob = await pdfToImage(file);
            } else {
                imageBlob = file;
            }

            setProcessingStep('Extracting text with AI vision...');

            // Create form data with the image
            const formData = new FormData();
            formData.append('file', imageBlob, file.type === 'application/pdf' ? 'converted.png' : file.name);

            const response = await fetch('/api/vision-ocr', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to process image');
            }

            console.log('OCR Result:', result.data);
            setOcrData(result.data);
            setState('editing');
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Failed to process file');
            setState('error');
        }
    }, []);

    // Handle drag and drop
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileUpload(file);
            }
        },
        [handleFileUpload]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    // Handle file input
    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFileUpload(file);
            }
        },
        [handleFileUpload]
    );

    // Selection change callback
    const handleSelectionChange = useCallback(
        (hasSelection: boolean, selected: any) => {
            setHasSelection(hasSelection);
            setSelectedObject(selected);

            if (selected) {
                setSelectedFont(selected.fontFamily || 'Arial');
                setSelectedSize(selected.fontSize || 16);
                setSelectedColor(selected.fill || '#000000');
                setIsBold(selected.fontWeight === 'bold');
                setIsItalic(selected.fontStyle === 'italic');
            }
        },
        []
    );

    // Toolbar handlers
    const handleFontFamilyChange = useCallback((font: string) => {
        setSelectedFont(font);
        canvasRef.current?.updateStyle('fontFamily', font);
    }, []);

    const handleFontSizeChange = useCallback((size: number) => {
        setSelectedSize(size);
        canvasRef.current?.updateStyle('fontSize', size);
    }, []);

    const handleBoldToggle = useCallback(() => {
        const newBold = !isBold;
        setIsBold(newBold);
        canvasRef.current?.updateStyle('fontWeight', newBold ? 'bold' : 'normal');
    }, [isBold]);

    const handleItalicToggle = useCallback(() => {
        const newItalic = !isItalic;
        setIsItalic(newItalic);
        canvasRef.current?.updateStyle('fontStyle', newItalic ? 'italic' : 'normal');
    }, [isItalic]);

    const handleColorChange = useCallback((color: string) => {
        setSelectedColor(color);
        canvasRef.current?.updateStyle('fill', color);
    }, []);

    const handleAlignChange = useCallback((align: 'left' | 'center' | 'right') => {
        canvasRef.current?.updateStyle('textAlign', align);
    }, []);

    const handleAddText = useCallback(() => {
        canvasRef.current?.addText();
    }, []);

    const handleDeleteSelected = useCallback(() => {
        canvasRef.current?.deleteSelected();
        setHasSelection(false);
    }, []);

    // Export to PDF
    const handleExportPDF = useCallback(async () => {
        if (!canvasRef.current) return;

        setIsExporting(true);
        try {
            const blob = await canvasRef.current.exportToPDF();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited-resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export error:', err);
            setError('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    }, []);

    // Reset
    const handleReset = useCallback(() => {
        setState('upload');
        setOcrData(null);
        setUploadedFile(null);
        setError('');
        setHasSelection(false);
        setSelectedObject(null);
        setProcessingStep('');
    }, []);

    return (
        <div className="min-h-screen bg-background py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileImage className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Resume</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Upload a resume image or PDF and edit it directly. Export as PDF when done.
                    </p>
                </div>

                {/* Upload State */}
                {state === 'upload' && (
                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-8">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center hover:border-primary/60 transition-colors cursor-pointer bg-primary/5"
                            >
                                <input
                                    type="file"
                                    accept="image/*,.pdf,application/pdf"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Drop your resume here
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        or click to browse files
                                    </p>
                                    <div className="flex gap-2 justify-center">
                                        <Badge variant="outline">PDF</Badge>
                                        <Badge variant="outline">PNG</Badge>
                                        <Badge variant="outline">JPG</Badge>
                                        <Badge variant="outline">WEBP</Badge>
                                    </div>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Processing State */}
                {state === 'processing' && (
                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="p-12 text-center">
                            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                            <h3 className="text-lg font-semibold mb-2">Processing your resume...</h3>
                            <p className="text-muted-foreground">
                                {processingStep || 'Extracting text and layout using AI vision'}
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>Powered by Gemini Vision</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Error State */}
                {state === 'error' && (
                    <Card className="max-w-2xl mx-auto border-destructive/50">
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Processing Failed</h3>
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <Button onClick={handleReset} variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Editing State */}
                {state === 'editing' && (
                    <div className="space-y-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <EditingToolbar
                                onFontFamilyChange={handleFontFamilyChange}
                                onFontSizeChange={handleFontSizeChange}
                                onBoldToggle={handleBoldToggle}
                                onItalicToggle={handleItalicToggle}
                                onColorChange={handleColorChange}
                                onAlignChange={handleAlignChange}
                                onAddText={handleAddText}
                                onDeleteSelected={handleDeleteSelected}
                                onUndo={() => { }}
                                onRedo={() => { }}
                                selectedFont={selectedFont}
                                selectedSize={selectedSize}
                                selectedColor={selectedColor}
                                isBold={isBold}
                                isItalic={isItalic}
                                canUndo={false}
                                canRedo={false}
                                hasSelection={hasSelection}
                            />

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleReset}>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Start Over
                                </Button>
                                <Button onClick={handleExportPDF} disabled={isExporting} className="glow-primary">
                                    {isExporting ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    Download PDF
                                </Button>
                            </div>
                        </div>

                        {/* Canvas */}
                        <div className="flex justify-center">
                            <ResumeCanvas
                                ref={canvasRef}
                                ocrData={ocrData}
                                onSelectionChange={handleSelectionChange}
                            />
                        </div>

                        {/* Instructions */}
                        <div className="flex justify-center">
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    <span>Double-click to edit text</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    <span>Drag to move</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    <span>Corners to resize</span>
                                </div>
                            </div>
                        </div>

                        {/* Debug info */}
                        {ocrData && (
                            <div className="text-center text-sm text-muted-foreground">
                                Extracted {ocrData.textBlocks.length} text blocks from {uploadedFile?.type === 'application/pdf' ? 'PDF' : 'image'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
