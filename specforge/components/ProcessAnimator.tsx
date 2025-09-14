
import React, { useState, useEffect } from 'react';

const stages = [
  // Stage 1: Concept Expansion - Refine the raw idea into a structured brief
  { name: "Analyzing your app idea...", icon: "psychology", duration: 5000 },
  { name: "Inferring target users & personas...", icon: "groups", duration: 10000 },
  { name: "Defining core features & MVP scope...", icon: "lightbulb", duration: 10000 },
  { name: "Establishing KPIs & success metrics...", icon: "trending_up", duration: 8000 },
  { name: "Finalizing refined project brief...", icon: "fact_check", duration: 7000 },
  // Stage 2: Documentation Generation - Create comprehensive specs from the refined brief
  { name: "Generating PRD (Product Requirements Document)...", icon: "description", duration: 15000 },
  { name: "Defining Tech Stack & Project Structure...", icon: "hub", duration: 15000 },
  { name: "Designing Database Schema & Data Models...", icon: "schema", duration: 12000 },
  { name: "Mapping User Flows & Journey...", icon: "flowsheet", duration: 12000 },
  { name: "Creating Implementation Plan...", icon: "event_note", duration: 10000 },
  { name: "Establishing Security & Styling Guidelines...", icon: "security", duration: 10000 },
  { name: "Compiling Full Specification...", icon: "article", duration: 6000 },
];

const totalDuration = stages.reduce((acc, s) => acc + s.duration, 0); // 125000ms

export const ProcessAnimator: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(fadeInTimer);
  }, []);

  useEffect(() => {
    if (currentStageIndex === 0 && progress === 0) { 
      // Initial state, progress is 0.
    }

    if (currentStageIndex < stages.length) {
      const stage = stages[currentStageIndex];
      
      const timer = setTimeout(() => {
        let durationCompleted = 0;
        for (let i = 0; i <= currentStageIndex; i++) { 
            durationCompleted += stages[i].duration;
        }
        setProgress((durationCompleted / totalDuration) * 100);
        setCurrentStageIndex(prevIndex => prevIndex + 1);
      }, stage.duration);

      return () => clearTimeout(timer);
    } else if (currentStageIndex === stages.length && progress < 100) {
        setProgress(100);
    }
  }, [currentStageIndex, progress]);


  useEffect(() => { 
    if (currentStageIndex === 0) {
      setProgress(0);
    }
  }, []); 


  const displayedStageIndex = Math.min(currentStageIndex, stages.length - 1);
  const currentStageInfo = stages[displayedStageIndex];

  return (
    <div
      className={`bg-panel rounded-lg p-6 sm:p-8 shadow-xl my-8 w-full max-w-2xl mx-auto
                  transition-all duration-500 ease-out transform
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="text-center mb-6">
        <span className="material-symbols-outlined text-accent text-5xl animate-pulse">
          {currentStageIndex < stages.length ? currentStageInfo.icon : 'settings_suggest'}
        </span>
        <h3 className="text-xl font-semibold text-text-heading mt-3">
          {currentStageIndex < stages.length ? currentStageInfo.name : "Finalizing Document..."}
        </h3>
        <p className="text-sm text-text-muted">
          Your AI-powered tech spec is being forged. Please wait. (Estimated: ~2 min)
        </p>
      </div>

      <div className="w-full bg-base rounded-full h-3 mb-4 overflow-hidden shadow-inner">
        <div
          className="bg-accent h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label="Generation progress"
        ></div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className={`flex items-center p-3 rounded-md transition-all duration-300 text-sm
                        ${index < currentStageIndex ? 'bg-accent/20 text-accent' : 
                         index === currentStageIndex ? 'bg-accent/30 text-text-heading ring-1 ring-accent animate-pulse' : 
                         'bg-base/50 text-text-muted'}`}
          >
            <span className="material-symbols-outlined mr-3 flex-shrink-0" style={{fontSize: '1.25rem'}}>
              {index < currentStageIndex ? 'check_circle' : 
               index === currentStageIndex ? (currentStageIndex < stages.length ? stages[currentStageIndex].icon : 'hourglass_top') :
               'radio_button_unchecked'}
            </span>
            <span className="truncate">{stage.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
