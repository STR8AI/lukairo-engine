# Cloudflare Deployment Guide

## Overview
This repository is configured for deployment to Cloudflare Workers with static asset serving from Cloudflare Pages.

## Prerequisites
- Node.js 20.18.1 or higher
- Cloudflare account with Workers enabled
- API Token with Workers deployment permissions

## Quick Deployment

### Option 1: GitHub Actions (Recommended)
The repository includes automated deployment via GitHub Actions:

1. **Set GitHub Secrets** (Repository Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

The workflow automatically:
- Installs dependencies
- Runs security checks
- Deploys to Cloudflare Workers

### Option 2: Manual Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Account ID** (one-time setup):
   ```bash
   export CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
   # Or add to wrangler.toml: account_id = "your-account-id"
   ```

3. **Login to Cloudflare** (first time only):
   ```bash
   npx wrangler login
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## Local Development

Start the development server:
```bash
npm run dev
```

This runs your Worker locally at http://localhost:8787

## Project Structure

```
lukairo-engine/
├── src/
│   └── index.ts              # Hono Worker entry point
├── cf-pages/                 # Static assets (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── *.js
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Dependencies and scripts
└── .github/workflows/        # CI/CD workflows
    └── deploy-to-cloudflare-pages.yml
```

## Configuration

### wrangler.toml
Key configuration options:
- `name`: Worker name (lukairo-engine)
- `main`: Entry point (src/index.ts)
- `compatibility_date`: Worker compatibility date
- `[site.bucket]`: Static assets directory (./cf-pages)
- `[vars]`: Environment variables

### Environment Variables
Available in your Worker via `env`:
- `VALUE_FROM_CLOUDFLARE`: Set to "lukairo-edge"

## Deployment Info

- **Worker Size**: ~82 KiB (gzipped: ~20 KiB)
- **Framework**: Hono v4.12.18
- **Runtime**: Cloudflare Workers
- **Static Assets**: Served via Cloudflare Pages

## Security

All dependencies are regularly scanned for vulnerabilities:
- Run `npm audit` to check for issues
- Run `npm audit fix` to automatically fix vulnerabilities

## Troubleshooting

### Issue: Deployment fails with authentication error
**Solution**: Run `npx wrangler login` or verify your API token

### Issue: Account ID not found
**Solution**: Set CLOUDFLARE_ACCOUNT_ID environment variable or add to wrangler.toml

### Issue: Static assets not loading
**Solution**: Verify cf-pages/ directory exists and contains your files

## Getting Your Cloudflare Credentials

### Account ID
1. Log in to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Find your Account ID in the sidebar

### API Token
1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Grant permissions for your account
5. Create token and save securely

## CI/CD Workflow

The GitHub Actions workflow (`.github/workflows/deploy-to-cloudflare-pages.yml`) runs on:
- Push to `main` branch

Workflow steps:
1. Checkout code
2. Setup Node.js 20.18.1
3. Install dependencies with `npm ci`
4. Deploy using `cloudflare/wrangler-action@v3`

## Support

For issues or questions:
- Open a GitHub issue
- Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
