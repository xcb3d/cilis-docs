import { useEffect, useRef, useState } from "react";

const ColorPickerModal = ({ isOpen, onClose, onSelect, initialColor = '#ff0000' }) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [rgb, setRgb] = useState({ r: 255, g: 0, b: 0 });
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(initialColor);
      setRgb(hexToRgb(initialColor));
    }
  }, [isOpen, initialColor]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const rgbValues = hexToRgb(color);
    setRgb(rgbValues);
  };

  const handleRgbChange = (channel, value) => {
    const newValue = Math.min(255, Math.max(0, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: newValue };
    setRgb(newRgb);
    setSelectedColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn text-black">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-[320px] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Tùy chỉnh màu</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Color Preview */}
          <div className="relative rounded-lg overflow-hidden shadow-inner">
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: selectedColor }}
            />
            <input 
              type="color" 
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-48 cursor-pointer opacity-0"
            />
          </div>

          {/* Color Inputs Section */}
          <div className="space-y-4">
            {/* Hex Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã màu (HEX)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">#</span>
                <input 
                  type="text" 
                  value={selectedColor.substring(1).toUpperCase()}
                  onChange={(e) => handleColorChange(`#${e.target.value}`)}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
              </div>
            </div>

            {/* RGB Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RGB</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'R', channel: 'r', color: 'red' },
                  { label: 'G', channel: 'g', color: 'green' },
                  { label: 'B', channel: 'b', color: 'blue' }
                ].map(({ label, channel, color }) => (
                  <div key={channel} className="relative">
                    <input 
                      type="number" 
                      min="0" 
                      max="255"
                      value={rgb[channel]}
                      onChange={(e) => handleRgbChange(channel, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                    <span className={`absolute -top-2 left-2 text-xs font-medium px-1 bg-white text-${color}-500`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Hủy
          </button>
          <button 
            onClick={() => {
              onSelect(selectedColor);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal