
import React from 'react';

export const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2.25c.346.082.69.173 1.03.272a9.008 9.008 0 014.28 4.28c.099.34.19.684.272 1.03M4.03 15.75c.099.34.19.684.272 1.03a9.008 9.008 0 004.28 4.28c.34.099.684.19 1.03.272"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 12c-.082.346-.173.69-.272 1.03a9.008 9.008 0 01-4.28 4.28c-.34.099-.684.19-1.03.272M2.25 12c.082-.346.173-.69.272-1.03a9.008 9.008 0 014.28-4.28C7.14 6.58 7.484 6.49 7.83 6.408"
    />
  </svg>
);
