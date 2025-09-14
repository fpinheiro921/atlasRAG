
import React from 'react';
import { WindowMockup } from './WindowMockup';

export const Feature1InputVisual: React.FC = () => {
  return (
    <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:-rotate-1">
      <WindowMockup>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-text-heading">Enter Your App Idea</h3>
            <div className="text-xs text-text-muted bg-base px-2 py-1 rounded">Generations left: <span className="text-accent font-bold">3</span></div>
          </div>
          <div className="w-full h-24 p-2 bg-base border border-[#30363d] rounded-md text-xs text-text-muted/80">
            An AI-powered app that automatically generates technical specs from a simple idea...
          </div>
          <h3 className="text-sm font-bold text-text-heading pt-2">Select Documentation Modules:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-base/50 p-2 rounded-md flex items-center border border-accent/50"><span className="material-symbols-outlined text-accent/80 text-sm mr-2">description</span> PRD</div>
            <div className="bg-base/50 p-2 rounded-md flex items-center"><span className="material-symbols-outlined text-text-muted/80 text-sm mr-2">layers</span> Tech Stack</div>
            <div className="bg-base/50 p-2 rounded-md flex items-center"><span className="material-symbols-outlined text-text-muted/80 text-sm mr-2">account_tree</span> Project Structure</div>
            <div className="bg-base/50 p-2 rounded-md flex items-center"><span className="material-symbols-outlined text-text-muted/80 text-sm mr-2">schema</span> Schema Design</div>
          </div>
          <button className="w-full bg-accent text-white font-semibold rounded-md py-2 text-sm mt-2 flex items-center justify-center">
            <span className="material-symbols-outlined mr-2 text-sm">auto_fix_high</span>
            Forge Specs
          </button>
        </div>
      </WindowMockup>
    </div>
  );
};
