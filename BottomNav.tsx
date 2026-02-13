import React from 'react';
import { ViewState, Translation } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  t: Translation;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, t }) => {
  const getButtonClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-full py-2 transition-colors ${
      (currentView === view || (currentView === 'result' && view === 'home'))
        ? 'text-emerald-600' 
        : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-1 px-4 flex justify-around items-end z-50 h-[80px] pb-6">
      <button onClick={() => onChangeView('home')} className={getButtonClass('home')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill={currentView === 'home' || currentView === 'result' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span className="text-[10px] font-medium">{t.navHome}</span>
      </button>

      <button onClick={() => onChangeView('explore')} className={getButtonClass('explore')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill={currentView === 'explore' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
        <span className="text-[10px] font-medium">{t.navExplore}</span>
      </button>

      <button onClick={() => onChangeView('bookmarks')} className={getButtonClass('bookmarks')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill={currentView === 'bookmarks' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        <span className="text-[10px] font-medium">{t.navSaved}</span>
      </button>
    </div>
  );
};