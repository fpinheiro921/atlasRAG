
import React from 'react';
import { WindowMockup } from './WindowMockup';

export const Feature2AiCraftsVisual: React.FC = () => {
  return (
    <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-1">
      <WindowMockup>
        <div className="text-center mb-4">
            <span className="material-symbols-outlined text-accent text-4xl animate-pulse">
            settings_suggest
            </span>
            <h3 className="text-sm font-semibold text-text-heading mt-2">
            AI is Forging Your Specs...
            </h3>
        </div>
        <div className="w-full bg-base rounded-full h-2 mb-3 overflow-hidden shadow-inner">
            <div className="bg-accent h-2 rounded-full" style={{ width: `65%` }}></div>
        </div>
        <div className="space-y-1 text-xs">
          {[
            {icon: 'check_circle', text: 'Initializing AI & Parsing Idea...', done: true},
            {icon: 'check_circle', text: 'Generating PRD...', done: true},
            {icon: 'hub', text: 'Defining Tech Stack...', done: false, active: true},
            {icon: 'radio_button_unchecked', text: 'Designing Schema & User Flows...', done: false},
          ].map((item, index) => (
             <div key={index}
                className={`flex items-center p-2 rounded-md transition-all duration-300
                            ${item.done ? 'bg-accent/20 text-accent' : 
                             item.active ? 'bg-accent/30 text-text-heading ring-1 ring-accent animate-pulse' : 
                             'bg-base/50 text-text-muted'}`}
            >
                <span className="material-symbols-outlined mr-2 flex-shrink-0" style={{fontSize: '1rem'}}>
                    {item.icon}
                </span>
                <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      </WindowMockup>
    </div>
  );
};
