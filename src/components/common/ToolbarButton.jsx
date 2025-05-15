import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ToolbarButton = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  disabled, 
  type,
  size = 'md',
  variant = 'default'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const variants = {
    default: {
      base: 'text-gray-700 hover:bg-gray-100',
      active: 'bg-blue-100 text-gray-900'
    },
    primary: {
      base: 'text-blue-600 hover:bg-blue-50',
      active: 'bg-blue-50 text-blue-700'
    },
    minimal: {
      base: 'text-gray-600 hover:text-gray-900',
      active: 'text-gray-900'
    }
  };

  const getStyles = () => {
    const style = variants[variant];
    return `
      ${sizeClasses[size]}
      rounded-md
      transition-all
      duration-200
      ease-in-out
      focus:outline-none
      focus:ring-2
      focus:ring-offset-1
      focus:ring-gray-200
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      ${active ? style.active : style.base}
      ${type ? '!bg-transparent' : ''}
    `;
  };

  return (
    <div className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        className={getStyles()}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
      >
        <Icon className={`
          ${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
          transition-transform
          duration-400
          ${active ? 'transform' : ''}
        `} />
      </motion.button>

      {/* Tooltip */}
      <div 
        className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-1
          px-2 py-1 text-xs font-medium text-white
          bg-gray-800 rounded-md whitespace-nowrap
          transition-opacity duration-200
          ${showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          z-20
        `}
      >
        {label}
        {/* Mũi tên tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default ToolbarButton;
