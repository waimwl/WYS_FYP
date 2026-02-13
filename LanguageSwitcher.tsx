import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zh-HK', label: '繁' },
    { code: 'zh-CN', label: '简' },
  ];

  return (
    <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full shadow-sm border border-emerald-100/50">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
            ${currentLang === lang.code 
              ? 'bg-emerald-500 text-white shadow-md' 
              : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'}
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};