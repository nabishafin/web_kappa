import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function GoogleIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.27a12 12 0 0 0 0 10.76l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

export function FacebookColorIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path fill="#fff" d="M16.67 15.47 17.2 12h-3.33V9.75c0-.95.47-1.87 1.95-1.87h1.51V4.93s-1.37-.23-2.68-.23c-2.74 0-4.53 1.66-4.53 4.66V12H7.08v3.47h3.04V24a12.1 12.1 0 0 0 3.75 0v-8.53h2.8Z" />
    </svg>
  );
}

export function FacebookIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function TwitterIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.95 4.57a10 10 0 0 1-2.82.77 4.96 4.96 0 0 0 2.16-2.72c-.95.56-2 .96-3.12 1.19a4.92 4.92 0 0 0-8.38 4.48A13.93 13.93 0 0 1 1.64 3.16a4.92 4.92 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.61v.06a4.92 4.92 0 0 0 3.95 4.83 4.96 4.96 0 0 1-2.21.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.05 0 14-7.5 14-13.98 0-.21 0-.42-.02-.63A9.94 9.94 0 0 0 24 4.59l-.05-.02Z" />
    </svg>
  );
}

export function LinkedInIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** TipJar — the jar glyph used for donations on title pages */
export function JarIcon(props: P) {
  return (
    <svg viewBox="0 0 32 36" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" aria-hidden {...props}>
      <rect x="7" y="1.5" width="18" height="5" rx="1.6" />
      <path d="M8.5 6.5c-3 1.6-5.5 3.6-5.5 7.5v14.5a5.5 5.5 0 0 0 5.5 5.5h15a5.5 5.5 0 0 0 5.5-5.5V14c0-3.9-2.5-5.9-5.5-7.5" />
    </svg>
  );
}

/** Hand-with-heart used on the “donation” button */
export function DonateIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.2 2.2c-1.1 0-2 .6-2.5 1.4-.5-.8-1.4-1.4-2.5-1.4A2.9 2.9 0 0 0 8.4 5.1c0 2.6 3.8 5 5.3 5.9 1.5-.9 5.3-3.3 5.3-5.9a2.9 2.9 0 0 0-2.8-2.9Z" />
      <path d="M1 12.5h3.2V22H1zM5.6 13v8.3l7.3 1.5c.6.1 1.2 0 1.7-.3l7.6-4.8c.8-.5 1-1.5.5-2.2a1.6 1.6 0 0 0-2.1-.6l-4.6 2.3h-3.4v-1.3h2.9a1.5 1.5 0 0 0 0-3H9.7c-.6 0-1.2.2-1.7.5L5.6 13Z" />
    </svg>
  );
}
