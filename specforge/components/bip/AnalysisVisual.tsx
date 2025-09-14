
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

export const AnalysisVisual: React.FC = () => {
  return (
    <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 my-8">
      <WindowMockup contentClassName="p-0">
        <div className="p-4 border-b border-base">
          <h3 className="text-sm sm:text-base font-bold text-text-heading flex items-center font-display">
            <span className="material-symbols-outlined mr-2 text-accent">magic_button</span>
            AI-Powered Specification Analysis
          </h3>
        </div>
        <div className="p-4 space-y-1">
           <div className="text-center py-4">
              <div className="font-semibold text-text-heading text-xs sm:text-sm">AI Analysis & Suggestions:</div>
           </div>
           <div className="p-2 bg-base/50 rounded-md max-h-60 overflow-y-auto custom-scrollbar">
              <div className="font-bold text-text-heading text-xs mb-1">### 1. Potential Ambiguities</div>
              <div className="analysis-item group mb-2 pl-2 relative py-1 border-l-2 border-accent/50 bg-base/50 rounded-r-md">
                <p className="text-xs text-text-body ml-2">The term "user-friendly" is subjective. Consider defining this with specific metrics. (Refers to section: '1. PRD...')</p>
                 <button className="absolute top-1/2 -translate-y-1/2 right-2 text-[10px] bg-accent/80 text-white font-medium rounded px-1.5 py-0.5 hover:bg-accent flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined mr-1" style={{ fontSize: '12px' }}>edit_note</span>
                  Refine
                </button>
              </div>

              <div className="font-bold text-text-heading text-xs mt-2 mb-1">### 2. Areas Needing More Detail</div>
              <div className="analysis-item group mb-2 pl-2 relative py-1 border-l-2 border-accent/50 bg-base/50 rounded-r-md">
                <p className="text-xs text-text-body ml-2">The 'Schema Design' section could benefit from explicitly defining foreign key relationships and cascade behavior. (Refers to section: '4. Schema Design')</p>
                 <button className="absolute top-1/2 -translate-y-1/2 right-2 text-[10px] bg-accent/80 text-white font-medium rounded px-1.5 py-0.5 hover:bg-accent flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined mr-1" style={{ fontSize: '12px' }}>edit_note</span>
                  Refine
                </button>
              </div>

               <div className="font-bold text-text-heading text-xs mt-2 mb-1">### 3. Missing Edge Cases</div>
               <div className="analysis-item group mb-1 pl-2 relative py-1 border-l-2 border-transparent">
                   <p className="text-xs text-text-body ml-2">What happens if a third-party API in the 'Tech Stack' is unresponsive? A timeout and fallback strategy should be specified.</p>
               </div>
           </div>
        </div>
      </WindowMockup>
    </div>
  );
};
