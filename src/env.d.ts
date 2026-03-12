/// <reference types="astro/client" />

declare global {
  interface Window {
    theme?: { setTheme: (t: string) => void; getTheme: () => string }
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'theme-toggle': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { 'data-locale'?: string },
      HTMLElement
    >
  }
}
