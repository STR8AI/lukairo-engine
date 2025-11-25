# Copilot Instructions for LUKAIRO Engine

## Project Overview

LUKAIRO Engine is a modern full-stack application built with Cloudflare Workers. The project provides a serverless platform using Hono for backend APIs, React Router for frontend routing, and Tailwind CSS for styling.

## Tech Stack

- **Runtime**: Cloudflare Workers (serverless edge computing)
- **Backend**: Hono framework for APIs
- **Frontend**: React 19 with React Router 7
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Build Tool**: Vite 6
- **Package Manager**: npm

## Project Structure

```
lukairo-engine/
├── app/                    # React frontend application
│   ├── routes/             # React Router route components
│   ├── welcome/            # Welcome page components and assets
│   ├── app.css             # Global styles (Tailwind imports)
│   ├── entry.server.tsx    # Server-side entry point
│   ├── root.tsx            # Root React component
│   └── routes.ts           # Route definitions
├── workers/                # Cloudflare Workers backend
│   └── app.ts              # Main worker API handler
├── public/                 # Static assets
├── .github/                # GitHub configurations
│   └── workflows/          # CI/CD workflows
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite bundler configuration
└── react-router.config.ts  # React Router configuration
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Cloudflare
npm run deploy

# Type checking
npm run typecheck

# Generate Cloudflare types
npm run cf-typegen
```

## Coding Guidelines

### TypeScript

- Use strict TypeScript (`strict: true` is enabled)
- Prefer explicit type annotations for function parameters and return types
- Use type imports when importing only types: `import type { ... } from "..."`
- Avoid `any` type; use proper typing or `unknown` when necessary

### React & React Router

- Use functional components with hooks
- Route components are in `app/routes/` directory
- Follow React Router v7 conventions for loaders and actions
- Use the `Route` type from `./+types/<route>` for type-safe props

### Cloudflare Workers

- Worker code is in the `workers/` directory
- Access environment bindings through `env` parameter
- Handle CORS headers appropriately for API endpoints
- Use D1 database bindings when available (`env.DB`)

### Styling

- Use Tailwind CSS utility classes for styling
- Global styles are in `app/app.css`
- Avoid inline styles; prefer Tailwind classes

### Code Style

- Use tabs for indentation (as configured in existing files)
- Use double quotes for strings in JSON, single quotes in TypeScript
- Keep functions small and focused
- Add meaningful comments only when logic is complex

## API Development

When adding new API endpoints in `workers/app.ts`:

1. Handle CORS preflight requests for OPTIONS method
2. Return proper JSON responses with `content-type: application/json`
3. Include `Access-Control-Allow-Origin` headers for cross-origin requests
4. Use appropriate HTTP status codes

## Adding New Routes

1. Create a new component in `app/routes/`
2. Export the component as default
3. Add route metadata using the `meta` function
4. Use `loader` for server-side data fetching
5. Access Cloudflare context via `context.cloudflare`

## Environment & Configuration

- Cloudflare bindings are typed in `worker-configuration.d.ts`
- Use `wrangler types` (or `npm run cf-typegen`) to regenerate types
- Environment variables are accessed through Cloudflare's env object

## Testing

- Currently no test framework is configured
- When adding tests, prefer Vitest (compatible with Vite)
- Test files should be colocated with source files or in a `__tests__` directory

## Common Patterns

### Loader with Cloudflare Context

```typescript
export function loader({ context }: Route.LoaderArgs) {
  return { data: context.cloudflare.env.SOME_VALUE };
}
```

### API Handler Pattern

```typescript
if (url.pathname === "/api/endpoint") {
  // Handle request
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
```

## Deployment

The application deploys to Cloudflare Workers. Use:

```bash
npm run deploy
```

This builds the application and deploys using Wrangler.

## Additional Notes

- The project uses Vite's cloudflare plugin for SSR
- React Router is configured for server-side rendering
- Always run `npm run typecheck` before committing to catch type errors
