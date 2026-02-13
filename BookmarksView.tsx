import React from 'react';
import { SavedRecipe, Translation } from '../types';

interface BookmarksViewProps {
  bookmarks: SavedRecipe[];
  t: Translation;
  onSelectBookmark: (recipe: SavedRecipe) => void;
  onDeleteBookmark: (id: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, t, onSelectBookmark, onDeleteBookmark }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-in fade-in duration-500">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t.savedTitle}</h3>
        <p className="text-gray-500">{t.noSavedMessage}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.savedTitle}</h2>
      <div className="grid gap-4">
        {bookmarks.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-between items-center group">
            <div 
              className="flex-1 cursor-pointer" 
              onClick={() => onSelectBookmark(recipe)}
            >
              <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                {recipe.dishes.map(d => d.name).join(' & ')}
              </h3>
              <p className="text-sm text-gray-500">
                {t.forPeople.replace('{0}', recipe.portionSize.toString())} • {new Date(recipe.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBookmark(recipe.id);
              }}
              className="p-3 text-gray-300 hover:text-red-500 transition-colors"
              aria-label={t.deleteButton}
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};