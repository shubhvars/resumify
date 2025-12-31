'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Bold,
    Italic,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Plus,
    Trash2,
    Undo,
    Redo,
    Type,
} from 'lucide-react';

interface EditingToolbarProps {
    onFontFamilyChange: (font: string) => void;
    onFontSizeChange: (size: number) => void;
    onBoldToggle: () => void;
    onItalicToggle: () => void;
    onColorChange: (color: string) => void;
    onAlignChange: (align: 'left' | 'center' | 'right') => void;
    onAddText: () => void;
    onDeleteSelected: () => void;
    onUndo: () => void;
    onRedo: () => void;
    selectedFont: string;
    selectedSize: number;
    selectedColor: string;
    isBold: boolean;
    isItalic: boolean;
    canUndo: boolean;
    canRedo: boolean;
    hasSelection: boolean;
}

const FONT_OPTIONS = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
];

const FONT_SIZES = [8, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export default function EditingToolbar({
    onFontFamilyChange,
    onFontSizeChange,
    onBoldToggle,
    onItalicToggle,
    onColorChange,
    onAlignChange,
    onAddText,
    onDeleteSelected,
    onUndo,
    onRedo,
    selectedFont,
    selectedSize,
    selectedColor,
    isBold,
    isItalic,
    canUndo,
    canRedo,
    hasSelection,
}: EditingToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-card border rounded-lg shadow-sm">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Font Family */}
            <div className="flex items-center gap-2">
                <Select value={selectedFont} onValueChange={onFontFamilyChange}>
                    <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                                <span style={{ fontFamily: font.value }}>{font.label}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
                <Select
                    value={selectedSize.toString()}
                    onValueChange={(v) => onFontSizeChange(parseInt(v))}
                >
                    <SelectTrigger className="w-[70px] h-8">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_SIZES.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Bold/Italic */}
            <div className="flex items-center gap-1">
                <Button
                    variant={isBold ? 'default' : 'ghost'}
                    size="icon"
                    onClick={onBoldToggle}
                    title="Bold"
                    className="h-8 w-8"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant={isItalic ? 'default' : 'ghost'}
                    size="icon"
                    onClick={onItalicToggle}
                    title="Italic"
                    className="h-8 w-8"
                >
                    <Italic className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Text Color */}
            <div className="flex items-center gap-2">
                <Label htmlFor="text-color" className="sr-only">
                    Text Color
                </Label>
                <div className="relative">
                    <Input
                        id="text-color"
                        type="color"
                        value={selectedColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-8 h-8 p-0 border-0 cursor-pointer"
                        title="Text Color"
                    />
                </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Alignment */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAlignChange('left')}
                    title="Align Left"
                    className="h-8 w-8"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAlignChange('center')}
                    title="Align Center"
                    className="h-8 w-8"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAlignChange('right')}
                    title="Align Right"
                    className="h-8 w-8"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Add/Delete */}
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddText}
                    title="Add Text"
                    className="h-8"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Text
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDeleteSelected}
                    disabled={!hasSelection}
                    title="Delete Selected"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
