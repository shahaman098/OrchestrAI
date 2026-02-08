/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'hack-green': '#00ffc8',
                'hack-black': '#0a0a0a',
                'cyber-cyan': '#00d9ff',
                'cyber-orange': '#ff6b35',
                'cyber-gold': '#ffa500',
                'cyber-magenta': '#ff006e',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
