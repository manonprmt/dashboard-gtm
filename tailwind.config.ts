import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        meta: {
          blue: '#1877F2',
          darkblue: '#0C5FD6',
        },
        // Picta Organic design system colors
        primary: {
          50:  '#F7F0FF',
          100: '#EAD6FF',
          200: '#D3ACFF',
          300: '#B87AFF',
          400: '#A15CFE',
          500: '#9843FE',
          600: '#7F23F0',
          700: '#6412CC',
          800: '#4801A0',
          900: '#301277',
        },
        secondary: {
          50:  '#FFECEF',
          100: '#FFCFD5',
          200: '#FF9D9D',
          300: '#F97777',
          400: '#FF5754',
          500: '#FF4638',
          600: '#FB3E39',
          700: '#DB2C2B',
          800: '#AC2038',
          900: '#8A192C',
        },
        tertiary: {
          50:  '#FDEAE6',
          100: '#FFCFBA',
          200: '#FFB18E',
          300: '#FF9360',
          400: '#FF7C3A',
          500: '#FF680F',
          600: '#F46209',
          700: '#D95300',
          800: '#C04600',
          900: '#A33A00',
        },
        ink: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        success: {
          50:  '#E9F5E9',
          100: '#C8E6C9',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#215A24',
          700: '#154718',
        },
        error: {
          50:  '#FCEFF0',
          100: '#FFCDD2',
          500: '#E53935',
          600: '#AC2038',
          700: '#8A192C',
        },
      },
      borderRadius: {
        pill: '48px',
      },
    },
  },
  plugins: [],
};

export default config;
