import React, { useState, useRef, useEffect } from 'react';
import ColorPickerModal from '@/components/common/ColorPickerModal';

const TextColorPicker = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showModal, setShowModal] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const dropdownRef = useRef(null);
  const MAX_RECENT_COLORS = 10;
  
  const defaultColors = [
    [
      { color: '#000000', label: 'Black' },
      { color: '#404040', label: 'Dark Gray' },
      { color: '#808080', label: 'Gray' },
      { color: '#C0C0C0', label: 'Silver' },
      { color: '#FFFFFF', label: 'White' },
      { color: '#E6E6E6', label: 'Light Gray' },
      { color: '#CCCCCC', label: 'Light Gray 2' },
      { color: '#0000FF', label: 'Blue' },
      { color: '#800080', label: 'Purple' },
      { color: '#FF00FF', label: 'Magenta' }
    ],
    [
      { color: '#FFC0CB', label: 'Light Pink' },
      { color: '#FFE4E1', label: 'Powder Pink' },
      { color: '#FFFACD', label: 'Light Yellow' },
      { color: '#F0FFF0', label: 'Light Green' },
      { color: '#E0FFFF', label: 'Light Blue' },
      { color: '#E6E6FA', label: 'Light Purple' },
      { color: '#B0C4DE', label: 'Light Steel Blue' },
      { color: '#ADD8E6', label: 'Light Blue' },
      { color: '#DDA0DD', label: 'Plum' },
      { color: '#EE82EE', label: 'Violet' }
    ],
    [
      { color: '#CD5C5C', label: 'Brown Red' },
      { color: '#F08080', label: 'Coral Red' },
      { color: '#FFD700', label: 'Yellow' },
      { color: '#90EE90', label: 'Light Green' },
      { color: '#98FB98', label: 'Mint Green' },
      { color: '#87CEEB', label: 'Sky Blue' },
      { color: '#6495ED', label: 'Cornflower Blue' },
      { color: '#4682B4', label: 'Steel Blue' },
      { color: '#483D8B', label: 'Dark Blue' },
      { color: '#9370DB', label: 'Medium Purple' }
    ],
    [
      { color: '#8B0000', label: 'Dark Red' },
      { color: '#A52A2A', label: 'Brown' },
      { color: '#DAA520', label: 'Dark Yellow' },
      { color: '#006400', label: 'Dark Green' },
      { color: '#008000', label: 'Green' },
      { color: '#0000CD', label: 'Dark Blue' },
      { color: '#000080', label: 'Navy Blue' },
      { color: '#4B0082', label: 'Indigo' },
      { color: '#800080', label: 'Dark Purple' },
      { color: '#8B008B', label: 'Red Purple' }
    ]
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToRecentColors = (color) => {
    setRecentColors(prevColors => {
      const newColors = prevColors.filter(c => c !== color);
      return [color, ...newColors].slice(0, MAX_RECENT_COLORS);
    });
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    addToRecentColors(color);
    editor.chain().focus().setColor(color).run();
    setIsOpen(false);
  };

  const handleModalColorSelect = (color) => {
    setSelectedColor(color);
    addToRecentColors(color);
    editor.chain().focus().setColor(color).run();
  };

  useEffect(() => {
    const updateColor = () => {
      const color = editor.getAttributes('textStyle').color || '#000000';
      setSelectedColor(color);
    };

    editor.on('selectionUpdate', updateColor);
    editor.on('focus', updateColor);

    return () => {
      editor.off('selectionUpdate', updateColor);
      editor.off('focus', updateColor);
    };
  }, [editor]);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button 
        className="relative flex flex-col items-center pl-1 pr-1 pb-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Choose text color"
      >
        {/* Text Color Icon */}
        <div className="flex items-center justify-center w-6 h-6">
          <span className="text-lg font-bold text-black">A</span>
        </div>
        {/* Color Indicator */}
        <div 
          className="w-full h-1 rounded-sm"
          style={{ backgroundColor: selectedColor }}
        />
        
        {/* Tooltip for main button */}
        <div 
          className={`
            absolute top-full left-1/2 -translate-x-1/2 mt-1
            px-2 py-1 text-xs font-medium text-white
            bg-gray-800 rounded-md whitespace-nowrap
            transition-opacity duration-200
            ${isOpen ? 'opacity-0 pointer-events-none' : 'group-hover:opacity-100 opacity-0'}
            z-20
          `}
        >
          Text Color
          {/* Tooltip arrow */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
            <div className="border-4 border-transparent border-b-gray-800" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 p-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[250px] max-h-[400px] z-50 animate-fadeIn">
          {/* Default Color Grid */}
          <div className="flex flex-col gap-1">
            {defaultColors.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map(({ color, label }) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-200 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 group relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                  >
                    {/* Tooltip for each color */}
                    <div 
                      className={`
                        absolute bottom-full left-1/2 -translate-x-1/2 mt-1
                        px-2 py-1 text-xs font-medium text-white
                        bg-gray-800 rounded-md whitespace-nowrap
                        transition-opacity duration-200
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        z-20
                      `}
                    >
                      {label}
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 z-20">
                        <div className="border-4 border-transparent border-t-gray-800" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-3" />
          
          {/* Custom Color Button */}
          <button 
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              setShowModal(true);
              setIsOpen(false);
            }}
          >
            <span className="text-lg">+</span>
            Custom
          </button>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <>
              <div className="h-px bg-gray-200 my-3" />
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">Recent Colors</div>
                <div className="flex flex-wrap gap-1">
                  {recentColors.map((color, index) => (
                    <button
                      key={`recent-${index}`}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-200 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorClick(color)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <ColorPickerModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleModalColorSelect}
        initialColor={selectedColor}
      />
    </div>
  );
};

export default TextColorPicker;
