/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0f0f1a',
          panel: '#1a1a2e',
          card: '#16213e',
        },
        accent: {
          cyan: '#00d9ff',
          green: '#00ff88',
          yellow: '#ffd600',
          red: '#ff4444',
          purple: '#9d4edd',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
