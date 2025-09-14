
import React, { useState, useCallback, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './firebaseConfig';
import { IdeaInputForm, ModuleInfo } from './components/IdeaInputForm';
import { SpecDisplay } from './components/SpecDisplay';
import { ProcessAnimator } from './components/ProcessAnimator';
import { ErrorMessage } from './components/ErrorMessage';
import { HomeScreen } from './components/HomeScreen';
import { SavedSpecsModal, SavedSpec } from './components/SavedSpecsModal';
import { GoogleLogoIcon } from './components/GoogleLogoIcon';
import { BuildingInPublicPage } from './components/BuildingInPublicPage';
import { generateSpecFromIdea } from './services/geminiService';
import { 
  signInWithGoogle, 
  signOutUser, 
  saveSpecToFirestore, 
  getUserSpecs,
  deleteSpecFromFirestore,
  updateUserInFirestore,
  getOrCreateUserProfile,
  incrementGenerationCount,
  UserProfile
} from './services/firebaseService';

type View = 'home' | 'app' | 'building-in-public';

type Notification = {
  type: 'success' | 'info' | 'error';
  message: string;
};

export const ALL_AVAILABLE_MODULES: ModuleInfo[] = [
  { id: 'prd', name: 'PRD (Product Requirements Document)', icon: 'description' },
  { id: 'tech_stack', name: 'Tech Stack Specification', icon: 'layers' },
  { id: 'project_structure', name: 'Project Structure', icon: 'account_tree' },
  { id: 'user_flow_textual', name: 'User Flow (textual)', icon: 'flowsheet' },
  { id: 'schema_design', name: 'Schema Design', icon: 'schema' },
  { id: 'user_flow_chart', name: 'User Flow Flow-Chart', icon: 'insights' },
  { id: 'backend_structure', name: 'Backend Structure', icon: 'dns' },
  { id: 'implementation_plan', name: 'Implementation Plan', icon: 'event_note' },
  { id: 'project_rules', name: 'Project Rules & Coding Standards', icon: 'rule' },
  { id: 'security_guidelines', name: 'Security Guidelines', icon: 'security' },
  { id: 'styling_guidelines', name: 'Styling Guidelines', icon: 'palette' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [ideaText, setIdeaText] = useState<string>('');
  const [generatedSpec, setGeneratedSpec] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiApiKeyIsSet, setGeminiApiKeyIsSet] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<'concept' | 'spec' | 'idle'>('idle');
  const [refinedBrief, setRefinedBrief] = useState<string>('');
  const [selectedModules, setSelectedModules] = useState<string[]>(
    ALL_AVAILABLE_MODULES.map(m => m.id) 
  );
  
  const [savedSpecs, setSavedSpecs] = useState<SavedSpec[]>([]);
  const [showSavedSpecsModal, setShowSavedSpecsModal] = useState<boolean>(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Current Spec State
  const [currentSpecId, setCurrentSpecId] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const generationsRemaining = userProfile ? userProfile.generationsLimit - userProfile.generationsUsedThisMonth : null;


  useEffect(() => {
    const geminiKeyExists = typeof import.meta.env.VITE_API_KEY === 'string' && import.meta.env.VITE_API_KEY.trim() !== '';
    setGeminiApiKeyIsSet(geminiKeyExists);
    if (!geminiKeyExists) {
       console.warn("Gemini VITE_API_KEY environment variable is not set. Spec generation will be disabled.");
    }
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthIsLoading(true);
      
      const sessionTimeout = setTimeout(() => {
          console.error("Authentication timed out after 15 seconds. This might be a network or configuration issue.");
          if (authIsLoading) { // Only trigger if it's still loading
            setError("Authentication is taking too long. Please try again later or check your connection.");
            setCurrentUser(null);
            setUserProfile(null);
            setCurrentView('home');
            setAuthIsLoading(false);
          }
      }, 15000); // 15-second timeout

      try {
        if (user) {
          setCurrentUser(user);
          const profile = await getOrCreateUserProfile(user.uid);
          setUserProfile(profile);
          await loadSpecsFromFirestore(user.uid);
          setCurrentView('app');
        } else {
          setCurrentUser(null);
          setSavedSpecs([]);
          setUserProfile(null);
          setCurrentView('home');
        }
      } catch (e: any) {
        console.error("Failed to initialize user session:", e);
        setError(`Failed to load your profile or specs: ${e.message}`);
        setCurrentUser(null);
        setUserProfile(null);
        setCurrentView('home');
      } finally {
        clearTimeout(sessionTimeout);
        setAuthIsLoading(false);
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if(notification) {
      const timer = setTimeout(() => setNotification(null), 7000); // Hide after 7 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadSpecsFromFirestore = async (userId: string) => {
    if (!userId) return;
    try {
      const specs = await getUserSpecs(userId);
      setSavedSpecs(specs);
    } catch (e: any) {
      console.error("Failed to load specs from Firestore:", e);
      setError(`Could not load your saved specifications: ${e.message}`);
    }
  };

  const handleChunkReceived = useCallback((chunk: string) => {
    setGeneratedSpec(prevSpec => prevSpec + chunk);
  }, []);

  const handleConceptExpansionChunkReceived = useCallback((chunk: string) => {
    setRefinedBrief(prevBrief => prevBrief + chunk);
  }, []);

  const handleConceptExpansionComplete = useCallback((completedBrief: string) => {
    setRefinedBrief(completedBrief);
    setGenerationPhase('spec');
  }, []);

  const handleGenerationUsed = useCallback(async () => {
    if (!currentUser || !userProfile) return;
    
    const newCount = userProfile.generationsUsedThisMonth + 1;
    setUserProfile({ ...userProfile, generationsUsedThisMonth: newCount });

    // This is an optimistic update. The actual increment happens on the backend.
    // We do this to make the UI feel instant.
    await incrementGenerationCount(currentUser.uid);
    
    // We can optionally re-fetch the profile to ensure sync, but the optimistic update is usually enough for a good UX.
    // const updatedProfile = await getOrCreateUserProfile(currentUser.uid);
    // setUserProfile(updatedProfile);
  }, [currentUser, userProfile]);

  const handleGenerateSpec = useCallback(async () => {
    if (!geminiApiKeyIsSet) {
      setError("The AI service is not configured correctly. Please try again later.");
      return;
    }
    if (selectedModules.length === 0) {
      setError("Please select at least one documentation module to generate.");
      return;
    }
    if (!currentUser) {
      setError("Please log in to generate a specification.");
      return;
    }
    if (generationsRemaining !== null && generationsRemaining <= 0) {
      setError("You have reached your monthly generation limit for the community plan.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedSpec('');
    setRefinedBrief('');
    setCurrentSpecId(null);
    setGenerationPhase('concept');

    try {
      await handleGenerationUsed(); // Decrement count before generation starts
      const fullSpec = await generateSpecFromIdea(
        ideaText,
        selectedModules,
        handleChunkReceived,
        handleConceptExpansionChunkReceived,
        handleConceptExpansionComplete
      );

      // All users now get the full, unfiltered spec. The value is in the generation limits and premium features.
      setGeneratedSpec(fullSpec);
      setGenerationPhase('idle');

    } catch (err) {
      console.error("Error generating spec:", err);
      if (err instanceof Error) {
        setError(`Failed to generate specification: ${err.message}. Please try again.`);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
      // Re-fetch profile to revert optimistic decrement on failure
      if(currentUser) {
          const profile = await getOrCreateUserProfile(currentUser.uid);
          setUserProfile(profile);
      }
      setGenerationPhase('idle');
    } finally {
      setIsLoading(false);
    }
  }, [ideaText, geminiApiKeyIsSet, selectedModules, handleChunkReceived, handleConceptExpansionChunkReceived, handleConceptExpansionComplete, currentUser, generationsRemaining, handleGenerationUsed]);


  const navigateToApp = () => {
    setCurrentView('app');
  };

  const navigateToBuildingInPublic = () => {
    setCurrentView('building-in-public');
  }

  const handleSaveSpec = async () => {
    if (!generatedSpec || isLoading || !currentUser) {
      alert("No spec generated, generation is in progress, or you are not logged in.");
      return;
    }

    const name = currentSpecId ? undefined : window.prompt("Enter a name for this new specification:", `Spec ${new Date().toLocaleDateString()}`);
    if (name === null) return;

    const specData = {
      name: name || savedSpecs.find(s => s.id === currentSpecId)?.name || 'Untitled Spec',
      ideaText,
      generatedSpec,
      selectedModules,
    };
    
    setIsLoading(true);
    try {
      if (currentSpecId) {
        await updateUserInFirestore(currentSpecId, specData);
        alert(`Specification updated successfully!`);
      } else {
        const newId = await saveSpecToFirestore(currentUser.uid, specData);
        setCurrentSpecId(newId);
        alert(`Specification "${specData.name}" saved to the cloud!`);
      }
      await loadSpecsFromFirestore(currentUser.uid);
    } catch (e: any) {
      console.error("Failed to save spec to Firestore:", e);
      setError(`Could not save specification to the cloud: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const handleLoadSpec = async (specToLoad: SavedSpec) => {
    if (specToLoad) {
      setIdeaText(specToLoad.ideaText);
      setGeneratedSpec(specToLoad.generatedSpec);
      setSelectedModules(Array.isArray(specToLoad.selectedModules) ? specToLoad.selectedModules : ALL_AVAILABLE_MODULES.map(m => m.id));
      setCurrentSpecId(specToLoad.id);
      setError(null);
      setIsLoading(false); 
      setShowSavedSpecsModal(false); 
      setCurrentView('app');
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
      alert(`Specification "${specToLoad.name}" loaded from the cloud.`);
    } else {
      alert("Error: Could not find the specification to load.");
      if(currentUser) loadSpecsFromFirestore(currentUser.uid);
    }
  };

  const handleDeleteSpec = async (specId: string) => {
    if (!currentUser) return;
    const specToDelete = savedSpecs.find(s => s.id === specId);
    if (specToDelete && window.confirm(`Are you sure you want to delete "${specToDelete.name}" from the cloud? This action cannot be undone.`)) {
      try {
        await deleteSpecFromFirestore(specId);
        setSavedSpecs(savedSpecs.filter(s => s.id !== specId));
        alert(`Specification "${specToDelete.name}" deleted from the cloud.`);
        if(currentSpecId === specId) {
            setIdeaText('');
            setGeneratedSpec('');
            setCurrentSpecId(null);
        }
      } catch (e: any) {
        console.error("Failed to delete spec from Firestore:", e);
        setError(`Could not delete specification from the cloud: ${e.message}`);
      }
    }
  };

  const handleSpecContentChange = useCallback((newSpecContent: string) => {
    setGeneratedSpec(newSpecContent);
  }, []);
  
  const handleLogin = async () => {
    setAuthIsLoading(true);
    setError(null);
    try {
      // The new signInWithGoogle uses a popup and will resolve/reject here.
      await signInWithGoogle();
      // onAuthStateChanged will handle the successful login state change automatically.
      // setAuthIsLoading(false) will be called within the onAuthStateChanged listener.
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = `Login failed: ${error.message}.`;
      
      if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = "Sign-in process was cancelled.";
      } else if (error.code === 'auth/popup-blocked') {
          errorMessage = "Sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
      } else if (error.code === 'auth/unauthorized-domain') {
          const firebaseProjectUrl = `https://console.firebase.google.com/project/dulcet-opus-461713-n0/authentication/settings`;
          errorMessage = `Login failed: This application's domain (${window.location.hostname}) is not authorized for sign-in. To fix this, you MUST add "${window.location.hostname}" to the list of 'Authorized domains' in your Firebase project settings. You can access the settings page here: ${firebaseProjectUrl}`;
      }
      
      setError(errorMessage);
      setAuthIsLoading(false); // Reset loading state on explicit failure.
    }
  };
  
  const handleLogout = async () => {
    setError(null);
    try {
      await signOutUser();
      setIdeaText('');
      setGeneratedSpec('');
      setCurrentSpecId(null);
      setError(null);
    } catch (error: any) {
        console.error("Logout failed:", error);
        setError(`Logout failed: ${error.message}`);
    }
  };


  if (authIsLoading && currentView === 'home') {
     return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center bg-base">
             <div className="text-center py-10 text-text-muted">
                <svg className="animate-spin h-8 w-8 text-accent mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Connecting to SpecForge...</p>
            </div>
        </div>
    )
  }

  if (currentView === 'home') {
    return <HomeScreen onGetStarted={navigateToApp} onLogin={handleLogin} currentUser={currentUser} onNavigateToBuildingInPublic={navigateToBuildingInPublic}/>;
  }
  
  const renderAppContent = () => {
    if (authIsLoading) {
        return (
            <div className="w-full h-96 flex items-center justify-center text-center">
                 <div className="text-center py-10 text-text-muted">
                    <svg className="animate-spin h-8 w-8 text-accent mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Authenticating & Loading Profile...</p>
                </div>
            </div>
        )
    }
    
    if (error) {
        return <ErrorMessage message={error} onRetry={currentUser ? undefined : handleLogin} />;
    }

    if (!currentUser) {
        return (
            <div className="w-full max-w-lg mx-auto text-center bg-panel p-10 rounded-lg shadow-xl">
                <span className="material-symbols-outlined text-5xl text-accent mb-4">login</span>
                <h2 className="text-2xl font-bold text-text-heading mb-3 font-display">Welcome to SpecForge</h2>
                <p className="text-text-body mb-6">Please log in to create, manage, and save your technical specifications to the cloud.</p>
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-accent text-white font-semibold rounded-md px-8 py-3 hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-panel focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                    <GoogleLogoIcon className="w-5 h-5 mr-3" />
                    Sign In with Google
                </button>
            </div>
        )
    }
    
    return (
      <>
        <IdeaInputForm
          ideaText={ideaText}
          setIdeaText={setIdeaText}
          onGenerate={handleGenerateSpec}
          isLoading={isLoading}
          apiKeyMissing={!geminiApiKeyIsSet}
          availableModules={ALL_AVAILABLE_MODULES}
          selectedModules={selectedModules}
          onSelectedModulesChange={setSelectedModules}
          isLoggedIn={!!currentUser}
          generationsRemaining={generationsRemaining}
          userProfile={userProfile}
        />

        {isLoading && <ProcessAnimator />}
        
        {error && <ErrorMessage message={error} onRetry={error.includes("generate") ? handleGenerateSpec : undefined} />}

        {(generatedSpec || (isLoading && !generatedSpec)) && !error && (
            <SpecDisplay 
              specContent={generatedSpec} 
              isLoading={isLoading}
              onSaveSpec={handleSaveSpec}
              onSpecContentChange={handleSpecContentChange}
              isLoggedIn={!!currentUser}
              currentSpecId={currentSpecId}
              userProfile={userProfile}
              generationsRemaining={generationsRemaining}
              onGenerationUsed={handleGenerationUsed}
          />
        )}
        {generatedSpec && error && (
              <SpecDisplay 
              specContent={generatedSpec} 
              isLoading={false} 
              onSaveSpec={handleSaveSpec}
              onSpecContentChange={handleSpecContentChange}
              isLoggedIn={!!currentUser}
              currentSpecId={currentSpecId}
              userProfile={userProfile}
              generationsRemaining={generationsRemaining}
              onGenerationUsed={handleGenerationUsed}
          />
        )}
      </>
    )
  }

  const NotificationBanner = () => {
    if (!notification) return null;

    const baseClasses = "fixed top-20 right-5 z-50 p-4 rounded-lg shadow-xl flex items-center max-w-md transition-all duration-300";
    const typeClasses = {
      success: "bg-accent/90 border border-accent-dark text-white",
      info: "bg-panel border border-accent text-text-body",
      error: "bg-danger-DEFAULT border border-red-700 text-white",
    };
    const icon = {
      success: "check_circle",
      info: "info",
      error: "error",
    };
    
    return (
      <div className={`${baseClasses} ${typeClasses[notification.type]}`} role="alert">
        <span className="material-symbols-outlined mr-3">{icon[notification.type]}</span>
        <p className="text-sm font-medium">{notification.message}</p>
        <button onClick={() => setNotification(null)} className="ml-4 p-1 rounded-full hover:bg-black/20">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    );
  };


  return (
    <>
      <NotificationBanner />
      <div className="min-h-screen bg-base text-text-body flex flex-col items-center py-6 px-4 selection:bg-accent selection:text-white">
        <header className="w-full max-w-6xl mx-auto flex flex-wrap justify-between items-center py-4 gap-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              if(currentUser) {
                  setCurrentView('app');
              } else {
                  setCurrentView('home');
              }
            }}
          >
            <div className="w-9 h-9 bg-panel rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined text-accent text-2xl">hub</span>
            </div>
            <span className="text-2xl font-bold text-text-heading font-display">Spec<span className="text-accent">Forge</span></span>
          </div>
          
          {currentUser && userProfile && (
            <nav className="flex items-center space-x-2 sm:space-x-4 text-sm font-medium">
                <button 
                  onClick={() => setCurrentView('app')}
                  className={`px-3 py-2 rounded-md transition-colors ${currentView === 'app' ? 'bg-accent/20 text-accent' : 'text-text-muted hover:bg-panel hover:text-text-body'}`}
                >
                  App
                </button>
                <button 
                  onClick={() => setShowSavedSpecsModal(true)}
                  className="px-3 py-2 rounded-md transition-colors text-text-muted hover:bg-panel hover:text-text-body"
                >
                  My Specs
                </button>
                <div className="flex items-center space-x-3 pl-2 sm:pl-4 border-l border-panel">
                  {currentUser.photoURL && (
                     <img src={currentUser.photoURL} alt={currentUser.displayName || 'User Avatar'} className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <p className="text-text-body text-xs hidden sm:block">{currentUser.displayName}</p>
                    <button 
                      onClick={handleLogout}
                      className="text-xs text-text-muted hover:text-accent"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
            </nav>
          )}
        </header>

        <main className="w-full max-w-6xl mx-auto flex-grow my-8 flex flex-col">
            {currentView === 'app' && renderAppContent()}
            {currentView === 'building-in-public' && <BuildingInPublicPage onGetStarted={navigateToApp} />}
        </main>
        
        {showSavedSpecsModal && currentUser && (
            <SavedSpecsModal
                savedSpecs={savedSpecs}
                onLoadSpec={handleLoadSpec}
                onDeleteSpec={handleDeleteSpec}
                onClose={() => setShowSavedSpecsModal(false)}
                isLoading={isLoading || authIsLoading}
            />
        )}
        
        <footer className="w-full max-w-6xl mx-auto text-center py-6 text-text-muted text-sm border-t border-panel mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} SpecForge. All rights reserved.</p>
           <a
            onClick={() => setCurrentView('building-in-public')}
            className="cursor-pointer hover:text-accent transition-colors font-medium"
          >
            Free Guide: How to Write a Spec
          </a>
        </footer>
      </div>
    </>
  );
};

export default App;
