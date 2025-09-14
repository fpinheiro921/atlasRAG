
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

export const Step4Visual: React.FC = () => (
  <WindowMockup>
    <div className="p-4 text-xs sm:text-sm">
      <h3 className="font-bold text-accent font-mono mb-2">{'// 4. Basic Data Model'}</h3>
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        <div className="bg-base p-2 sm:p-3 rounded-lg border border-panel w-1/2">
          <h4 className="font-bold text-text-heading text-center text-xs mb-1">User</h4>
          <ul className="font-mono text-[10px] sm:text-xs text-text-muted space-y-0.5">
            <li>id: <span className="text-sky-400">UUID</span></li>
            <li>email: <span className="text-sky-400">String</span></li>
            <li>name: <span className="text-sky-400">String</span></li>
          </ul>
        </div>
        <div className="text-accent font-bold text-lg">&lt;--&gt;</div>
        <div className="bg-base p-2 sm:p-3 rounded-lg border border-panel w-1/2">
          <h4 className="font-bold text-text-heading text-center text-xs mb-1">Room</h4>
          <ul className="font-mono text-[10px] sm:text-xs text-text-muted space-y-0.5">
            <li>id: <span className="text-sky-400">UUID</span></li>
            <li>name: <span className="text-sky-400">String</span></li>
            <li>creator_id: <span className="text-sky-400">FK</span></li>
          </ul>
        </div>
      </div>
    </div>
  </WindowMockup>
);
