import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      // Azul principal WilkieDevs
        secondary: '#1E293B',    // Gris oscuro
        accent: '#F59E0B',       // Amarillo/naranja para acentos
        success: '#10B981',      // Verde para éxito
        warning: '#F59E0B',      // Amarillo para advertencias
        error: '#EF4444',        // Rojo para errores
        info: '#06B6D4',         // Cyan para información
        'text-light': '#FFFFFF',
        'bg-light': '#F8F9FA',
        'gray-50': '#F9FAFB',
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
      },
      fontFamily: {
        roboto: ['var(--font-roboto)', 'sans-serif'],
      },
    },
  },
}

export default config