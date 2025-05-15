import ToolbarButton from "@/components/common/ToolbarButton";
import { Minus, Plus, RotateCcw, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const FontSize = ({ editor }) => {
  const [fontSize, setFontSize] = useState(16);
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const dropdownRef = useRef(null);

  const commonFontSizes = [8, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  const handleFontSizeChange = (delta) => {
    const newSize = fontSize + delta;
    if (newSize >= 8 && newSize <= 72) {
      setFontSize(newSize);
      editor?.chain().focus().setFontSize(newSize + "px").run();
    }
  };

  const handleDirectInput = (value) => {
    const newSize = parseInt(value);
    if (!isNaN(newSize) && newSize >= 8 && newSize <= 72) {
      setFontSize(newSize);
      editor?.chain().focus().setFontSize(newSize + "px").run();
    }
    setIsOpen(false);
  };

  const resetToDefault = () => {
    setFontSize(16);
    editor?.chain().focus().unsetFontSize().run();
  };

  const getFontSize = (editor) => {
    if (!editor) return '16px';
    const fontSize = editor.getAttributes('fontSize').size;
    return fontSize || '16px';
  };

  useEffect(() => {
    if (isOpen) {
      setShowLabel(false);
    }
  }, [isOpen, showLabel])

  useEffect(() => {
    if (!editor) return;

    const updateFontSize = ({ editor }) => {
      setFontSize(parseInt(getFontSize(editor).replace('px', '')));
    };

    editor.on('selectionUpdate', updateFontSize);

    return () => {
      editor.off('selectionUpdate', updateFontSize);
    };
  }, [editor]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1">
      <ToolbarButton 
        onClick={() => handleFontSizeChange(-2)}
        icon={Minus}
        label="Giảm cỡ chữ"
      />
      <div
        className="relative group"
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        <div className="relative min-w-[80px]" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-[80px] px-2 flex items-center justify-between bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <span className="text-sm font-medium text-gray-700">
              {fontSize}<span className="text-gray-400 ml-0.5">px</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {commonFontSizes.map((size) => (
                <button
                  key={size}
                  className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 focus:outline-none
                    ${fontSize === size ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => handleDirectInput(size)}
                >
                  {size}px
                </button>
              ))}
            </div>
          )}
        </div>
        <div 
          className={`
            absolute top-full left-1/2 -translate-x-1/2 mt-1
            px-2 py-1 text-xs font-medium text-white
            bg-gray-800 rounded-md whitespace-nowrap
            transition-opacity duration-200
            ${showLabel ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            z-20
          `}
        >
          Cỡ chữ
          {/* Mũi tên tooltip pointing upward */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
            <div className="border-4 border-transparent border-b-gray-800" />
          </div>
        </div>
      </div>
      <ToolbarButton 
        onClick={() => handleFontSizeChange(2)}
        icon={Plus}
        label="Giảm cỡ chữ"
      />
    </div>
  );
};

export default FontSize;