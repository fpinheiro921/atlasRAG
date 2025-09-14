
import React from 'react';

export const AnimatedArrowIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 102 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="arrow-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--tw-color-accent)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--tw-color-accent)" />
          <stop offset="70%" stopColor="var(--tw-color-accent)" />
          <stop offset="100%" stopColor="var(--tw-color-accent)" stopOpacity="0" />
        </linearGradient>
        <style>
          {`
            @keyframes dash {
              from {
                stroke-dashoffset: 250;
              }
              to {
                stroke-dashoffset: 0;
              }
            }
            .animated-arrow-path {
              stroke-dasharray: 250;
              stroke-dashoffset: 250;
              animation: dash 2s ease-in-out infinite alternate;
            }
          `}
        </style>
      </defs>
      <path
        d="M2 29C22.5 5.5 66-17.5 100 29M100 29L81.5 15.5M100 29L83 45"
        stroke="url(#arrow-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animated-arrow-path"
      />
    </svg>
  );
};
