import React, { useState, useEffect } from 'react';
import { Translation } from '../types';
import { Button } from './Button';

interface InputFormProps {
  t: Translation;
  onSubmit: (familySize: number, dish: string) => void;
  isLoading: boolean;
  initialDish?: string;
}

export const InputForm: React.FC<InputFormProps> = ({ t, onSubmit, isLoading, initialDish }) => {
  const [familySize, setFamilySize] = useState(2);
  const [dish, setDish] = useState(initialDish || '');

  // Update dish if initialDish changes prop changes
  useEffect(() => {
    if (initialDish) {
      setDish(initialDish);
    }
  }, [initialDish]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dish.trim()) {
      onSubmit(familySize, dish);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
          {t.familySizeLabel}
        </label>
        
        <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-xl">
          <button
            type="button"
            onClick={() => setFamilySize(Math.max(1, familySize - 1))}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-800">{familySize}</span>
            <span className="text-xs text-emerald-600 font-medium">{t.peopleUnit}</span>
          </div>

          <button
            type="button"
            onClick={() => setFamilySize(Math.min(20, familySize + 1))}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <label htmlFor="dish" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          {t.dishInputLabel}
        </label>
        <textarea
          id="dish"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder={t.dishInputPlaceholder}
          className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl transition-all outline-none resize-none text-gray-800 placeholder-gray-400"
          rows={3}
          required
        />
      </div>

      <Button type="submit" isLoading={isLoading}>
        {t.submitButton}
      </Button>
    </form>
  );
};