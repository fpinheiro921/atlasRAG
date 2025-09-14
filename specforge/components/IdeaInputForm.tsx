
import React from 'react';
import { UserProfile } from '../services/firebaseService';

export interface ModuleInfo {
  id: string;
  name: string;
  icon: string;
}

interface IdeaInputFormProps {
  ideaText: string;
  setIdeaText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  apiKeyMissing: boolean;
  availableModules: ModuleInfo[];
  isLoggedIn: boolean;
  generationsRemaining: number | null;
  userProfile: UserProfile | null;
}

const MIN_CHARS = 20;
const MAX_CHARS = 10000;

export const IdeaInputForm: React.FC<IdeaInputFormProps> = ({
  ideaText,
  setIdeaText,
  onGenerate,
  isLoading,
  apiKeyMissing,
  availableModules,
  isLoggedIn,
  generationsRemaining,
  userProfile,
}) => {
  const charCount = ideaText.length;
  const isFormDisabled = !isLoggedIn || isLoading;
  const hasNoGenerationsLeft = generationsRemaining !== null && generationsRemaining <= 0;
  const isButtonDisabled = isFormDisabled || charCount < MIN_CHARS || charCount > MAX_CHARS || apiKeyMissing || hasNoGenerationsLeft;

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdeaText(event.target.value);
  };

  const handleClearInput = () => {
    setIdeaText('');
  };

  return (
    <div className="bg-panel rounded-lg p-6 sm:p-8 shadow-lg transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="idea-input" className="block text-xl font-bold text-text-heading font-display">
          Enter Your App Idea
        </label>
        <div className="text-right text-sm text-text-muted">
            {isLoggedIn && generationsRemaining !== null ? (
                <p>Generations left: <span className="font-bold text-accent">{Math.max(0, generationsRemaining)}</span></p>
            ) : (
                <p>Log in to get free generations</p>
            )}
        </div>
      </div>

      <div className="relative">
        <textarea
          id="idea-input"
          value={ideaText}
          onChange={handleInputChange}
          placeholder="Describe your application concept, key features, target users, etc. Be as detailed or concise as you like."
          className="w-full h-48 p-4 pr-10 bg-base border border-[#30363d] rounded-md focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none resize-y text-text-body placeholder-text-muted transition-colors custom-scrollbar disabled:opacity-60 disabled:cursor-not-allowed"
          minLength={MIN_CHARS}
          maxLength={MAX_CHARS}
          aria-describedby="char-count-info"
          disabled={isFormDisabled}
        />
        {ideaText && !isFormDisabled && (
          <button
            onClick={handleClearInput}
            type="button"
            className="absolute top-3 right-3 p-1 text-text-muted hover:text-text-body focus:outline-none focus:ring-1 focus:ring-accent rounded-full transition-colors flex items-center justify-center"
            aria-label="Clear input"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        )}
      </div>
      <p id="char-count-info" className={`text-xs mt-2 ${charCount > MAX_CHARS || (charCount < MIN_CHARS && ideaText !== '') ? 'text-danger-DEFAULT' : 'text-text-muted'}`}>
        {charCount} / {MAX_CHARS} characters (min {MIN_CHARS})
      </p>

      <div className="my-6">
        <h3 className="text-lg font-bold text-text-heading mb-3 font-display">
          Included Documentation Modules:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {availableModules.map(module => (
              <div 
                key={module.id} 
                className="flex items-center p-3 bg-base/50 rounded-md border border-transparent gap-3"
              >
                <span className="material-symbols-outlined text-accent" aria-hidden="true">check_box</span>
                <span className="material-symbols-outlined text-accent/80" aria-hidden="true">{module.icon}</span>
                <span className="text-text-body text-sm select-none flex-1">{module.name}</span>
              </div>
            )
          )}
        </div>
        <p className="text-text-muted text-xs mt-2">
            To ensure a comprehensive and coherent document, all modules are now included in every generation.
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-end items-center">
        <button
          onClick={onGenerate}
          disabled={isButtonDisabled}
          className="w-full sm:w-auto bg-accent text-white font-semibold rounded-md px-8 py-3 hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-panel focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center justify-center"
          aria-live="polite"
          aria-disabled={isButtonDisabled}
        >
          {isLoading ? (
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span className="material-symbols-outlined -ml-1 mr-2 h-5 w-5" aria-hidden="true">auto_fix_high</span>
          )}
          {isLoading ? 'Generating...' : 'Forge Specs'}
        </button>
      </div>
      {apiKeyMissing && (
        <p className="text-danger-DEFAULT text-sm mt-4 text-center sm:text-left" role="alert">
          The AI service is currently unavailable. Please try again later.
        </p>
      )}
       {hasNoGenerationsLeft && isLoggedIn && !isLoading && (
        <p className="text-danger-DEFAULT text-sm mt-4 text-center sm:text-left" role="alert">
          You have reached your monthly generation limit for the community plan.
        </p>
      )}
    </div>
  );
};
