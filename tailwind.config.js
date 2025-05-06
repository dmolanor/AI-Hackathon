/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './scr/app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx}',    // si llegas a usar pages/
      './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: { extend: {} },
    plugins: [],
  };
  