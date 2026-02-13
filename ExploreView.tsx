import React from 'react';
import { CATEGORIES } from '../constants';
import { Translation, Language } from '../types';

interface ExploreViewProps {
  t: Translation;
  lang: Language;
  onSelectDish: (dishName: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ t, lang, onSelectDish }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.exploreTitle}</h2>
      
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-white p-4 border-b border-gray-50 flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="font-bold text-gray-800 text-lg">{cat.label[lang]}</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {cat.suggestions.map((dish, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectDish(dish)}
                  className="text-left text-sm p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:font-medium text-gray-700 transition-colors border border-transparent hover:border-emerald-100"
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};