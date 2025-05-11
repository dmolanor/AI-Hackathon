/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
    content: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#20392C',
                secondary: '#CDDDFF',
                foreground: '#20392C',
                muted: '#959C91',
                'bg-alt': '#F8F5F0',
                logo: '#ff8e2e',
                headerGrayBlack: '#262626',
                headerOrange: '#ff8e2e',
                descriptionText: '#515151',
                bgMain: '#ffdfcd',
                themeYellow: '#FFC72C',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
                mono: ['ui-monospace', 'SFMono-Regular'],
                montserrat: ['Montserrat', 'sans-serif'],
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in-up": {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                "draw-line": {
                    to: { 'stroke-dashoffset': '0' },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in-up": "fade-in-up 0.25s cubic-bezier(.08,.69,.1,1)",
                "draw-line": "draw-line 0.25s cubic-bezier(.08,.69,.1,1) forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
  