import React, { useEffect, useRef } from 'react';
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Trash,
  ArrowUpToLine,
  ArrowDownToLine,
  Table,
  MinusSquare,
} from 'lucide-react';

const TableMenu  = ({ editor, position, onClose }) => {
  const menuRef = useRef(null);

  const menuItems = [
    {
      label: 'Thêm cột bên trái',
      action: () => editor.chain().focus().addColumnBefore().run(),
      icon: <ArrowLeftToLine className="w-4 h-4" />,
    },
    {
      label: 'Thêm cột bên phải',
      action: () => editor.chain().focus().addColumnAfter().run(),
      icon: <ArrowRightToLine className="w-4 h-4" />,
    },
    {
      label: 'Xóa cột',
      action: () => editor.chain().focus().deleteColumn().run(),
      icon: <MinusSquare className="w-4 h-4" />,
      isDanger: true,
    },
    { type: 'separator' },
    {
      label: 'Thêm dòng phía trên',
      action: () => editor.chain().focus().addRowBefore().run(),
      icon: <ArrowUpToLine className="w-4 h-4" />,
    },
    {
      label: 'Thêm dòng phía dưới',
      action: () => editor.chain().focus().addRowAfter().run(),
      icon: <ArrowDownToLine className="w-4 h-4" />,
    },
    {
      label: 'Xóa dòng',
      action: () => editor.chain().focus().deleteRow().run(),
      icon: <MinusSquare className="w-4 h-4" />,
      isDanger: true,
    },
    { type: 'separator' },
    {
      label: 'Xóa bảng',
      action: () => editor.chain().focus().deleteTable().run(),
      icon: <Trash className="w-4 h-4" />,
      isDanger: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const styles = {
    menu: `
      fixed z-50 
      bg-white dark:bg-gray-800 
      rounded-xl shadow-lg 
      py-2 w-56 
      border border-gray-100 dark:border-gray-700
      transform transition-all duration-200 ease-out
      opacity-100 scale-100
      animate-fadeIn
      backdrop-blur-sm bg-opacity-95
    `,
    menuItem: `
      flex items-center w-full px-3 py-2.5
      text-sm text-gray-700 dark:text-gray-200
      hover:bg-gray-50 dark:hover:bg-gray-700/50
      transition-all duration-150 ease-in-out
      cursor-pointer
      group
      relative
    `,
    menuItemDanger: `
      text-red-600 dark:text-red-400
      hover:bg-red-50 dark:hover:bg-red-900/30
    `,
    menuItemIcon: `
      mr-3 text-gray-400 dark:text-gray-500
      group-hover:text-current
      transition-all duration-150
      relative
      transform group-hover:scale-110
      opacity-80 group-hover:opacity-100
    `,
    separator: `
      my-2 h-px bg-gray-200 dark:bg-gray-700
    `,
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {menuItems.map((item, index) => (
        item.type === 'separator' ? (
          <div key={`separator-${index}`} className={styles.separator} />
        ) : (
          <button
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={`${styles.menuItem} ${item.isDanger ? styles.menuItemDanger : ''}`}
          >
            <span className={styles.menuItemIcon}>{item.icon}</span>
            {item.label}
          </button>
        )
      ))}
    </div>
  );
};

export default TableMenu;