/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Adjust paths according to where your source files live (React components, pages, etc)
    './src/**/*.{js,jsx,ts,tsx}',  // all JS, JSX, TS, TSX files inside src and subfolders
    './public/index.html'           // your main HTML file, if any
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
