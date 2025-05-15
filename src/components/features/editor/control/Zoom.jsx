import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const Zoom = ({ editor }) => {
  const ZOOM_LEVELS = [75, 100, 125];
  const [currentZoom, setCurrentZoom] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const dropdownRef = useRef(null);

  // Hàm để lưu giá trị zoom vào localStorage
  const saveZoomToLocalStorage = useCallback((zoom) => {
    localStorage.setItem('currentZoom', zoom.toString());
  }, []);

  const handleZoomChange = useCallback(
    (newZoom) => {
      if (!editor) return;
      setCurrentZoom(newZoom);
      editor.commands.setZoom(newZoom);
      const editorElement = editor.options.element;
      if (editorElement) {
        editorElement.style.transform = `scale(${newZoom / 100})`;
        editorElement.style.transformOrigin = "center top";
      }
      setIsOpen(false);
      saveZoomToLocalStorage(newZoom);
    },
    [editor, saveZoomToLocalStorage]
  );

  const zoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(currentZoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      handleZoomChange(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const zoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(currentZoom);
    if (currentIndex > 0) {
      handleZoomChange(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleKeyboard = useCallback((e) => {
    if (e.ctrlKey) {
      if (e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
    }
  }, [currentZoom]);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Đọc giá trị zoom từ localStorage khi component được khởi tạo
  useEffect(() => {
    const savedZoom = localStorage.getItem('currentZoom');
    if (savedZoom && ZOOM_LEVELS.includes(parseInt(savedZoom, 10))) {
      setCurrentZoom(parseInt(savedZoom, 10));
      handleZoomChange(parseInt(savedZoom, 10)); // Đảm bảo zoom được áp dụng ngay lập tức
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowLabel(false);
    }
  }, [isOpen]);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {/* Zoom Button */}
      <div className="relative min-w-[80px]" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-[80px] px-2 flex items-center justify-between bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-sm font-medium text-gray-700">
            {currentZoom}<span className="text-gray-400 ml-0.5">%</span>
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {ZOOM_LEVELS.map((size) => (
              <button
                key={size}
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 focus:outline-none
                  ${currentZoom === size ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                onClick={() => handleZoomChange(size)}
                role="option"
                aria-selected={currentZoom === size}
              >
                {size}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Label Tooltip - Now positioned below */}
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
        Thu phóng
        {/* Mũi tên tooltip pointing upward */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default Zoom;