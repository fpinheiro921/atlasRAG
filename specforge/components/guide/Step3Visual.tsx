
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

export const Step3Visual: React.FC = () => (
  <WindowMockup>
    <div className="p-4 text-xs sm:text-sm">
      <h3 className="font-bold text-accent font-mono mb-2">{'// 3. MoSCoW Prioritization'}</h3>
      <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
        <div className="bg-base p-2 rounded-md">
          <h4 className="font-bold text-text-heading border-b border-panel pb-1 mb-1">Must-Have</h4>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>User Login</li>
            <li>Create Audio Room</li>
          </ul>
        </div>
        <div className="bg-base p-2 rounded-md">
          <h4 className="font-bold text-text-heading border-b border-panel pb-1 mb-1">Should-Have</h4>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>Mute/Unmute</li>
            <li>See who is in room</li>
          </ul>
        </div>
        <div className="bg-base p-2 rounded-md">
          <h4 className="font-bold text-text-heading border-b border-panel pb-1 mb-1">Could-Have</h4>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>Text Chat</li>
            <li>Screen Sharing</li>
          </ul>
        </div>
        <div className="bg-base p-2 rounded-md">
          <h4 className="font-bold text-text-heading border-b border-panel pb-1 mb-1">Won't-Have</h4>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>Video Chat</li>
            <li>Custom Emojis</li>
          </ul>
        </div>
      </div>
    </div>
  </WindowMockup>
);
