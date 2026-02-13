import React, { useState, useEffect } from 'react';
import { RecipeResponse, Translation, Ingredient } from '../types';
import { Button } from './Button';

interface ResultViewProps {
  data: RecipeResponse;
  t: Translation;
  onReset: () => void;
  onUpdatePortion: (newSize: number) => void;
  isUpdating: boolean;
  onToggleBookmark?: (data: RecipeResponse) => void;
  isBookmarked?: boolean;
}

const IngredientRow: React.FC<{ ingredient: Ingredient; t: Translation }> = ({ ingredient, t }) => (
  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 last:border-0 hover:bg-emerald-50/30 transition-colors gap-4">
    <div className="flex-1">
      <div className="flex items-baseline gap-2 mb-1">
        <p className="font-bold text-gray-800 text-lg">{ingredient.name}</p>
      </div>
      {ingredient.notes && (
        <p className="text-xs text-gray-500 italic">{ingredient.notes}</p>
      )}
    </div>
    
    <div className="flex gap-3 w-full md:w-auto">
      {/* Wet Market Block */}
      <div className="flex-1 md:w-32 bg-orange-50/50 rounded-xl p-3 border border-orange-100/50 flex flex-col justify-between">
        <div className="text-orange-800/60 font-bold text-[10px] uppercase tracking-wider mb-1">{t.marketLabel}</div>
        <div className="flex flex-col items-end">
          <div className="font-extrabold text-2xl text-orange-600 leading-none">
            <span className="text-sm align-top mr-0.5">$</span>{ingredient.prices.market}
          </div>
          <div className="text-sm font-semibold text-gray-700 bg-white/50 px-2 py-0.5 rounded mt-1 border border-orange-100">
            {ingredient.marketQuantity}
          </div>
        </div>
      </div>

      {/* Supermarket Block */}
      <div className="flex-1 md:w-32 bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex flex-col justify-between">
        <div className="text-blue-800/60 font-bold text-[10px] uppercase tracking-wider mb-1">{t.supermarketLabel}</div>
        <div className="flex flex-col items-end">
          <div className="font-extrabold text-2xl text-blue-600 leading-none">
            <span className="text-sm align-top mr-0.5">$</span>{ingredient.prices.supermarket}
          </div>
          <div className="text-sm font-semibold text-gray-700 bg-white/50 px-2 py-0.5 rounded mt-1 border border-blue-100">
            {ingredient.supermarketQuantity}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ResultView: React.FC<ResultViewProps> = ({ 
  data, 
  t, 
  onReset, 
  onUpdatePortion, 
  isUpdating,
  onToggleBookmark,
  isBookmarked 
}) => {
  const [localSize, setLocalSize] = useState(data.portionSize);

  // Sync local size if external data updates
  useEffect(() => {
    setLocalSize(data.portionSize);
  }, [data.portionSize]);

  const handleUpdate = () => {
    if (localSize !== data.portionSize) {
      onUpdatePortion(localSize);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      
      {/* Portion Controller & Bookmark */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-[72px] z-30 backdrop-blur-md bg-white/95">
        <div className="flex justify-between items-center mb-4">
           {/* Bookmark Button */}
           <button 
             onClick={() => onToggleBookmark && onToggleBookmark(data)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
               isBookmarked 
               ? 'bg-rose-100 text-rose-600' 
               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
             }`}
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
             </svg>
             {isBookmarked ? t.savedButton : t.saveButton}
           </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4">
              <button
                onClick={() => setLocalSize(Math.max(1, localSize - 1))}
                disabled={isUpdating}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
              </button>
              <div className="text-center min-w-[4rem]">
                <span className="text-3xl font-bold text-gray-900 tabular-nums">{localSize}</span>
                <div className="text-xs text-gray-500 font-medium uppercase">{t.peopleUnit}</div>
              </div>
              <button
                onClick={() => setLocalSize(Math.min(20, localSize + 1))}
                disabled={isUpdating}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
          </div>
          {localSize !== data.portionSize && (
             <Button variant="primary" onClick={handleUpdate} isLoading={isUpdating} className="py-2 text-sm w-auto px-8 shadow-none h-10">
               {t.updateButton}
             </Button>
          )}
        </div>
      </div>

      {/* Common Ingredients */}
      {data.commonIngredients.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-slate-700 p-3 px-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-white font-bold">{t.commonIngredientsTitle}</h3>
          </div>
          <div>
            {data.commonIngredients.map((ing, idx) => (
              <IngredientRow key={idx} ingredient={ing} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Dishes Loop */}
      {data.dishes.map((dish, index) => (
        <div key={index} className="space-y-4">
          
          {/* Dish Ingredients Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 p-3 px-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-white font-bold">{t.ingredientsTitle} {dish.name}</h3>
            </div>
            <div>
              {dish.ingredients.map((ing, idx) => (
                <IngredientRow key={idx} ingredient={ing} t={t} />
              ))}
            </div>
          </div>

          {/* Cooking Steps Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="bg-amber-500 p-3 px-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-white font-bold">{t.cookingStepsTitle}</h3>
             </div>
             <div className="p-5">
               <ol className="relative border-l border-amber-200 ml-3 space-y-6">
                 {dish.cookingSteps.map((step, stepIdx) => (
                   <li key={stepIdx} className="ml-6">
                     <span className="absolute flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full -left-3 ring-4 ring-white text-amber-600 font-bold text-xs">
                       {stepIdx + 1}
                     </span>
                     <p className="text-gray-700 leading-relaxed">{step}</p>
                   </li>
                 ))}
               </ol>
             </div>
          </div>
        </div>
      ))}

      {/* Shopping Tips Card */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="p-4 border-b border-orange-100 flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-orange-900 font-bold text-lg">{t.shoppingTipsTitle}</h3>
        </div>
        <ul className="p-4 space-y-3">
          {data.shoppingTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-2.5"></span>
              <p className="text-gray-700 leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Disclaimer */}
      <div className="text-center pb-8 px-4">
        <p className="text-xs text-gray-400">{t.priceDisclaimer}</p>
      </div>

      <div className="pt-4">
        <Button variant="secondary" onClick={onReset}>
          {t.resetButton}
        </Button>
      </div>
    </div>
  );
};