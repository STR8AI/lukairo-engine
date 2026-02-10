# LUKAIRO Engine - Deployment Architecture

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE NETWORK                   │
│                  (Global CDN & Edge Computing)               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │      CLOUDFLARE PAGES (Frontend)       │
         │  URL: https://lukairo-engine.pages.dev │
         ├────────────────────────────────────────┤
         │  📁 Static Content from cf-pages/      │
         │  ├─ index.html (Main Entry)            │
         │  ├─ engine.html (Engine Page)          │
         │  ├─ solutions.html                     │
         │  ├─ case-studies.html                  │
         │  ├─ what-we-do.html                    │
         │  ├─ style.css (Styles)                 │
         │  ├─ main.js (Scripts)                  │
         │  ├─ engine.js (Engine Logic)           │
         │  └─ Additional HTML pages              │
         └────────────────────────────────────────┘
                              │
                              │ (Optional API Calls)
                              ▼
         ┌────────────────────────────────────────┐
         │   CLOUDFLARE WORKERS (API Backend)     │
         │  URL: https://lukairo-dashboard.*.dev  │
         ├────────────────────────────────────────┤
         │  🔧 Hono Framework API                 │
         │  ├─ workers/app.ts                     │
         │  ├─ API Endpoints                      │
         │  ├─ Business Logic                     │
         │  └─ Environment Variables              │
         └────────────────────────────────────────┘
```

## Deployment Flow

```
┌─────────────────┐
│  Local Machine  │
│  (Development)  │
└────────┬────────┘
         │
         │ 1. Run ./deploy.sh
         ▼
┌─────────────────┐
│  Wrangler CLI   │
│  (Build & Push) │
└────────┬────────┘
         │
         │ 2. Upload assets
         ▼
┌─────────────────────────────────────┐
│     CLOUDFLARE PLATFORM             │
│  ┌─────────────────────────────┐   │
│  │  Cloudflare Pages           │   │
│  │  - Receives static files    │   │
│  │  - Serves from Edge         │   │
│  │  - Auto HTTPS/CDN           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Cloudflare Workers         │   │
│  │  - Compiles TypeScript      │   │
│  │  - Deploys to Edge          │   │
│  │  - Runs on V8 Isolates      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         │ 3. Live & Deployed
         ▼
┌─────────────────┐
│  Global Users   │
│  (Production)   │
└─────────────────┘
```

## Content Distribution

```
                    ┌─────────────────────┐
                    │   GitHub Repo       │
                    │  STR8AI/lukairo     │
                    └──────────┬──────────┘
                               │
                               │ Source Code
                               ▼
┌──────────────────────────────────────────────────────────┐
│                   LOCAL REPOSITORY                       │
│                                                          │
│  cf-pages/              │  workers/      │  assets/      │
│  ├─ index.html         │  ├─ app.ts     │  ├─ textures/ │
│  ├─ *.html             │  ├─ pkg.json   │  └─ images/   │
│  ├─ *.css              │  └─ wrglr.toml │               │
│  └─ *.js               │                │               │
└──────┬──────────────────────────┬──────────────┬────────┘
       │                          │              │
       │ Deploy Pages             │ Deploy API   │ Referenced
       ▼                          ▼              ▼
┌──────────────┐          ┌──────────────┐  ┌──────────┐
│ CF Pages     │          │ CF Workers   │  │ External │
│ (Static)     │◄─────────┤ (Dynamic)    │  │ CDN/URLs │
└──────────────┘   Calls  └──────────────┘  └──────────┘
```

## File Organization

```
lukairo-engine/
│
├── cf-pages/                 ← Deployed to Cloudflare Pages
│   ├── index.html           → https://[project].pages.dev/
│   ├── engine.html          → https://[project].pages.dev/engine.html
│   ├── solutions.html       → https://[project].pages.dev/solutions.html
│   ├── style.css            → Served with HTML
│   ├── main.js              → Served with HTML
│   └── *.html               → All pages accessible
│
├── workers/                  ← Deployed to Cloudflare Workers
│   ├── app.ts               → Compiled & deployed
│   ├── wrangler.toml        → Worker configuration
│   └── package.json         → Dependencies
│
├── assets/                   ← Referenced by pages
│   ├── textures/            → Loaded dynamically
│   └── images/              → Loaded dynamically
│
├── src/                      ← Source files
│   ├── styles/              → Additional CSS
│   └── scripts/             → Additional JS
│
└── Deployment Scripts
    ├── deploy.sh            → Main deployment script
    ├── verify-deployment.sh → Pre-flight checks
    ├── DEPLOYMENT.md        → Full guide
    ├── GO-LIVE.md          → Quick start
    └── DEPLOYMENT-CHECKLIST.md → Step-by-step list
```

## Environment Configuration

```
Development              Production
─────────────           ─────────────

Local Files    ──────►  Cloudflare Edge
.dev.vars      ──────►  Dashboard Settings
localhost      ──────►  pages.dev / workers.dev
Hot Reload     ──────►  Instant Updates (CDN)
```

## URL Structure After Deployment

```
Production URLs:
├── Main Site:    https://lukairo-engine.pages.dev
├── Engine:       https://lukairo-engine.pages.dev/engine.html
├── Solutions:    https://lukairo-engine.pages.dev/solutions.html
├── Case Studies: https://lukairo-engine.pages.dev/case-studies.html
├── What We Do:   https://lukairo-engine.pages.dev/what-we-do.html
└── API Worker:   https://lukairo-dashboard.[subdomain].workers.dev

Custom Domain (optional):
├── Main Site:    https://yourdomain.com
├── Engine:       https://yourdomain.com/engine.html
└── API:          https://api.yourdomain.com
```

## Deployment Commands

```bash
# Full Stack Deployment
./deploy.sh                           # Interactive menu

# Individual Deployments
wrangler pages deploy cf-pages        # Pages only
cd workers && wrangler deploy         # Workers only

# With Custom Names
wrangler pages deploy cf-pages --project-name=custom-name

# Environment-Specific
wrangler deploy --env production      # Production environment
```

## Key Features

### Cloudflare Pages
✅ Global CDN distribution
✅ Automatic HTTPS
✅ Git integration
✅ Preview deployments
✅ Instant rollbacks
✅ Custom domains
✅ Edge caching

### Cloudflare Workers
✅ Edge computing
✅ V8 isolates (fast startup)
✅ TypeScript support
✅ Environment variables
✅ KV/D1/R2 integration
✅ Durable Objects
✅ Global deployment

## Performance Characteristics

- **Latency**: <50ms (edge network)
- **Availability**: 99.99%+ SLA
- **Scale**: Unlimited (serverless)
- **Cold Start**: <5ms (Workers)
- **CDN**: 200+ cities worldwide

---

**Ready to deploy? Run `./deploy.sh` to get started!**
