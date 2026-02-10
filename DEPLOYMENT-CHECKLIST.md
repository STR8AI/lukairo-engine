# Cloudflare Deployment Checklist

Use this checklist to ensure a successful deployment to Cloudflare Workers.

## Pre-Deployment Checklist

### 1. Dependencies & Security
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Run `npm audit fix` if any vulnerabilities are found
- [ ] Verify 0 vulnerabilities before deploying

### 2. Code Verification
- [ ] Run `npm run typecheck` to verify TypeScript compilation
- [ ] Test locally with `npm run dev`
- [ ] Verify the worker responds at http://localhost:8787
- [ ] Check static assets load correctly

### 3. Configuration Check
- [ ] Verify `wrangler.toml` is properly configured
  - [ ] Worker name is set
  - [ ] Main entry point is `src/index.ts`
  - [ ] Static assets directory is `cf-pages/`
  - [ ] Environment variables are defined
- [ ] Confirm `package.json` scripts are correct

### 4. Deployment Test
- [ ] Run `npx wrangler deploy --dry-run` to test deployment
- [ ] Review bundle size (should be ~82 KiB)
- [ ] Verify bindings are correct

## Deployment Methods

### Method 1: GitHub Actions (Automated)

#### Setup (One-time)
- [ ] Navigate to repository Settings → Secrets and variables → Actions
- [ ] Add `CLOUDFLARE_API_TOKEN` secret
  - Get from: Cloudflare Dashboard → My Profile → API Tokens
  - Use "Edit Cloudflare Workers" template
- [ ] Add `CLOUDFLARE_ACCOUNT_ID` secret
  - Get from: Cloudflare Dashboard → Workers & Pages sidebar

#### Deploy
- [ ] Merge PR to `main` branch or push to `main`
- [ ] Monitor GitHub Actions workflow
- [ ] Verify deployment succeeds in Actions tab

### Method 2: Manual Deployment

#### Setup (One-time)
- [ ] Set environment variable: `export CLOUDFLARE_ACCOUNT_ID="your-account-id"`
- [ ] Run `npx wrangler login` to authenticate
- [ ] Verify authentication succeeds

#### Deploy
- [ ] Run `npm run deploy`
- [ ] Monitor output for errors
- [ ] Verify deployment succeeds

## Post-Deployment Verification

### 1. Functional Testing
- [ ] Visit your Worker URL (provided in deployment output)
- [ ] Verify the homepage loads correctly
- [ ] Test static assets load (CSS, JS, images)
- [ ] Check environment variables are accessible

### 2. Performance Check
- [ ] Verify fast response times
- [ ] Check cold start performance
- [ ] Monitor Worker metrics in Cloudflare Dashboard

### 3. Monitor & Logs
- [ ] Check Cloudflare Dashboard → Workers & Pages
- [ ] Review deployment logs
- [ ] Monitor for any errors in logs
- [ ] Set up alerts if needed

## Troubleshooting

### Deployment Fails
- [ ] Check API token has correct permissions
- [ ] Verify account ID is correct
- [ ] Check wrangler.toml syntax
- [ ] Review error messages in output

### Worker Not Responding
- [ ] Check Worker is deployed in Cloudflare Dashboard
- [ ] Verify routes are configured correctly
- [ ] Review Worker logs for errors
- [ ] Test with curl or browser dev tools

### Static Assets Not Loading
- [ ] Verify `cf-pages/` directory exists
- [ ] Check `[site.bucket]` in wrangler.toml
- [ ] Ensure files have correct permissions
- [ ] Review network tab in browser dev tools

## Quick Reference

### Commands
```bash
npm install              # Install dependencies
npm audit                # Check for vulnerabilities
npm audit fix            # Fix vulnerabilities
npm run typecheck        # Verify TypeScript
npm run dev              # Start local dev server
npm run deploy           # Deploy to Cloudflare
npx wrangler login       # Authenticate with Cloudflare
npx wrangler deploy --dry-run  # Test deployment
```

### Files to Check
- `wrangler.toml` - Cloudflare configuration
- `src/index.ts` - Worker entry point
- `cf-pages/` - Static assets
- `package.json` - Dependencies and scripts
- `.github/workflows/deploy-to-cloudflare-pages.yml` - CI/CD workflow

## Support Resources

- **Documentation**: See DEPLOY-GUIDE.md
- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **GitHub Issues**: For project-specific issues

---

✅ Deployment checklist completed: ____________________
