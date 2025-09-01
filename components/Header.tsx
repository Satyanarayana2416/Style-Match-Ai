import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { languages, LanguageCode } from '../lib/translations';

interface HeaderProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: any; // Simplified type for translations object
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t }) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="bg-white/60 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-slate-900/10">
      <div className="container mx-auto max-w-2xl px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {t.headerTitle}
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 200)} // Close on blur with a small delay
            className="p-2 rounded-full hover:bg-slate-100/80 transition-colors"
            aria-label="Select language"
          >
            <GlobeIcon className="w-6 h-6 text-slate-600" />
          </button>
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-slate-200 py-1 animate-pop-in origin-top-right">
              {Object.entries(languages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code as LanguageCode);
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    language === code
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-700 hover:bg-indigo-50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;