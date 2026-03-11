/// <reference types="astro/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'dark-mode-toggle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
  }
}

declare global {
  interface Window {
    theme?: { setTheme: (t: string) => void; getTheme: () => string }
  }
}
