import type { SVGProps } from "react";

/** Wide rounded “screen with play” glyph used on every Watch Now button */
export function PlaySquareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 26 20" fill="none" aria-hidden {...props}>
      <rect x="1.25" y="2.25" width="23.5" height="15.5" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M10.6 6.9v6.2c0 .5.55.8.97.53l4.6-3.1a.62.62 0 0 0 0-1.06l-4.6-3.1a.62.62 0 0 0-.97.53Z" fill="currentColor" />
    </svg>
  );
}
