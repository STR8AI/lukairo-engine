# 🚀 Quick Reference - Deployment Commands

## One-Line Deployments

### Deploy Everything (Interactive)
```bash
./deploy.sh
```

### Deploy Pages Only
```bash
wrangler pages deploy cf-pages --project-name=lukairo-engine
```

### Deploy Workers Only
```bash
cd workers && wrangler deploy && cd ..
```

### Deploy Both (One Command)
```bash
wrangler pages deploy cf-pages --project-name=lukairo-engine && cd workers && wrangler deploy && cd ..
```

## First-Time Setup

### Install & Authenticate
```bash
npm install -g wrangler && wrangler login
```

### Verify Before Deploy
```bash
./verify-deployment.sh
```

## Common Tasks

### Check Authentication
```bash
wrangler whoami
```

### Re-authenticate
```bash
wrangler logout && wrangler login
```

### View Logs (Workers)
```bash
cd workers && wrangler tail
```

### View Logs (Pages)
```bash
wrangler pages deployment tail
```

### List Deployments
```bash
wrangler pages deployment list --project-name=lukairo-engine
```

## Custom Configurations

### Deploy with Custom Project Name
```bash
wrangler pages deploy cf-pages --project-name=your-custom-name
```

### Deploy to Production Environment (Workers)
```bash
cd workers && wrangler deploy --env production
```

### Deploy Specific Branch (Pages)
```bash
wrangler pages deploy cf-pages --branch=staging
```

## Environment Variables

### Set Secret (Workers)
```bash
cd workers && wrangler secret put MY_SECRET_KEY
```

### List Secrets (Workers)
```bash
cd workers && wrangler secret list
```

## Troubleshooting

### Force Re-authentication
```bash
wrangler logout && wrangler login
```

### Check Wrangler Version
```bash
wrangler --version
```

### Update Wrangler
```bash
npm update -g wrangler
```

### Reinstall Wrangler
```bash
npm uninstall -g wrangler && npm install -g wrangler
```

## URLs After Deployment

### Default URLs
- Pages: `https://lukairo-engine.pages.dev`
- Workers: `https://lukairo-dashboard.[subdomain].workers.dev`

### Dashboard
- Main: `https://dash.cloudflare.com`
- Pages: `https://dash.cloudflare.com/?to=/:account/pages`
- Workers: `https://dash.cloudflare.com/?to=/:account/workers`

## Quick Verification

### Test Pages Deployment
```bash
curl -I https://lukairo-engine.pages.dev
```

### Test Workers Deployment
```bash
curl https://lukairo-dashboard.[subdomain].workers.dev
```

## Emergency Commands

### Rollback (via Dashboard)
1. Visit: `https://dash.cloudflare.com`
2. Go to: Workers & Pages → Your Project → Deployments
3. Click: Rollback on previous deployment

### Delete Deployment (Pages)
```bash
wrangler pages deployment list --project-name=lukairo-engine
wrangler pages deployment delete [DEPLOYMENT_ID]
```

## Most Common Workflows

### Standard Deployment
```bash
./verify-deployment.sh && ./deploy.sh
```

### Quick Deploy Pages
```bash
wrangler pages deploy cf-pages --project-name=lukairo-engine
```

### Full Stack Deploy
```bash
wrangler pages deploy cf-pages --project-name=lukairo-engine && \
cd workers && wrangler deploy && cd ..
```

---

## Aliases (Optional)

Add these to your `~/.bashrc` or `~/.zshrc` for quick access:

```bash
# LUKAIRO Engine Deployment Aliases
alias lukairo-verify="cd /path/to/lukairo-engine && ./verify-deployment.sh"
alias lukairo-deploy="cd /path/to/lukairo-engine && ./deploy.sh"
alias lukairo-pages="cd /path/to/lukairo-engine && wrangler pages deploy cf-pages --project-name=lukairo-engine"
alias lukairo-workers="cd /path/to/lukairo-engine/workers && wrangler deploy && cd .."
alias lukairo-logs="cd /path/to/lukairo-engine/workers && wrangler tail"
```

After adding, reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

Then use:
```bash
lukairo-deploy    # Deploy with interactive menu
lukairo-pages     # Deploy pages only
lukairo-workers   # Deploy workers only
```

---

**Print this reference and keep it handy! 📋**

For detailed guides, see:
- Quick Start: [GO-LIVE.md](GO-LIVE.md)
- Full Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Checklist: [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
