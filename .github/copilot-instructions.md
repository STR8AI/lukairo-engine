# Copilot Instructions for lukairo-engine

This document provides guidance for GitHub Copilot when working on this repository.

## Project Overview

lukairo-engine is a modern full-stack application built with:

- **Frontend**: React 19 with React Router 7 for routing
- **Backend**: Cloudflare Workers with Hono framework for APIs
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

The project is designed to be deployed on Cloudflare Workers.

## Directory Structure

```
lukairo-engine/
├── app/                          # React application source
│   ├── routes/                   # React Router route components
│   ├── welcome/                  # Welcome page components
│   ├── app.css                   # Global styles
│   ├── entry.server.tsx          # Server-side entry point
│   ├── root.tsx                  # Root layout component
│   └── routes.ts                 # Route configuration
├── workers/                      # Cloudflare Workers
│   └── app.ts                    # Hono API worker
├── public/                       # Static assets
├── .github/                      # GitHub configuration
│   ├── workflows/                # CI/CD workflows
│   └── copilot-instructions.md   # This file
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite configuration
├── react-router.config.ts        # React Router configuration
└── tsconfig.json                 # TypeScript configuration
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (react-router build)
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run preview` - Build and preview locally
- `npm run typecheck` - Run TypeScript type checking
- `npm run cf-typegen` - Generate Cloudflare types

## Coding Conventions

### TypeScript

- Use TypeScript for all new code
- Prefer explicit type annotations for function parameters and return types
- Use `type` for object types unless `interface` is specifically needed for extension
- Import types using `import type` when only type information is needed

### React Components

- Use functional components with hooks
- Name component files using PascalCase (e.g., `Welcome.tsx`)
- Export components as named exports when they're reusable
- Use default exports for route components

### React Router

- Route components should be placed in `app/routes/`
- Use the React Router type system (e.g., `Route.MetaArgs`, `Route.LoaderArgs`)
- Loaders and actions should be co-located with their route components

### Styling

- Use Tailwind CSS utility classes for styling
- Follow the existing class naming patterns in the codebase
- Dark mode support: use `dark:` prefix for dark mode variants

### Cloudflare Workers

- Worker code goes in the `workers/` directory
- Use the standard Cloudflare Workers fetch handler pattern
- In Workers: access environment variables via the `env` parameter (e.g., `env.DB`)
- In React Router loaders/actions: access via `context.cloudflare.env`

## File Naming

- React components: PascalCase (e.g., `Welcome.tsx`)
- Route files: kebab-case (e.g., `home.tsx`)
- Utility files: camelCase (e.g., `utils.ts`)
- CSS files: kebab-case (e.g., `app.css`)

## Best Practices

1. **Small, focused changes**: Make incremental changes that are easy to review
2. **Type safety**: Ensure all code passes TypeScript type checking
3. **Consistent formatting**: Follow the existing code style in the repository
4. **Test before committing**: Run `npm run typecheck` to verify changes
5. **Update imports**: When moving or renaming files, update all import statements
6. **Environment variables**: Never hardcode secrets; use Cloudflare environment bindings

## Common Tasks

### Adding a new route

1. Create a new file in `app/routes/` (e.g., `about.tsx`)
2. Export a default component and optionally `meta`, `loader`, or `action` functions
3. The route will be automatically registered based on file-based routing

### Adding a new API endpoint

1. Open `workers/app.ts`
2. Add a new route handler using the fetch handler pattern with URL pathname matching
3. Access environment bindings via the `env` parameter

### Modifying styles

1. Use Tailwind CSS utility classes directly in components
2. For global styles, modify `app/app.css`
3. Follow the existing dark mode patterns using `dark:` prefix

## Troubleshooting

- If TypeScript errors occur, run `npm run cf-typegen` to regenerate Cloudflare types
- For routing issues, check the file structure in `app/routes/`
- For build errors, ensure all dependencies are installed with `npm install`

## Deployment

### Deploying to Cloudflare Workers

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g @cloudflare/wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Configure your account**:
   - Update `wrangler.toml` with your Cloudflare account ID
   - Set up any required environment variables

4. **Deploy**:
   ```bash
   npm run deploy
   # or
   wrangler pages publish cf-pages --project-name=lukairo-engine
   ```

5. **Verify deployment**:
   - Check the Cloudflare dashboard for your worker/pages project
   - Test the deployed URL to ensure everything is working

### Environment Variables

- Set environment variables in the Cloudflare dashboard under Workers & Pages settings
- For local development, use `.dev.vars` file (add to `.gitignore`)
- Access variables via `env` parameter in Workers or `context.cloudflare.env` in React Router loaders
