
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import { analyzeClothingPair, analyzePairCompatibility, analyzeSareeCompatibility } from './services/geminiService';
import type { AnalysisResult } from './services/geminiService';
import { translations, languages, LanguageCode } from './lib/translations';

type Mode = 'outfit' | 'pair' | 'saree';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('outfit');
  
  // State for single outfit mode
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State for pair/saree matching mode
  const [faceImageFile, setFaceImageFile] = useState<File | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const [itemImageFile1, setItemImageFile1] = useState<File | null>(null); // Used for item 1 in pair, or saree in saree mode
  const [itemImagePreview1, setItemImagePreview1] = useState<string | null>(null);
  const [itemImageFile2, setItemImageFile2] = useState<File | null>(null); // Used for item 2 in pair mode only
  const [itemImagePreview2, setItemImagePreview2] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Load language from local storage on initial render
  useEffect(() => {
    const savedLang = localStorage.getItem('style-match-ai-lang') as LanguageCode;
    if (savedLang && languages[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('style-match-ai-lang', language);
  }, [language]);

  const t = translations[language];

  const handleImageChange = (file: File | null, slot?: 'face' | 1 | 2) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (mode === 'outfit') {
        setImageFile(file);
        setImagePreview(result);
      } else { // Handles 'pair' and 'saree' modes
        if (slot === 'face') {
          setFaceImageFile(file);
          setFaceImagePreview(result);
        } else if (slot === 1) {
          setItemImageFile1(file);
          setItemImagePreview1(result);
        } else { // slot === 2, only for 'pair' mode
          setItemImageFile2(file);
          setItemImagePreview2(result);
        }
      }
    };
    reader.readAsDataURL(file);
    setResult(null);
    setError(null);
    setGeneratedImage(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setGeneratedImage(null);

    try {
      let analysisResult;
      let b64Image;

      if (mode === 'outfit' && imageFile) {
        analysisResult = await analyzeClothingPair(imageFile, language);
        setResult(analysisResult);
      } else if (mode === 'pair' && faceImageFile && itemImageFile1 && itemImageFile2) {
        ({ analysis: analysisResult, generatedImage: b64Image } = await analyzePairCompatibility(faceImageFile, itemImageFile1, itemImageFile2, language));
        setResult(analysisResult);
      } else if (mode === 'saree' && faceImageFile && itemImageFile1) {
        ({ analysis: analysisResult, generatedImage: b64Image } = await analyzeSareeCompatibility(faceImageFile, itemImageFile1, language));
        setResult(analysisResult);
      } else {
        setError(t.errorPrompt);
        setIsLoading(false);
        return;
      }

      if (b64Image) {
        setGeneratedImage(`data:image/png;base64,${b64Image}`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [mode, imageFile, faceImageFile, itemImageFile1, itemImageFile2, language, t.errorPrompt]);

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setFaceImageFile(null);
    setFaceImagePreview(null);
    setItemImageFile1(null);
    setItemImagePreview1(null);
    setItemImageFile2(null);
    setItemImagePreview2(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setGeneratedImage(null);
  };
  
  const isAnalyzeDisabled = (() => {
    if (isLoading) return true;
    switch (mode) {
      case 'outfit': return !imageFile;
      case 'pair': return !faceImageFile || !itemImageFile1 || !itemImageFile2;
      case 'saree': return !faceImageFile || !itemImageFile1;
      default: return true;
    }
  })();

  const getButtonText = () => {
    switch (mode) {
      case 'outfit': return t.analyzeOutfit;
      case 'pair': return t.matchPair;
      case 'saree': return t.matchSaree;
    }
  };

  const getDescription = () => {
    switch (mode) {
        case 'outfit': return t.outfitDescription;
        case 'pair': return t.pairDescription;
        case 'saree': return t.sareeDescription;
    }
  }

  const ModeButton: React.FC<{
    currentMode: Mode,
    targetMode: Mode,
    onClick: () => void,
    children: React.ReactNode
  }> = ({ currentMode, targetMode, onClick, children }) => (
    <button 
      onClick={onClick}
      className={`relative w-full py-2.5 px-4 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 ${
        currentMode === targetMode 
          ? 'text-indigo-600' 
          : 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-600'
      }`}
    >
      {currentMode === targetMode && (
        <span 
          style={{ borderRadius: 'inherit' }}
          className="absolute inset-0 bg-white shadow-md"
        ></span>
      )}
       <span className="relative z-10">{children}</span>
    </button>
  );

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-transparent font-sans text-slate-800">
        <Header language={language} setLanguage={setLanguage} t={t} />
        <main className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
          <div 
            className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500 p-6 md:p-8 space-y-6 animate-slide-up"
            style={{'--animation-delay': '100ms'} as React.CSSProperties}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800">{t.getInstantFeedback}</h2>
              <p className="text-slate-500 mt-2 max-w-prose mx-auto">
                {getDescription()}
              </p>
            </div>

            {/* Mode Selector */}
            <div className="flex justify-center bg-slate-100 rounded-xl p-1.5">
              <ModeButton currentMode={mode} targetMode='outfit' onClick={() => { setMode('outfit'); handleReset(); }}>{t.analyzeOutfit}</ModeButton>
              <ModeButton currentMode={mode} targetMode='pair' onClick={() => { setMode('pair'); handleReset(); }}>{t.matchAPair}</ModeButton>
              <ModeButton currentMode={mode} targetMode='saree' onClick={() => { setMode('saree'); handleReset(); }}>{t.matchASaree}</ModeButton>
            </div>
            
            {mode === 'outfit' && (
              <ImageUploader imagePreview={imagePreview} onImageChange={(file) => handleImageChange(file)} disabled={isLoading} placeholder={t.uploaderPlaceholderDefault} t={t} />
            )}
            
            {mode === 'pair' && (
              <div className="space-y-4">
                <ImageUploader imagePreview={faceImagePreview} onImageChange={(file) => handleImageChange(file, 'face')} disabled={isLoading} placeholder={t.uploaderPlaceholderFace} t={t} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <ImageUploader imagePreview={itemImagePreview1} onImageChange={(file) => handleImageChange(file, 1)} disabled={isLoading} placeholder={t.uploaderPlaceholderItem1} t={t} />
                  <ImageUploader imagePreview={itemImagePreview2} onImageChange={(file) => handleImageChange(file, 2)} disabled={isLoading} placeholder={t.uploaderPlaceholderItem2} t={t} />
                </div>
              </div>
            )}

            {mode === 'saree' && (
               <div className="space-y-4">
                 <ImageUploader imagePreview={faceImagePreview} onImageChange={(file) => handleImageChange(file, 'face')} disabled={isLoading} placeholder={t.uploaderPlaceholderFace} t={t} />
                 <ImageUploader imagePreview={itemImagePreview1} onImageChange={(file) => handleImageChange(file, 1)} disabled={isLoading} placeholder={t.uploaderPlaceholderSaree} t={t} />
               </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-pop-in" role="alert">
                <p className="font-bold">{t.errorTitle}</p>
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzeDisabled}
                className="w-full flex-grow bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
              >
                {getButtonText()}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors duration-300 disabled:opacity-50"
              >
                {t.reset}
              </button>
            </div>

            {isLoading && <Loader t={t} />}
            
            {result && !isLoading && <ResultCard result={result} generatedImage={generatedImage} t={t} />}
          </div>
          <footer className="text-center mt-8 text-slate-500 text-sm">
              <p>{t.poweredBy}</p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default App;