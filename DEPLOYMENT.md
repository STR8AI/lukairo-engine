# Cloudflare Workers Deployment Guide

This project is configured for deployment to Cloudflare Workers.

## Quick Start

### Prerequisites
- Node.js 20+
- Cloudflare account
- Wrangler CLI (included in dev dependencies)

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
This starts a local development server with Wrangler.

### Deployment

#### Manual Deployment
```bash
# Set your Cloudflare account ID (one-time setup)
export CLOUDFLARE_ACCOUNT_ID="your-account-id"

# Deploy to Cloudflare Workers
npm run deploy
```

#### CI/CD Deployment
The GitHub Actions workflow automatically deploys to Cloudflare Workers when code is pushed to the `main` branch.

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Project Structure

```
lukairo-engine/
├── src/
│   └── index.ts          # Hono API worker (main entry point)
├── cf-pages/             # Static HTML/CSS/JS files
│   ├── index.html
│   ├── style.css
│   └── *.js
├── wrangler.toml         # Cloudflare Workers configuration
└── package.json          # Dependencies and scripts
```

## Configuration

### wrangler.toml
- `name`: Worker name (lukairo-engine)
- `main`: Entry point (src/index.ts)
- `site.bucket`: Static files directory (cf-pages/)
- `vars`: Environment variables accessible in your worker

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (lightweight web framework)
- **Language**: TypeScript
- **Package Manager**: npm

## Deployment Size

- Worker bundle: ~83 KiB
- Total dependencies: 55 packages
- Very fast cold starts

## Environment Variables

The worker has access to:
- `VALUE_FROM_CLOUDFLARE`: Set to "lukairo-edge"

Add more variables in `wrangler.toml` under `[vars]`.

## Security

- All dependencies scanned for vulnerabilities
- CodeQL security checks pass
- Hono framework updated to latest secure version

## Support

For issues or questions, please open a GitHub issue.
