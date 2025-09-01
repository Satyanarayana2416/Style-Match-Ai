import React from 'react';

export const CaptureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    width="80" 
    height="80" 
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="group"
  >
    <circle 
      cx="40" 
      cy="40" 
      r="38" 
      fill="white" 
      fillOpacity="0.3" 
      stroke="white" 
      strokeWidth="4"
      className="transition-all duration-200 group-hover:fill-opacity-40"
    />
    <circle 
      cx="40" 
      cy="40" 
      r="30" 
      fill="white"
      className="transition-transform duration-200 group-hover:scale-95"
    />
  </svg>
);