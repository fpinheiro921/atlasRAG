
import React from 'react';
import { WindowMockup } from '../landing/WindowMockup';

export const Step2Visual: React.FC = () => (
  <WindowMockup>
    <div className="p-4 text-xs sm:text-sm">
      <h3 className="font-bold text-accent font-mono mb-2">{'// 2. Personas & Stories'}</h3>
      <div className="bg-base p-3 rounded-lg">
        <h4 className="font-bold text-text-heading mb-2">Persona: Maria the Manager</h4>
        <p className="text-text-muted text-xs mb-3">Struggles to gauge team morale now that her team is fully remote.</p>
        <h5 className="font-semibold text-text-body text-xs mb-1">User Story:</h5>
        <div className="p-2 bg-panel/50 rounded-md font-mono text-text-body leading-relaxed">
          <span className="text-purple-400">GIVEN</span> I'm logged in
          <br />
          <span className="text-sky-400">WHEN</span> I click 'Start Huddle'
          <br />
          <span className="text-amber-400">THEN</span> an audio room is created for my team
        </div>
      </div>
    </div>
  </WindowMockup>
);
