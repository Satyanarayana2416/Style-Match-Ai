import React from 'react';

export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* These circles represent dabs of paint on the palette */}
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
    {/* This path creates the main palette shape */}
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.926-.746-1.648-1.648-1.648-.926 0-1.648-.746-1.648-1.648 0-.926.746-1.648 1.648-1.648.926 0 1.648-.746 1.648-1.648 0-.926-.746-1.648-1.648-1.648-.926 0-1.648-.746-1.648-1.648 0-.926.746-1.648 1.648-1.648.926 0 1.648-.746 1.648-1.648A10 10 0 0 0 12 2z"></path>
  </svg>
);
