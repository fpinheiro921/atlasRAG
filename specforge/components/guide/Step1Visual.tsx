
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

export const Step1Visual: React.FC = () => (
  <WindowMockup>
    <div className="p-4 text-xs sm:text-sm">
      <h3 className="font-bold text-accent font-mono mb-2">{'// 1. The One-Pager'}</h3>
      <div className="space-y-3 text-text-muted">
        <div>
          <label className="font-semibold text-text-body block">Product Name:</label>
          <p className="p-2 bg-base rounded-md mt-1">PodFast - AI Podcast Summaries</p>
        </div>
        <div>
          <label className="font-semibold text-text-body block">One-Sentence Goal:</label>
          <p className="p-2 bg-base rounded-md mt-1">To give busy professionals the key insights from podcasts in 5 minutes.</p>
        </div>
        <div>
          <label className="font-semibold text-text-body block">Primary User:</label>
          <p className="p-2 bg-base rounded-md mt-1">A time-poor consultant who drives between client meetings.</p>
        </div>
      </div>
    </div>
  </WindowMockup>
);
