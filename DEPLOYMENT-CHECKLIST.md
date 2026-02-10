# 📋 LUKAIRO Engine - Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Cloudflare account created
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Authenticated with Cloudflare (`wrangler login`)
- [ ] Account ID obtained (optional but recommended)

### ✅ Repository Verification
- [ ] All changes committed to git
- [ ] Working directory is clean (`git status`)
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] `.dev.vars` file is not committed (should be in .gitignore)

### ✅ Content Verification
- [ ] `cf-pages/` directory exists and contains files
- [ ] `cf-pages/index.html` exists
- [ ] Static assets (CSS, JS) are present
- [ ] Images and textures are available
- [ ] Workers code is in `workers/` (if using workers)

### ✅ Configuration Review
- [ ] `wrangler.toml` reviewed
- [ ] Project name is set correctly
- [ ] `workers/wrangler.toml` reviewed (if using workers)
- [ ] Environment variables documented

### ✅ Testing
- [ ] Run verification script: `./verify-deployment.sh`
- [ ] All verification checks pass or warnings are acceptable
- [ ] Local preview tested (optional)

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

```bash
# Run the deployment script
./deploy.sh

# Follow the interactive prompts:
# - Choose what to deploy (Pages, Workers, or Both)
# - Confirm deployment
# - Wait for completion
```

### Option 2: Manual Deployment

#### Deploy Pages (Static Site)
```bash
wrangler pages deploy cf-pages --project-name=lukairo-engine
```

#### Deploy Workers (API Backend)
```bash
cd workers
wrangler deploy
cd ..
```

## Post-Deployment Verification

### ✅ Pages Verification
- [ ] Deployment completed successfully
- [ ] Deployment URL received
- [ ] Visit the deployment URL
- [ ] Home page loads correctly
- [ ] Neural Core visualization displays
- [ ] Navigation between pages works
- [ ] CSS styles are applied
- [ ] No console errors in browser

### ✅ Workers Verification (if deployed)
- [ ] Workers deployment completed
- [ ] Workers URL received
- [ ] API endpoints respond correctly
- [ ] No errors in worker logs

### ✅ Dashboard Checks
- [ ] Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
- [ ] Navigate to **Workers & Pages**
- [ ] Verify Pages project is listed
- [ ] Verify Workers project is listed (if deployed)
- [ ] Check deployment status is "Active"
- [ ] Review analytics (optional)

## Optional Post-Deployment Tasks

### 🌐 Custom Domain
- [ ] Add custom domain in Cloudflare Pages settings
- [ ] Update DNS records as instructed
- [ ] Verify custom domain works
- [ ] Configure HTTPS (automatic with Cloudflare)

### 🔐 Environment Variables
- [ ] Set production environment variables in dashboard
- [ ] Verify sensitive values are not exposed
- [ ] Test application with production variables

### 📊 Monitoring
- [ ] Set up analytics (included with Cloudflare)
- [ ] Configure alerts (optional)
- [ ] Set up uptime monitoring (optional)

### 🔄 Continuous Deployment
- [ ] Connect GitHub repository to Cloudflare Pages
- [ ] Configure auto-deploy on push
- [ ] Test automatic deployment

## Troubleshooting

If deployment fails, check:

1. **Authentication Issues**
   ```bash
   wrangler logout
   wrangler login
   ```

2. **Project Name Conflicts**
   - Use a different project name
   - Or manage existing project in dashboard

3. **Account ID Issues**
   - Get account ID from Cloudflare dashboard
   - Update `wrangler.toml` if needed

4. **Permission Issues**
   - Verify account permissions
   - Ensure you have write access

5. **Build Issues**
   - This is a static deployment, no build needed
   - If files are missing, check `cf-pages/` directory

## Rollback Plan

If you need to rollback:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your Pages project
3. Go to **Deployments**
4. Find the last working deployment
5. Click **Rollback to this deployment**

## Deployment Log

Record your deployments here:

| Date | Version | Environment | Deployed By | Status | Notes |
|------|---------|-------------|-------------|--------|-------|
| YYYY-MM-DD | v1.0.0 | Production | Name | ✅ Success | Initial deployment |
| | | | | | |

## Resources

- **Quick Start**: [GO-LIVE.md](GO-LIVE.md)
- **Detailed Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Verification Script**: `./verify-deployment.sh`
- **Deployment Script**: `./deploy.sh`
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Cloudflare Docs**: https://developers.cloudflare.com

---

## Summary

✅ **Ready to deploy?**

1. Complete the Pre-Deployment Checklist
2. Run `./deploy.sh`
3. Verify deployment
4. Celebrate! 🎉

**Current Status**: 
- [ ] Not Started
- [ ] In Progress
- [ ] Deployed
- [ ] Verified

**Deployment URL**: _________________________

**Deployed By**: _________________________

**Date**: _________________________
