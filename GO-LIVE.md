# 🚀 GO LIVE - Quick Start Guide

This guide gets you from zero to production in minutes.

## Prerequisites Check

Run the verification script first:

```bash
./verify-deployment.sh
```

## Option 1: Automated Deployment (Recommended)

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

Follow the interactive prompts to deploy Pages, Workers, or both.

## Option 2: Manual Deployment

### Deploy Static Site (Pages)

```bash
# Install wrangler (if not installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy pages
wrangler pages deploy cf-pages --project-name=lukairo-engine
```

Your site will be live at: `https://lukairo-engine.pages.dev`

### Deploy API (Workers) - Optional

```bash
cd workers
wrangler deploy
cd ..
```

## Post-Deployment

### Verify Deployment

1. Visit your Pages URL (shown after deployment)
2. Check that the Neural Core visualization loads
3. Test navigation between pages

### View in Dashboard

Visit the [Cloudflare Dashboard](https://dash.cloudflare.com) to:
- View deployment status
- Check analytics
- Add custom domain
- Configure environment variables

### Add Custom Domain

1. Go to Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain
4. Update DNS settings as instructed

## What Gets Deployed

### Pages Deployment (`cf-pages/`)
- ✅ Main site (index.html)
- ✅ Additional HTML pages (about, solutions, etc.)
- ✅ CSS stylesheets
- ✅ JavaScript files
- ✅ Assets and textures (referenced via CDN)

### Workers Deployment (`workers/`)
- ✅ Hono API backend
- ✅ API endpoints
- ✅ Business logic

## Deployment URLs

After deployment, you'll get:

- **Pages**: `https://[project-name].pages.dev`
- **Workers**: `https://[worker-name].[subdomain].workers.dev`

## Rollback

If something goes wrong:

1. Go to Cloudflare Dashboard
2. Select your project
3. Go to "Deployments"
4. Click "Rollback" on a previous deployment

## Continuous Deployment

To enable automatic deployments from GitHub:

1. Go to Cloudflare Pages project settings
2. Connect your GitHub repository
3. Configure build settings:
   - Build directory: `cf-pages`
   - Build command: (leave empty - static site)

## Troubleshooting

### "Not authenticated"
```bash
wrangler logout
wrangler login
```

### "Project already exists"
Use a different project name:
```bash
wrangler pages deploy cf-pages --project-name=lukairo-engine-v2
```

### "Account ID not found"
Update `wrangler.toml` with your account ID from the Cloudflare dashboard.

## Need Help?

- 📖 Full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Check logs: `wrangler pages deployment tail`
- 💬 Cloudflare Support: https://dash.cloudflare.com

---

**Ready? Run `./deploy.sh` and go live! 🚀**
