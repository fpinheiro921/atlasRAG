
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

export const SavedSpecsVisual: React.FC = () => {
  const fakeSpecs = [
    { name: 'My Awesome App Spec', savedAt: 'Last Updated: Oct 27, 2023, 10:05 AM' },
    { name: 'Social Media for Dogs', savedAt: 'Last Updated: Oct 26, 2023, 4:30 PM' },
    { name: 'AI Recipe Generator', savedAt: 'Last Updated: Oct 25, 2023, 9:15 AM' },
  ];

  return (
    <div className="transform transition-transform duration-300 ease-in-out hover:scale-105 my-8">
      <WindowMockup contentClassName="p-0">
        <div className="p-4 border-b border-base flex justify-between items-center">
          <h3 className="text-sm sm:text-base font-bold text-text-heading flex items-center font-display">
            <span className="material-symbols-outlined mr-2 text-accent">cloud_done</span>
            My Cloud Specifications
          </h3>
          <button className="p-1 text-text-muted rounded-full">
            <span className="material-symbols-outlined text-base sm:text-xl">close</span>
          </button>
        </div>
        <div className="p-4 space-y-3">
          {fakeSpecs.map((spec, index) => (
            <div key={index} className="bg-base/70 p-3 rounded-md shadow-sm group">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div>
                  <h4 className="font-semibold text-text-heading text-xs sm:text-sm group-hover:text-accent transition-colors">{spec.name}</h4>
                  <p className="text-xs text-text-muted">{spec.savedAt}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button className="text-xs bg-accent/80 text-white font-medium rounded-md px-3 py-1 hover:bg-accent flex items-center">
                    <span className="material-symbols-outlined mr-1" style={{fontSize: '14px'}}>file_open</span>
                    Load
                  </button>
                  <button className="text-xs bg-danger-DEFAULT/20 text-danger-DEFAULT font-medium rounded-md p-1 hover:bg-danger-DEFAULT/40">
                    <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </WindowMockup>
    </div>
  );
};
