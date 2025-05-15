"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GripVertical } from "lucide-react";

const DocumentRuler = ({
  editor,
  width = 800,
  minWidth = 500,
  onMarginChange,
  leftMargin,
  rightMargin,
  className,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [currentWidth, setCurrentWidth] = useState(Math.max(width, minWidth));
  const [dragging, setDragging] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [hoverMarker, setHoverMarker] = useState(null);
  const dragTimeout = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Constants - adaptive values for different screen sizes
  const getConstants = useCallback(() => {
    // Adaptive values based on screen size
    if (isSmallScreen) {
      return {
        RULER_HEIGHT: 28, // Nhỏ hơn trên màn hình nhỏ
        MAJOR_TICK_HEIGHT: 14,
        MINOR_TICK_HEIGHT: 8,
        HALF_TICK_HEIGHT: 10,
        MIN_DISTANCE: 150, // Giảm khoảng cách tối thiểu trên màn hình nhỏ
        HANDLE_HOVER_DISTANCE: 15, // Tăng khu vực hover cho màn hình cảm ứng
        PIXELS_PER_UNIT: 70, // Ít pixel hơn cho mỗi đơn vị đo lường
        HANDLE_WIDTH: 8 // Handle rộng hơn cho màn hình cảm ứng
      };
    }
    
    return {
      RULER_HEIGHT: 32,
      MAJOR_TICK_HEIGHT: 18,
      MINOR_TICK_HEIGHT: 10,
      HALF_TICK_HEIGHT: 14,
      MIN_DISTANCE: 200,
      HANDLE_HOVER_DISTANCE: 12,
      PIXELS_PER_UNIT: 100,
      HANDLE_WIDTH: 6
    };
  }, [isSmallScreen]);

  // Margin change with requestAnimationFrame for better performance
  const debouncedMarginChange = useCallback((left, right) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      onMarginChange(left, right);
    });
  }, [onMarginChange]);

  // Draw ruler function - optimized for clarity and responsive
  const drawRuler = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const constants = getConstants();
    
    // Set canvas dimensions
    canvas.width = currentWidth;
    canvas.height = constants.RULER_HEIGHT;

    // Draw ruler background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bottom border
    ctx.beginPath();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.moveTo(0, canvas.height - 0.5);
    ctx.lineTo(canvas.width, canvas.height - 0.5);
    ctx.stroke();

    // Draw content area
    const contentAreaStart = leftMargin;
    const contentAreaEnd = canvas.width - rightMargin;
    const contentWidth = contentAreaEnd - contentAreaStart;
    
    // Content area background
    ctx.fillStyle = "rgba(239, 246, 255, 0.6)";
    ctx.fillRect(contentAreaStart, 0, contentWidth, canvas.height - 1);

    // Content area border
    ctx.beginPath();
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 1;
    ctx.rect(contentAreaStart + 0.5, 0.5, contentWidth - 1, canvas.height - 2);
    ctx.stroke();

    const centerX = currentWidth / 2;

    // Draw center line
    ctx.beginPath();
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(centerX + 0.5, 0);
    ctx.lineTo(centerX + 0.5, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Các tham số vẽ thích ứng với kích thước màn hình
    const pixelsPerUnit = constants.PIXELS_PER_UNIT;
    const fontSize = isSmallScreen ? 9 : 11;
    const skipMinorTicks = isSmallScreen ? 2 : 1; // Bỏ qua một số vạch nhỏ trên màn hình nhỏ để tránh rối mắt
    
    // Calculate visible range based on current width
    const unitsVisible = Math.ceil(currentWidth / pixelsPerUnit) + 2;
    const startUnit = Math.floor(-unitsVisible / 2);
    const endUnit = Math.ceil(unitsVisible / 2);

    // Draw ruler ticks and numbers
    for (let i = startUnit; i <= endUnit; i++) {
      const x = centerX + i * pixelsPerUnit;
      
      // Skip if outside visible area
      if (x < -pixelsPerUnit || x > currentWidth + pixelsPerUnit) continue;
      
      // Major ticks
      ctx.beginPath();
      ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
      ctx.lineWidth = 1;
      ctx.moveTo(x + 0.5, canvas.height);
      ctx.lineTo(x + 0.5, canvas.height - constants.MAJOR_TICK_HEIGHT);
      ctx.stroke();

      // Numbers - font size adjusted for screen size
      if (!isSmallScreen || i % 2 === 0) { // Trên màn hình nhỏ chỉ hiện số chẵn
        ctx.font = `${fontSize}px Inter, system-ui`;
        ctx.fillStyle = "rgba(51, 65, 85, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText(String(i), x, canvas.height - constants.MAJOR_TICK_HEIGHT - 4);
      }

      // Minor ticks
      if (i < endUnit) {
        // On small screens, skip some minor ticks for clarity
        const tickStep = isSmallScreen ? 2 : 1;
        
        for (let j = tickStep; j < 10; j += tickStep) {
          const minorX = x + j * (pixelsPerUnit / 10);
          
          // Skip if outside visible area
          if (minorX < -10 || minorX > currentWidth + 10) continue;
          
          // On small screens, only draw the halfway tick and fewer minor ticks
          if (isSmallScreen && j !== 5 && j % 5 !== 0) continue;
          
          const tickHeight = j === 5 ? constants.HALF_TICK_HEIGHT : constants.MINOR_TICK_HEIGHT;

          ctx.beginPath();
          ctx.strokeStyle = j === 5 
            ? "rgba(71, 85, 105, 0.7)" 
            : "rgba(148, 163, 184, 0.5)";
          ctx.lineWidth = j === 5 ? 0.75 : 0.5;
          ctx.moveTo(minorX + 0.5, canvas.height);
          ctx.lineTo(minorX + 0.5, canvas.height - tickHeight);
          ctx.stroke();
        }
      }
    }
  }, [currentWidth, leftMargin, rightMargin, isSmallScreen, getConstants]);

  // Draw ruler on changes
  useEffect(() => {
    drawRuler();
  }, [currentWidth, leftMargin, rightMargin, drawRuler, hoverMarker, isSmallScreen]);

  // Handle mouse movement during drag
  const handleGlobalMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;

    // Prevent default to stop scrolling on touch devices
    if (e.cancelable) e.preventDefault();

    // Normalize mouse or touch position
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    if (clientX === null) return;

    // Clear existing timeout and set new one
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
    
    dragTimeout.current = setTimeout(() => {
      if (!document.hasFocus()) {
        handleMouseUp();
      }
    }, 100);

    const constants = getConstants();

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const totalWidth = rect.width;

      if (dragging === "left") {
        const newLeft = Math.max(
          0,
          Math.min(x - dragOffset, totalWidth - rightMargin - constants.MIN_DISTANCE)
        );
        debouncedMarginChange(newLeft, rightMargin);
      } else if (dragging === "right") {
        const newRight = Math.max(
          0,
          Math.min(
            totalWidth - x + dragOffset,
            totalWidth - leftMargin - constants.MIN_DISTANCE
          )
        );
        debouncedMarginChange(leftMargin, newRight);
      }
    });
  }, [dragging, isDragging, dragOffset, rightMargin, leftMargin, debouncedMarginChange, getConstants]);

  // Handle mouse up event
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragging(null);
    setDragOffset(0);
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
  }, []);

  // Check screen size and update isSmallScreen state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px là ngưỡng cho màn hình nhỏ (tablet)
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Add and remove global event listeners
  useEffect(() => {
    const handleMove = (e) => handleGlobalMouseMove(e);
    
    if (isDragging) {
      // Desktop events
      window.addEventListener('mousemove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('blur', handleMouseUp);
      
      // Touch events
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchcancel', handleMouseUp);
    }

    return () => {
      // Clean up all event listeners
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleMouseUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
      
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }
    };
  }, [isDragging, handleGlobalMouseMove, handleMouseUp]);

  // Handle initial mouse down on ruler
  const handlePointerDown = useCallback((e) => {
    if (!containerRef.current) return;

    // Normalize pointer or touch position
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    if (clientX === null) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const totalWidth = rect.width;

    const constants = getConstants();
    const leftDistance = Math.abs(x - leftMargin);
    const rightDistance = Math.abs(x - (totalWidth - rightMargin));

    if (leftDistance <= constants.HANDLE_HOVER_DISTANCE) {
      setIsDragging(true);
      setDragging("left");
      setDragOffset(x - leftMargin);
      e.preventDefault(); // Prevent default behavior
    } else if (rightDistance <= constants.HANDLE_HOVER_DISTANCE) {
      setIsDragging(true);
      setDragging("right");
      setDragOffset(x - (totalWidth - rightMargin));
      e.preventDefault(); // Prevent default behavior
    }
  }, [leftMargin, rightMargin, getConstants]);

  // Handle mouse hover
  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current || isDragging) return;

    // Normalize pointer position
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    if (clientX === null) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const totalWidth = rect.width;

    const constants = getConstants();
    const leftDistance = Math.abs(x - leftMargin);
    const rightDistance = Math.abs(x - (totalWidth - rightMargin));

    if (leftDistance <= constants.HANDLE_HOVER_DISTANCE) {
      setHoverMarker("left");
      document.body.style.cursor = "col-resize";
    } else if (rightDistance <= constants.HANDLE_HOVER_DISTANCE) {
      setHoverMarker("right");
      document.body.style.cursor = "col-resize";
    } else {
      setHoverMarker(null);
      document.body.style.cursor = "";
    }
  }, [leftMargin, rightMargin, isDragging, getConstants]);

  // Reset hover when pointer leaves
  const handlePointerLeave = useCallback(() => {
    if (!isDragging) {
      setHoverMarker(null);
      document.body.style.cursor = "";
    }
  }, [isDragging]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        setCurrentWidth(Math.max(newWidth, minWidth));
      }
    };

    // Initial sizing
    handleResize();
    
    // Add resize observer for more responsive behavior
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Fallback to window resize for older browsers
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [minWidth]);

  // Ensure minimum distance between margins
  useEffect(() => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.offsetWidth;
      const constants = getConstants();
      const currentDistance = totalWidth - leftMargin - rightMargin;
      
      if (currentDistance < constants.MIN_DISTANCE) {
        const newRightMargin = totalWidth - leftMargin - constants.MIN_DISTANCE;
        debouncedMarginChange(leftMargin, Math.max(0, newRightMargin));
      }
    }
  }, [leftMargin, rightMargin, debouncedMarginChange, getConstants]);

  // CSS classes for handles
  const getHandleClasses = useCallback((side) => {
    const isActive = (isDragging && dragging === side) || hoverMarker === side;
    const constants = getConstants();
    
    return {
      container: `absolute top-0 bottom-0 flex items-center justify-center cursor-col-resize transition-all duration-150 touch-none z-10 ${isSmallScreen ? 'w-8' : 'w-6'}`,
      bar: `w-1 ${isActive ? 'bg-blue-500 h-full' : 'bg-blue-400/60 h-5/6'} rounded-full transition-all duration-150`,
      grip: `absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-150 ${isActive ? 'bg-blue-100' : 'bg-transparent'}`,
      icon: `text-blue-500 transition-all duration-150 ${isActive ? 'opacity-100' : 'opacity-70'}`
    };
  }, [isDragging, dragging, hoverMarker, isSmallScreen, getConstants]);

  // Render component
  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none rounded-md shadow-sm"
        style={{ height: `${getConstants().RULER_HEIGHT}px` }}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onTouchEnd={handlePointerLeave}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
        
        {/* Left margin handle */}
        <div
          className={getHandleClasses("left").container}
          style={{
            left: `${leftMargin - (isSmallScreen ? 16 : 12)}px`,
            transform: (isDragging && dragging === "left") || hoverMarker === "left" 
              ? "scale(1.1)" 
              : "scale(1)",
          }}
          onMouseDown={(e) => {
            setDragging("left");
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            setDragOffset(x - leftMargin);
            e.preventDefault();
          }}
          onTouchStart={(e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            setDragging("left");
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            setDragOffset(x - leftMargin);
            e.preventDefault();
          }}
        >
          <div className={getHandleClasses("left").bar}></div>
          <div className={getHandleClasses("left").grip}>
            <GripVertical
              className={getHandleClasses("left").icon}
              size={isSmallScreen ? 16 : 14}
            />
          </div>
        </div>
        
        {/* Right margin handle */}
        <div
          className={getHandleClasses("right").container}
          style={{
            left: `${currentWidth - rightMargin - (isSmallScreen ? 16 : 12)}px`,
            transform: (isDragging && dragging === "right") || hoverMarker === "right" 
              ? "scale(1.1)" 
              : "scale(1)",
          }}
          onMouseDown={(e) => {
            setDragging("right");
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const totalWidth = rect.width;
            setDragOffset(x - (totalWidth - rightMargin));
            e.preventDefault();
          }}
          onTouchStart={(e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            setDragging("right");
            setIsDragging(true);
            const rect = containerRef.current.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const totalWidth = rect.width;
            setDragOffset(x - (totalWidth - rightMargin));
            e.preventDefault();
          }}
        >
          <div className={getHandleClasses("right").bar}></div>
          <div className={getHandleClasses("right").grip}>
            <GripVertical
              className={getHandleClasses("right").icon}
              size={isSmallScreen ? 16 : 14}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRuler;