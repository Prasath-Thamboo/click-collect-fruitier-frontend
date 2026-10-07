import { useId } from 'react';

// Logo FruityCollect : une goutte-fruit holographique avec feuille néon
export default function Logo({ className = 'w-9 h-9', withText = true, textClassName = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe14d" />
            <stop offset="35%" stopColor="#ff7a45" />
            <stop offset="70%" stopColor="#ff3d7f" />
            <stop offset="100%" stopColor="#6f6bff" />
          </linearGradient>
          <linearGradient id={`${id}-leaf`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2ff5b4" />
            <stop offset="100%" stopColor="#7cf06a" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter={`url(#${id}-glow)`}>
          <path
            d="M24 13c5-3.5 13-2.5 15.5 4.5 3 8.5-3 21.5-10 23.5-2.3.7-3.8-.6-5.5-.6s-3.2 1.3-5.5.6c-7-2-13-15-10-23.5C11 10.5 19 9.5 24 13z"
            fill={`url(#${id}-body)`}
          />
          <path d="M24 13c0-4 1.5-7 4-9" stroke="#7cf06a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M27 8c3-4 9-4.5 12-2-2.5 4-8.5 5-12 2z" fill={`url(#${id}-leaf)`} />
          <path d="M14 21c.6-3 2.6-5 5.4-5.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75" />
          {/* circuit discret */}
          <path d="M24 22v8m0 0l-4 4m4-4l4 4" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="22" r="1.4" fill="#fff" />
          <circle cx="20" cy="34" r="1.1" fill="#fff" opacity="0.8" />
          <circle cx="28" cy="34" r="1.1" fill="#fff" opacity="0.8" />
        </g>
      </svg>
      {withText && (
        <span className={`font-display font-extrabold tracking-tight text-lg ${textClassName}`}>
          Fruity<span className="text-fruit">Collect</span>
        </span>
      )}
    </span>
  );
}
