'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Component loading hiển thị trong khi AvatarStack đang được tải
const LoadingAvatarStack = () => (
  <div className="flex pl-3 justify-center items-center h-full">
    <div className="animate-pulse bg-gray-200 rounded-full w-9 h-9"></div>
    <div className="animate-pulse bg-gray-200 rounded-full w-9 h-9 -ml-3"></div>
    <div className="animate-pulse bg-gray-200 rounded-full w-9 h-9 -ml-3"></div>
  </div>
);

// Import AvatarStack một cách động với ssr: false
const DynamicAvatarStack = dynamic(() => import('./AvatarStack'), {
  ssr: false,
  loading: () => <LoadingAvatarStack />
});

const DoubleRenderAvatarStack = () => {
  const [firstRender, setFirstRender] = useState(false);
  const [secondRender, setSecondRender] = useState(false);

  // Kích hoạt render lần đầu khi component được mount
  useEffect(() => {
    setFirstRender(true);
  }, []);

  // Kích hoạt render lần thứ hai sau khi render lần đầu hoàn tất
  useEffect(() => {
    if (firstRender) {
      // Đặt một timeout nhỏ để đảm bảo render lần đầu đã hoàn thành
      const timer = setTimeout(() => {
        setSecondRender(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [firstRender]);

  return (
    <div>
      {/* Render lần đầu */}
      {firstRender && (
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-1">Render lần 1:</h3>
          <DynamicAvatarStack />
        </div>
      )}
      
      {/* Render lần thứ hai */}
      {secondRender && (
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Render lần 2:</h3>
          <DynamicAvatarStack />
        </div>
      )}
      
      {/* Hiển thị loading khi chưa render lần nào */}
      {!firstRender && <LoadingAvatarStack />}
    </div>
  );
};

export default DoubleRenderAvatarStack;
