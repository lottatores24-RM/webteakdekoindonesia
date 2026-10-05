import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './content/**/*.mdx'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '24px', lg: '48px' },
      screens: { '2xl': '1376px' },
    },
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        // Terracotta from the logo — used for CTAs and backgrounds
        accent: {
          DEFAULT: '#8E2B25',
          hover: '#76221D',
          // accessible accent for text, swaps to a lighter tone in dark mode
          text: 'rgb(var(--accent-text) / <alpha-value>)',
        },
        forest: {
          DEFAULT: '#1E3A2B',
          deep: '#162B20',
        },
        oncream: '#E8E3D8',
        gold: '#D4A04A',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(36px, 7vw, 72px)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        h2: ['clamp(28px, 5vw, 48px)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        body: ['17px', { lineHeight: '1.65' }],
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgb(26 25 23 / 0.18)',
        lift: '0 14px 34px -14px rgb(26 25 23 / 0.35)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'wa-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgb(37 211 102 / 0.55)' },
          '100%': { boxShadow: '0 0 0 18px rgb(37 211 102 / 0)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out both',
        'wa-pulse': 'wa-pulse 1.6s ease-out 3',
        bob: 'bob 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
