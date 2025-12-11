import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || 32}
      height={props.height || 32}
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logo-gradient)"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm42.4 159.87L128 158.46l-42.4 25.41a8 8 0 0 1-11.45-8.15l13.1-48.44-38-30.83a8 8 0 0 1 4.58-13.91l49.52-2.1L124 33.13a8 8 0 0 1 14.12 0l20.81 47.29 49.52 2.1a8 8 0 0 1 4.58 13.91l-38 30.83 13.1 48.44a8 8 0 0 1-11.45 8.15Z"
      />
    </svg>
  );
}
