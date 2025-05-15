import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';



const FloatingMenu = ({ editor }) => {
  const [menuPosition, setMenuPosition] = useState(null);

  useEffect(() => {
    if (!editor) return;

    const handleSelection = () => {
      const selection = window.getSelection();
      
      if (selection && !selection.isCollapsed && editor.isEditable) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setMenuPosition({
          top: rect.top - 50,
          left: rect.left + (rect.width / 2) - 100
        });
      } else {
        setMenuPosition(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [editor]);

  if (!editor || !menuPosition) return null;

  return (
    <div 
      className="fixed z-50 bg-white shadow-lg rounded-lg p-1 flex gap-1 border border-gray-200
        animate-in fade-in duration-200 ease-out"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 
          ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200
          ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200
          ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-200 mx-1" />
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200
          ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200
          ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200
          ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FloatingMenu;