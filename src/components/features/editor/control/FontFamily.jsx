import React, { useState, useMemo, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiMinus, FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";

const FontFamily = ({ editor }) => {
  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Courier",
    "Georgia",
    "Verdana",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
  ];

  const dropdownRef = useRef(null);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [recentFonts, setRecentFonts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabel, setShowLabel] = useState(false);

  // Xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load recent fonts từ localStorage
  useEffect(() => {
    const savedRecentFonts = localStorage.getItem("recentFonts");
    if (savedRecentFonts) {
      setRecentFonts(JSON.parse(savedRecentFonts));
    }
  }, []);

  const filteredFonts = useMemo(() => {
    return fontFamilies.filter((font) =>
      font.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    setRecentFonts((prev) => {
      const updated = [font, ...prev.filter((f) => f !== font)].slice(0, 5);
      localStorage.setItem("recentFonts", JSON.stringify(updated));
      return updated;
    });
    editor.chain().focus().setFontFamily(font).run();
    setIsPopupOpen(false);
  };

  const getFontFamily = (editor) => {
    const fontFamily = editor.getAttributes("textStyle").fontFamily;
    return fontFamily || "Arial";
  };

  const clearRecentFonts = () => {
    setRecentFonts([]);
    localStorage.removeItem("recentFonts");
  };

  // Theo dõi thay đổi font
  useEffect(() => {
    const updateFontFamily = ({ editor }) => {
      setSelectedFont(getFontFamily(editor));
    };

    editor.on("selectionUpdate", updateFontFamily);
    editor.on("update", updateFontFamily);

    return () => {
      editor.off("selectionUpdate", updateFontFamily);
      editor.off("update", updateFontFamily);
    };
  }, [editor]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      <div className="relative w-28" ref={dropdownRef}>
        {/* Main Button */}
        <button
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className="w-full px-4 pr-1 py-2.5 text-left mt-0.5 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          style={{ fontFamily: selectedFont }}
          aria-haspopup="listbox"
          aria-expanded={isPopupOpen}
        >
          <span className="truncate w-24 text-gray-700">{selectedFont}</span>
          <IoMdArrowDropdown
            className={`text-gray-500 transition-transform duration-200 ${
              isPopupOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {/* Dropdown Panel */}
        {isPopupOpen && (
          <div className="absolute z-50 w-64 mt-2 bg-white rounded-lg shadow-lg animate-fadeIn border border-gray-200">
            {/* Search Box */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fonts..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            {/* Recent Fonts Section */}
            {recentFonts.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center justify-between px-2 mb-1">
                  <p className="text-xs font-medium text-gray-500">Recent</p>
                  <button
                    onClick={clearRecentFonts}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  >
                    <FiRefreshCw className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                {recentFonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontSelect(font)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200 text-gray-700"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
            {/* Font List */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-2">
              {filteredFonts.length > 0 ? (
                filteredFonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontSelect(font)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 rounded-md transition-colors duration-200 text-gray-700"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No fonts found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-1
          px-2 py-1 text-xs font-medium text-white
          bg-gray-800 rounded-md whitespace-nowrap
          transition-opacity duration-200
          ${showLabel ? "opacity-100" : "opacity-0 pointer-events-none"}
          z-20
        `}
      >
        Phông chữ
        {/* Mũi tên tooltip pointing upward */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default FontFamily;
