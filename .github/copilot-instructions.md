# Copilot Instructions for LUKAIRO Engine

## Project Overview

LUKAIRO Engine is a modern full-stack application built with:
- **Frontend**: React 19 + React Router 7
- **Backend**: Hono framework on Cloudflare Workers
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript (strict mode enabled)
- **Deployment**: Cloudflare Workers

## Project Structure

```
lukairo-engine/
├── app/                    # React application code
│   ├── routes/             # React Router route components
│   ├── welcome/            # Welcome component
│   ├── entry.server.tsx    # Server-side rendering entry
│   ├── root.tsx            # Root layout component
│   ├── routes.ts           # Route definitions
│   └── app.css             # Global styles
├── workers/                # Cloudflare Workers API code
│   └── app.ts              # API worker (standard Workers pattern)
├── public/                 # Static assets
├── .github/                # GitHub configuration
│   └── workflows/          # CI/CD workflows
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Coding Standards

### TypeScript
- Use strict TypeScript with `strict: true` enabled
- Always define types for function parameters and return values
- Use `type` imports for type-only imports: `import type { X } from "module"`
- Prefer interfaces for object shapes that can be extended
- Use tabs for indentation (as configured in the project)

### React Patterns
- Use functional components with TypeScript
- Import React Router types from route module: `import type { Route } from "./+types/home"`
- Define `meta`, `loader`, and component as named exports for routes
- Use React Router's `loader` function for server-side data fetching

### Styling
- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design patterns
- Use the Inter font family (configured in root.tsx)

### API Development (Workers)
- Workers use the standard Cloudflare Workers API pattern
- Hono is available as a dependency for future API development
- Include CORS headers in API responses
- Handle OPTIONS requests for preflight CORS

## Build and Test Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Generate Cloudflare types
npm run cf-typegen

# Deploy to Cloudflare
npm run deploy

# Preview production build locally
npm run preview
```

## File Naming Conventions

- React components: `PascalCase.tsx` (e.g., `Welcome.tsx`)
- Route files: `lowercase.tsx` (e.g., `home.tsx`)
- Utility files: `camelCase.ts`
- CSS files: `lowercase.css`
- Workers: `app.ts`

## Important Notes

1. **Server-Side Rendering**: This project uses SSR with React Router and Cloudflare Workers
2. **Environment Variables**: Use `context.cloudflare.env` to access environment variables in loaders
3. **Database**: The project is configured to use Cloudflare D1 database (accessed via `env.DB`)
4. **No test framework**: Currently no test infrastructure is set up in the project

## When Making Changes

1. Run `npm run typecheck` to verify TypeScript compilation
2. Run `npm run build` to ensure the production build succeeds
3. Test changes locally with `npm run dev`
4. Follow the existing code patterns and conventions
