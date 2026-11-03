// Tailwind through PostCSS, the setup Next.js and Tailwind document. (The custom
// `@tailwindcss/turbopack` loader it replaces let stale CSS through Turbopack's caches.)
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
