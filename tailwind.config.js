/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                orange: {
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                },
                purple: {
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                },
                yellow: {
                    400: '#fde047',
                    500: '#facc15',
                    600: '#eab308',
                },
                red: {
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                },
            },
        },
    },
    plugins: [],
} 