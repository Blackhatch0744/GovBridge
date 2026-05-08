/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FAFAF8',
          secondary: '#F5F2EE',
        },
        surface: '#FFFFFF',
        border: '#E8E2DA',
        text: {
          primary: '#0A0A0A',
          secondary: '#6B6560',
        },
        accent: {
          black: '#111111',
          beige: '#D4C5B0',
        },
        success: '#1A5C38',
        warning: '#92600A',
        error: '#8B1A1A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        12: ['12px', { lineHeight: '16px' }],
        14: ['14px', { lineHeight: '20px' }],
        16: ['16px', { lineHeight: '24px' }],
        18: ['18px', { lineHeight: '28px' }],
        24: ['24px', { lineHeight: '32px' }],
        32: ['32px', { lineHeight: '40px' }],
        48: ['48px', { lineHeight: '56px' }],
        64: ['64px', { lineHeight: '72px' }],
        80: ['80px', { lineHeight: '88px' }],
      },
      transitionTimingFunction: {
        entry: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        micro: '300ms',
        page: '600ms',
        cinematic: '1200ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
