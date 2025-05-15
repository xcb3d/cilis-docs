import React, { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const Heading = ({ editor }) => {
  const headingOptions = [
    { label: "Văn bản thường", value: "paragraph" },  
    { label: "Tiêu đề 1", value: "h1" },
    { label: "Tiêu đề 2", value: "h2" },
    { label: "Tiêu đề 3", value: "h3" },
    { label: "Tiêu đề 4", value: "h4" },
    { label: "Tiêu đề 5", value: "h5" },
    { label: "Tiêu đề 6", value: "h6" },
  ];
  
  const dropdownRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState("paragraph");
  const [showTooltip, setShowTooltip] = useState(false);

  // Xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHeadingSelect = (type) => {
    if (type === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(type.slice(1)) }).run();
    }
    setSelectedHeading(type);
    setIsPopupOpen(false);
  };

  // Theo dõi thay đổi heading
  useEffect(() => {
    const updateHeading = ({ editor }) => {
      headingOptions.forEach(({ value }) => {
        if (value === "paragraph") {
          if (editor.isActive("paragraph")) {
            setSelectedHeading("paragraph");
          }
        } else {
          const level = parseInt(value.slice(1));
          if (editor.isActive("heading", { level })) {
            setSelectedHeading(value);
          }
        }
      });
    };

    editor.on('selectionUpdate', updateHeading);
    editor.on('update', updateHeading);

    return () => {
      editor.off('selectionUpdate', updateHeading);
      editor.off('update', updateHeading);
    };
  }, [editor]);

  const getCurrentHeadingLabel = () => {
    const option = headingOptions.find(opt => opt.value === selectedHeading);
    return option ? option.label : "Văn bản thường";
  };

  return (
    <div 
      className="relative w-40 bor"
      ref={dropdownRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Button */}
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="w-full px-4 pr-1 py-2.5 text-left mt-0.5 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-haspopup="listbox"
        aria-expanded={isPopupOpen}
      >
        <span className="truncate w-32 text-gray-700">
          {getCurrentHeadingLabel()}
        </span>
        <IoMdArrowDropdown
          className={`text-gray-500 transition-transform duration-200 ${
            isPopupOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Tooltip */}
      <div 
        className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-1
          px-2 py-1 text-xs font-medium text-white
          bg-gray-800 rounded-md whitespace-nowrap
          transition-opacity duration-200
          ${showTooltip && !isPopupOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          z-20
        `}
      >
        Định dạng tiêu đề
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>

      {/* Dropdown Panel */}
      {isPopupOpen && (
        <div className="absolute z-50 w-40 mt-2 bg-white rounded-lg shadow-lg animate-fadeIn border border-gray-200">
          <div className="py-1">
            {headingOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleHeadingSelect(value)}
                className={`w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors duration-200 ${
                  selectedHeading === value ? 'bg-gray-100' : ''
                }`}
              >
                {value === "paragraph" ? (
                  <span className="text-base">{label}</span>
                ) : (
                  <span className={`text-${value}`}>{label}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Heading;
