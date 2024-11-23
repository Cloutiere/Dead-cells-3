import { createTheme } from '@/lib/utils';

export const theme = {
  colors: {
    primary: {
      DEFAULT: 'hsl(230, 40%, 25%)', // Deep navy blue
      50: 'hsl(230, 40%, 95%)',
      100: 'hsl(230, 40%, 90%)',
      200: 'hsl(230, 40%, 80%)',
      300: 'hsl(230, 40%, 70%)',
      400: 'hsl(230, 40%, 60%)',
      500: 'hsl(230, 40%, 50%)',
      600: 'hsl(230, 40%, 40%)',
      700: 'hsl(230, 40%, 30%)',
      800: 'hsl(230, 40%, 20%)',
      900: 'hsl(230, 40%, 10%)',
    },
    accent: {
      DEFAULT: 'hsl(350, 80%, 55%)', // Rich crimson
      soft: 'hsl(350, 80%, 90%)',
    },
    neutral: {
      50: 'hsl(230, 10%, 98%)',
      100: 'hsl(230, 10%, 95%)',
      200: 'hsl(230, 10%, 90%)',
      300: 'hsl(230, 10%, 80%)',
      400: 'hsl(230, 10%, 70%)',
      500: 'hsl(230, 10%, 60%)',
      600: 'hsl(230, 10%, 50%)',
      700: 'hsl(230, 10%, 40%)',
      800: 'hsl(230, 10%, 30%)',
      900: 'hsl(230, 10%, 20%)',
    },
  },
  animation: {
    card: {
      flip: 'flip 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      hover: 'hover 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      move: 'move 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  shadows: {
    card: {
      default: '0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
      hover: '0 8px 16px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(0, 0, 0, 0.05)',
      active: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    zone: {
      default: '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)',
      hover: '0 2px 6px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
    },
  },
} as const;