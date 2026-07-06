# Medighar

React 19 + Vite frontend foundation.

## Stack

- React 19
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router
- Lucide React (icons)
- Framer Motion (animation)
- React Hook Form + Zod (forms & validation)
- Axios (HTTP)
- clsx + tailwind-merge (class name utilities, via `src/shared/lib/cn.js`)

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Path aliases

Imports can use `@/` to reference `src/`, e.g.:

\`\`\`js
import App from '@/app/App.jsx'
\`\`\`

## Folder structure

\`\`\`
src/
  app/        # root App component, app-level composition
  assets/     # static assets (images, fonts, etc.)
  config/     # app configuration/constants
  contexts/   # React context providers
  data/       # static or seed data
  features/   # feature modules
  layouts/    # layout components
  routes/     # route definitions
  services/   # API/service layer
  shared/     # shared/reusable code (components, hooks, lib, utils)
  styles/     # global styles
docs/         # project documentation
\`\`\`

This is a foundation only — no pages, components, or features have been built yet.