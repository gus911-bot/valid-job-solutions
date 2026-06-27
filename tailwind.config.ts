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
        background: '#0C100E', // fond de page (charbon très profond)
        ink: {
          DEFAULT: '#0C100E',
          900: '#0A0D0B',
          800: '#111713',
          700: '#1B2420',
        },
        // Surfaces (cartes, panneaux) sur fond sombre.
        surface: {
          DEFAULT: '#161E19',
          100: '#161E19',
          200: '#1C2620',
          300: '#25322B',
        },
        gold: {
          DEFAULT: '#D4A04C',
          light: '#E8A33D',
          dark: '#C79A4A',
        },
        cream: '#F7F3EA',
        muted: '#9AA39C',
        line: 'rgba(245, 240, 230, 0.12)',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 18px 50px -18px rgba(0, 0, 0, 0.65)',
        glow: '0 18px 60px -14px rgba(212, 160, 76, 0.35)',
        'gold-ring': '0 0 0 1px rgba(212, 160, 76, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8A33D 0%, #D4A04C 100%)',
        'ink-gradient': 'linear-gradient(160deg, #141B17 0%, #0A0D0B 100%)',
        'surface-gradient': 'linear-gradient(160deg, #1A231E 0%, #12181400 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'float-slow': 'float-slow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
