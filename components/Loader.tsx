import React, { useState, useEffect } from 'react';

interface LoaderProps {
  t: any;
}

// A more visually appealing loader animation
const StylishLoader: React.FC = () => (
    <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
        <div 
            className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
        ></div>
        <div 
            className="absolute inset-2 border-2 border-purple-200 rounded-full"
        ></div>
         <div 
            className="absolute inset-2 border-2 border-t-purple-500 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
    </div>
);

const subMessages = [
    "Analyzing color harmonies...",
    "Checking style compatibility...",
    "Consulting the latest trends...",
    "Tailoring recommendations...",
    "Generating your virtual look...",
];

const Loader: React.FC<LoaderProps> = ({ t }) => {
  const [currentSubMessage, setCurrentSubMessage] = useState(subMessages[0]);
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % subMessages.length;
      setCurrentSubMessage(subMessages[index]);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
      <StylishLoader />
      <div>
        <p className="text-slate-700 font-semibold text-lg">{t.loaderMessage}</p>
        <p className="text-sm text-slate-500 mt-1 transition-opacity duration-500">{currentSubMessage}</p>
      </div>
    </div>
  );
};

export default Loader;