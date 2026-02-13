import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from './constants';
import { Language, RecipeResponse, ViewState, SavedRecipe } from './types';
import { generateMealPlan } from './services/geminiService';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { InputForm } from './components/InputForm';
import { ResultView } from './components/ResultView';
import { BottomNav } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { BookmarksView } from './components/BookmarksView';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh-HK');
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentDish, setCurrentDish] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<SavedRecipe[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem('hk_chef_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const t = TRANSLATIONS[language];

  // Helper to persist bookmarks
  const saveBookmarks = (newBookmarks: SavedRecipe[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('hk_chef_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleGenerate = async (familySize: number, dish: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentDish(dish);
    try {
      const data = await generateMealPlan(familySize, dish, language);
      setResult(data);
      setCurrentView('result');
    } catch (err) {
      console.error(err);
      setError(t.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePortion = async (newSize: number) => {
    if (currentDish) {
      await handleGenerate(newSize, currentDish);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCurrentDish('');
    setCurrentView('home');
  };

  const handleToggleBookmark = (data: RecipeResponse) => {
    if (!currentDish) return; // Should not happen

    // Check if already exists (by name and portion for simplicity, or just simple ID)
    const existingId = bookmarks.findIndex(b => b.dishes[0].name === data.dishes[0].name && b.portionSize === data.portionSize);
    
    if (existingId > -1) {
      // Remove
      const newB = [...bookmarks];
      newB.splice(existingId, 1);
      saveBookmarks(newB);
    } else {
      // Add
      const newRecipe: SavedRecipe = {
        ...data,
        id: Date.now().toString(),
        originalQuery: currentDish,
        createdAt: Date.now()
      };
      saveBookmarks([newRecipe, ...bookmarks]);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    const newB = bookmarks.filter(b => b.id !== id);
    saveBookmarks(newB);
  };

  const handleSelectBookmark = (recipe: SavedRecipe) => {
    setResult(recipe);
    setCurrentDish(recipe.originalQuery);
    setCurrentView('result');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: t.subtitle,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Basic alert for fallback, in a real app a toast is better
      alert(t.shareSuccess);
    }
  };

  // Check if current result is bookmarked
  const isCurrentBookmarked = result 
    ? bookmarks.some(b => b.dishes[0]?.name === result.dishes[0]?.name && b.portionSize === result.portionSize)
    : false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-[60px] flex items-center">
        <div className="max-w-md mx-auto w-full px-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('home')} 
          >
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">HK Household Chef</h1>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight sm:hidden">HK Chef</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              aria-label={t.shareButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
            <LanguageSwitcher currentLang={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6">
        
        {/* VIEW: HOME (INPUT) */}
        {currentView === 'home' && (
          <>
            <div className="text-center mb-8 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{t.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{t.subtitle}</p>
            </div>
            
            <InputForm 
              t={t} 
              onSubmit={handleGenerate} 
              isLoading={isLoading} 
              initialDish={currentDish}
            />
            
            {error && (
               <div className="mt-6 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                   <p className="font-bold">{t.errorTitle}</p>
                   <p className="text-sm">{t.errorMessage}</p>
                </div>
               </div>
            )}
            
            {/* Quick Explore Hint */}
            <div className="mt-8 text-center">
               <button 
                 onClick={() => setCurrentView('explore')}
                 className="text-emerald-600 text-sm font-semibold hover:text-emerald-700"
               >
                 {t.exploreTitle} →
               </button>
            </div>
          </>
        )}

        {/* VIEW: RESULT */}
        {currentView === 'result' && result && (
          <ResultView 
            data={result} 
            t={t} 
            onReset={handleReset} 
            onUpdatePortion={handleUpdatePortion}
            isUpdating={isLoading}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={isCurrentBookmarked}
          />
        )}

        {/* VIEW: EXPLORE */}
        {currentView === 'explore' && (
          <ExploreView 
            t={t} 
            lang={language} 
            onSelectDish={(dish) => {
              setCurrentDish(dish);
              setCurrentView('home');
            }} 
          />
        )}

        {/* VIEW: BOOKMARKS */}
        {currentView === 'bookmarks' && (
          <BookmarksView 
            bookmarks={bookmarks} 
            t={t} 
            onSelectBookmark={handleSelectBookmark}
            onDeleteBookmark={handleDeleteBookmark}
          />
        )}

      </main>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onChangeView={setCurrentView} t={t} />

    </div>
  );
};

export default App;