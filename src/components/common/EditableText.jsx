'use client';
import { useState, useEffect } from 'react';

const EditableText = ({ initialText, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [debouncedText, setDebouncedText] = useState(initialText);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== initialText) {
        // Chỉ gọi onUpdate khi không trong trạng thái chỉnh sửa hoặc khi có nội dung
        if (!isEditing || (isEditing && text?.trim())) {
          setDebouncedText(text);
          onUpdate(text);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [text, initialText, onUpdate, isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    
    // Kiểm tra và xử lý văn bản rỗng ngay lập tức khi thoát khỏi chế độ chỉnh sửa
    if (!text?.trim()) {
      const defaultTitle = "Empty document";
      setText(defaultTitle);
      setDebouncedText(defaultTitle);
      onUpdate(defaultTitle);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setText(newValue);
    // Không gọi onUpdate ở đây, để xử lý trong useEffect
  };

  useEffect(() => {
    if (isEditing) {
      const span = document.querySelector('.whitespace-pre');
      if (span) {
        const width = span.offsetWidth;
        document.documentElement.style.setProperty('--content-width', `${width}px`);
      }
    }
  }, [text, isEditing]);

  return isEditing ? (
    <div className="relative inline-block">
      <span
        className="invisible absolute whitespace-pre px-3"
        style={{
          font: 'inherit',
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
        className="pl-1 w-[var(--input-width)] min-w-[50px] px-3 py-2 
                   border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition duration-200 ease-in-out"
        style={{
          '--input-width': 'var(--content-width)',
        }}
      />
    </div>
  ) : (
    <div
      onClick={handleClick}
      className="cursor-pointer px-3 py-2 rounded-md
                 hover:bg-gray-100 hover:shadow-sm
                 transition duration-200 ease-in-out
                 text-gray-700"
    >
      {text}
    </div>
  );
};

export default EditableText;
