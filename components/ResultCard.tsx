import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import type { AnalysisResult } from '../services/geminiService';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { PaletteIcon } from './icons/PaletteIcon';
import { PersonIcon } from './icons/PersonIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultCardProps {
  result: AnalysisResult;
  generatedImage?: string | null;
  t: any;
}

const ScoreDisplay: React.FC<{ score: number, t: any }> = ({ score, t }) => {
    const scoreColor = score > 7 ? 'text-green-600 bg-green-100' : score > 4 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100';
    return (
        <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-600">{t.compatibility}</span>
            <span className={`text-lg font-bold px-3 py-1 rounded-full ${scoreColor}`}>{score} / 10</span>
        </div>
    );
};

const Section: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay: number;
}> = ({ icon, title, children, delay }) => (
    <div className="pt-5" style={{ animationDelay: `${delay}ms`}}>
        <div className="flex items-center gap-3">
            {icon}
            <h4 className="text-lg font-bold text-slate-700">{title}</h4>
        </div>
        <div className="text-slate-600 mt-2 pl-10">{children}</div>
    </div>
);

const ResultCard: React.FC<ResultCardProps> = ({ result, generatedImage, t }) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'style-match-ai-virtual-try-on.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative bg-white/80 p-6 rounded-xl border border-slate-200 mt-6 animate-slide-up">
        {/* Gradient Border */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" style={{ zIndex: -1, filter: 'blur(10px)', opacity: 0.5 }}></div>
        
        <div className="space-y-4 divide-y divide-slate-200/80 animate-stagger-children">

          {generatedImage && (
            <div style={{ animationDelay: '100ms' }}>
                <Section 
                    icon={<div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><PersonIcon className="w-5 h-5" /></div>} 
                    title={t.virtualTryOn}
                    delay={100}
                >
                    <div className="relative group mt-2">
                      <img 
                          src={generatedImage} 
                          alt="AI generated try-on" 
                          className="w-full rounded-lg shadow-md"
                      />
                      <button
                        onClick={handleDownload}
                        className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-2.5 hover:bg-black/60 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={t.downloadImage}
                        title={t.downloadImage}
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </button>
                    </div>
                </Section>
            </div>
          )}

          <div className="pt-4 first:pt-0" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><SparklesIcon className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-indigo-800">{result.verdict}</h3>
            </div>
            {result.compatibilityScore !== undefined && (
                <div className="mt-3 pl-10">
                    <ScoreDisplay score={result.compatibilityScore} t={t} />
                </div>
            )}
             <p className="text-slate-600 whitespace-pre-wrap mt-3 pl-10">{result.feedback}</p>
          </div>
          
          {result.colorSuggestions && (
            <Section 
                icon={<div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center"><PaletteIcon className="w-5 h-5" /></div>}
                title={t.colorSuggestions}
                delay={300}
            >
                <p>{result.colorSuggestions}</p>
            </Section>
          )}

          {result.suggestion && (
            <Section 
                icon={<div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"><LightbulbIcon className="w-5 h-5" /></div>}
                title={t.stylistSuggestion}
                delay={400}
            >
                 <p className="whitespace-pre-wrap">{result.suggestion}</p>
            </Section>
          )}
        </div>
    </div>
  );
};


export default ResultCard;