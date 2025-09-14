
import React from 'react';
import { WindowMockup } from './WindowMockup';

export const Feature3ExportVisual: React.FC = () => {
  return (
    <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:-rotate-1">
      <WindowMockup contentClassName="p-0">
          <div className="flex justify-between items-center p-3 border-b border-base">
              <h2 className="text-xs font-bold text-text-heading flex items-center">
                  <span className="material-symbols-outlined mr-2 text-sm">menu_book</span>
                  Generated Specification
              </h2>
              <div className="flex space-x-1.5">
                  <button className="p-1.5 bg-accent/20 text-accent rounded-md flex items-center text-xs">
                      <span className="material-symbols-outlined mr-1" style={{ fontSize: '14px' }}>content_copy</span> Copy
                  </button>
                  <button className="p-1.5 bg-base text-text-muted rounded-md flex items-center text-xs">
                      <span className="material-symbols-outlined mr-1" style={{ fontSize: '14px' }}>download</span> Download
                  </button>
              </div>
          </div>
          <div className="flex h-56">
            <aside className="w-1/3 bg-base p-2 custom-scrollbar overflow-y-auto">
                <nav className="space-y-1 text-xs">
                    <a href="#" className="block px-2 py-1.5 bg-accent text-white font-semibold rounded-md">PRD</a>
                    <a href="#" className="block px-2 py-1.5 text-text-muted hover:bg-panel">Tech Stack</a>
                    <a href="#" className="block px-2 py-1.5 text-text-muted hover:bg-panel">Project Structure</a>
                    <a href="#" className="block px-2 py-1.5 text-text-muted hover:bg-panel">Schema Design</a>
                </nav>
            </aside>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-panel/30 p-3 text-xs">
                <div className="text-text-heading font-bold">1. Product Vision</div>
                <div className="text-text-muted mt-1 space-y-1">
                    <p>1.1 One-sentence problem statement...</p>
                    <p>1.2 North-Star KPI...</p>
                </div>
                <div className="text-text-heading font-bold mt-3">2. Target Users</div>
                <div className="mt-1 p-2 bg-base rounded-md">
                  <pre className="text-accent/80 whitespace-pre-wrap"><code>
                    {`{\n  "persona": "Solo-maker",\n  "painPoint": "Blank-page paralysis"\n}`}
                  </code></pre>
                </div>
            </div>
          </div>
      </WindowMockup>
    </div>
  );
};
