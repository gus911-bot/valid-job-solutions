import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark luxury : charbon profond + or + crème.
        background: '#111827', // fond de page (charbon très profond)
        ink: {
          DEFAULT: '#111827',
          900: '#0D1320',
          800: '#151D2E',
          700: '#1E2738',
        },
        // Surfaces (cartes, panneaux) sur fond sombre.
        surface: {
          DEFAULT: '#182133',
          100: '#182133',
          200: '#1F2A3F',
          300: '#29354D',
        },
        gold: {
          DEFAULT: '#E0B15E',
          light: '#EBC47E',
          dark: '#D4A04C',
        },
        cream: '#E8ECF2',
        muted: '#A3AEC2',
        line: 'rgba(255, 255, 255, 0.09)',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        script: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px -12px rgba(0, 0, 0, 0.5)',
        glow: '0 1px 0 0 rgba(255, 255, 255, 0.25) inset, 0 8px 24px -10px rgba(224, 177, 94, 0.35)',
        'gold-ring': '0 0 0 1px rgba(212, 160, 76, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(180deg, #EBC47E 0%, #E0B15E 100%)',
        'ink-gradient': 'linear-gradient(180deg, #151D2E 0%, #111827 100%)',
        'surface-gradient': 'radial-gradient(60% 80% at 50% 0%, rgba(224, 177, 94, 0.10) 0%, transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
