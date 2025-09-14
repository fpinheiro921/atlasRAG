
import React, { ReactNode } from 'react';

interface WindowMockupProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const WindowMockup: React.FC<WindowMockupProps> = ({ children, className = '', contentClassName = 'p-4 sm:p-6' }) => {
  return (
    <div className={`bg-panel border border-[#30363d] rounded-lg shadow-2xl overflow-hidden ${className}`}>
      <div className="h-8 bg-base flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
      </div>
      <div className={`bg-base/50 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
