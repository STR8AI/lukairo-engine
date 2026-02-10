# LUKAIRO Engine - Deployment Guide

This guide will walk you through deploying the LUKAIRO Engine to Cloudflare Workers and Pages.

## Prerequisites

Before you begin, ensure you have:

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js**: Version 18 or higher
3. **Wrangler CLI**: Cloudflare's deployment tool

## Quick Start - Go Live in 3 Steps

### Step 1: Install Wrangler (if not already installed)

```bash
npm install -g wrangler
```

### Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with your Cloudflare account.

### Step 3: Deploy

Use the provided deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Or deploy manually:

```bash
# Option A: Deploy Pages (Frontend Static Site)
wrangler pages deploy cf-pages --project-name=lukairo-engine

# Option B: Deploy Workers (API Backend)
cd workers
wrangler deploy

# Option C: Deploy Both
wrangler pages deploy cf-pages --project-name=lukairo-engine && cd workers && wrangler deploy
```

## Detailed Deployment Instructions

### 1. Configure Account ID (Optional but Recommended)

Get your Cloudflare Account ID:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Copy your Account ID from the right sidebar

Update the account ID in configuration files:
- `wrangler.toml` (root directory)
- `workers/wrangler.toml` (for workers)

### 2. Deploy Cloudflare Pages (Static Frontend)

The `cf-pages/` directory contains all static HTML, CSS, and JavaScript files.

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy cf-pages --project-name=lukairo-engine

# Or with a custom project name
wrangler pages deploy cf-pages --project-name=your-custom-name
```

After deployment, your site will be available at:
- `https://lukairo-engine.pages.dev` (or your custom project name)
- You can also add a custom domain in the Cloudflare dashboard

### 3. Deploy Cloudflare Workers (API Backend)

The `workers/` directory contains the Hono API backend.

```bash
cd workers
wrangler deploy
```

This deploys the API endpoints defined in `workers/app.ts`.

### 4. Configure Environment Variables

#### For Local Development

Create a `.dev.vars` file in the root directory:

```ini
# .dev.vars (this file is gitignored)
VALUE_FROM_CLOUDFLARE=lukairo-edge
# Add other environment variables here
```

#### For Production

Set environment variables in the Cloudflare Dashboard:

1. Go to **Workers & Pages** in your Cloudflare dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add your variables

Or use Wrangler CLI:

```bash
wrangler secret put MY_SECRET_KEY
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Cloudflare Pages (Static Frontend)    │
│  - cf-pages/index.html (Main site)     │
│  - cf-pages/*.html (Additional pages)  │
│  - src/styles/lukairo-loader.css       │
│  - src/scripts/neural-core.js          │
│  - assets/ (Textures, images)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Cloudflare Workers (API Backend)      │
│  - workers/app.ts (Hono API)           │
│  - API endpoints and business logic    │
└─────────────────────────────────────────┘
```

## Post-Deployment

### Verify Your Deployment

1. **Check Pages Deployment**:
   - Visit your Pages URL (shown after deployment)
   - Verify the Neural Core visualization loads
   - Check that all pages are accessible

2. **Check Workers Deployment**:
   - Visit your Workers URL (shown after deployment)
   - Test API endpoints

3. **Check Cloudflare Dashboard**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages**
   - Verify both deployments are listed and active

### Add Custom Domain

1. Go to your Cloudflare Pages project
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to add your domain

## Continuous Deployment with GitHub Actions

The repository includes CI/CD workflows in `.github/workflows/` for automated deployments.

To enable automatic deployments:

1. Add your Cloudflare API token to GitHub Secrets:
   - Go to your GitHub repository settings
   - Navigate to **Secrets and variables** → **Actions**
   - Add `CLOUDFLARE_API_TOKEN` with your token from Cloudflare

2. Push to your main branch to trigger automatic deployment

## Troubleshooting

### Common Issues

**"Account ID not found"**
- Make sure you've set your account ID in `wrangler.toml`
- Get your account ID from the Cloudflare dashboard

**"Not authenticated"**
- Run `wrangler login` to authenticate
- Check that you're logged in with `wrangler whoami`

**"Project name already exists"**
- Use a different project name with `--project-name=your-unique-name`
- Or manage the existing project in the Cloudflare dashboard

**"Build failed"**
- This is a static site deployment, no build is needed
- Ensure the `cf-pages/` directory exists and contains your files

**"Worker deployment failed"**
- Check that `workers/app.ts` is valid TypeScript
- Run `npm run typecheck` in the workers directory
- Verify your `workers/wrangler.toml` configuration

### Rollback

If you need to rollback a deployment:

1. Go to the Cloudflare dashboard
2. Navigate to your Pages or Workers project
3. Go to **Deployments**
4. Click **Rollback** on a previous successful deployment

## Advanced Configuration

### Branch Deployments

Cloudflare Pages automatically creates preview deployments for branches:

```bash
# Deploy a specific branch
wrangler pages deploy cf-pages --branch=staging
```

### Production Environment

Update `workers/wrangler.toml` for production settings:

```toml
[env.production]
name = "lukairo-dashboard-prod"
workers_dev = false
# routes = [
#   { pattern = "api.yourdomain.com", custom_domain = true }
# ]
```

Deploy to production:

```bash
cd workers
wrangler deploy --env production
```

## Monitoring and Analytics

Once deployed, you can monitor your application:

1. **Analytics**: Available in the Cloudflare dashboard
2. **Logs**: View real-time logs with `wrangler tail`
3. **Metrics**: Check requests, data transfer, and errors

```bash
# View real-time logs for Workers
cd workers
wrangler tail

# View logs for Pages
wrangler pages deployment tail
```

## Support

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)

---

**Ready to go live? Run `./deploy.sh` and follow the prompts!**
