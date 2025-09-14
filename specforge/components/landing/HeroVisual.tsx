
import React from 'react';
import { WindowMockup } from './WindowMockup';

export const HeroVisual: React.FC = () => {
  return (
    <div className="group relative transform transition-transform duration-500 ease-out hover:scale-[1.03] hover:-rotate-1">
      <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-xl blur-lg opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-300"></div>
      <WindowMockup contentClassName="p-0" className="relative">
        <div className="flex h-64 sm:h-72 lg:h-80">
          {/* Input Column */}
          <div className="w-2/5 bg-base/50 p-3 sm:p-4 flex flex-col border-r border-panel/50">
            <div className="text-xs font-bold text-text-heading mb-2">Your Idea</div>
            <div className="w-full h-24 p-2 bg-base border border-[#30363d] rounded-md text-[10px] sm:text-xs text-text-muted/80 leading-snug custom-scrollbar overflow-y-auto">
              An AI-powered app that automatically generates full technical specs, PRDs, and user stories from a simple idea... It should handle different project types and output clean, developer-ready Markdown.
            </div>
            <div className="flex-grow"></div>
            <button className="w-full bg-accent text-white font-semibold rounded-md py-2 text-xs sm:text-sm mt-2 flex items-center justify-center shadow-lg shadow-accent/20 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined mr-2 text-sm">auto_fix_high</span>
              Forge Specs
            </button>
          </div>
          
          {/* Output Column */}
          <div className="w-3/5 bg-panel/20 p-3 sm:p-4 overflow-hidden">
             <div className="text-xs font-bold text-text-heading mb-2">Generated Spec</div>
             <div className="space-y-2 text-[10px] sm:text-xs">
                <h4 className="font-bold text-accent">### 1. PRD</h4>
                <p className="text-text-muted leading-snug">
                  <span className="text-text-body font-medium">1.1 Problem Statement:</span> Developers and PMs spend too much time writing boilerplate docs...
                </p>

                <h4 className="font-bold text-accent mt-2">### 2. Tech Stack</h4>
                <div className="p-2 bg-base rounded-md font-mono text-sky-400 leading-snug shadow-inner text-[9px] sm:text-[11px]">
                    <span className="text-purple-400">"frontend"</span>: <span className="text-amber-400">"React/Vite"</span>,
                    <br/>
                    <span className="text-purple-400">"backend"</span>: <span className="text-amber-400">"Node/NestJS"</span>,
                    <br/>
                    <span className="text-purple-400">"database"</span>: <span className="text-amber-400">"Postgres"</span>
                </div>
                 <p className="text-text-muted leading-snug opacity-60">
                  <span className="text-text-body font-medium">2.1 Justification:</span> React provides a robust ecosystem...
                </p>
             </div>
          </div>
        </div>
      </WindowMockup>
    </div>
  );
};
