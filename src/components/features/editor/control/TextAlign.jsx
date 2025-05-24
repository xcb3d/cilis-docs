import React, { useState, useRef, useEffect } from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import ToolbarButton from "@/components/common/ToolbarButton";

const TextAlign = ({ editor }) => {
  const alignOptions = [
    { label: "Left align", value: "left", icon: AlignLeft },
    { label: "Center align", value: "center", icon: AlignCenter },
    { label: "Right align", value: "right", icon: AlignRight },
    { label: "Justify", value: "justify", icon: AlignJustify },
  ];

  const popupRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAlign, setSelectedAlign] = useState("left");

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAlignSelect = (align) => {
    editor.chain().focus().setTextAlign(align).run();
    setSelectedAlign(align);
    setIsPopupOpen(false);
  };

  // Track text align changes
  useEffect(() => {
    const updateAlign = ({ editor }) => {
      alignOptions.forEach(({ value }) => {
        if (editor.isActive({ textAlign: value })) {
          setSelectedAlign(value);
        }
      });
    };

    editor.on('selectionUpdate', updateAlign);
    editor.on('update', updateAlign);

    return () => {
      editor.off('selectionUpdate', updateAlign);
      editor.off('update', updateAlign);
    };
  }, [editor]);

  const CurrentIcon = alignOptions.find(opt => opt.value === selectedAlign)?.icon;

  return (
    <div className="relative" ref={popupRef}>
      {/* Main Button */}
      <ToolbarButton
        icon={CurrentIcon}
        label="Text alignment"
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        active={isPopupOpen}
        size="md"
      />

      {/* Popup Panel */}
      {isPopupOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex">
          {alignOptions.map(({ label, value, icon: Icon }) => (
            <ToolbarButton
              key={value}
              icon={Icon}
              label={label}
              onClick={() => handleAlignSelect(value)}
              active={selectedAlign === value}
              size="md"
              variant="minimal"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TextAlign;
