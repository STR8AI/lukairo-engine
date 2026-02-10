# LUKAIRO ENGINE

A modern full-stack application designed for Cloudflare Workers, built with React 19, React Router 7, and Hono framework.

## 🚀 Quick Deploy - Go Live Now!

Ready to deploy? Follow these simple steps:

```bash
# 1. Verify everything is ready
./verify-deployment.sh

# 2. Deploy to Cloudflare
./deploy.sh
```

See **[GO-LIVE.md](GO-LIVE.md)** for the quick start guide or **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions.

## 🚀 Tech Stack

- **Frontend**: React 19 with React Router 7
- **Backend**: Cloudflare Workers with Hono framework
- **Styling**: Tailwind CSS 4 + Pure CSS Animations
- **3D Visualization**: Three.js (Neural Core)
- **Language**: TypeScript
- **WebGL**: Hardware-accelerated 3D graphics
- **Deployment**: Cloudflare Workers & Pages

## 📁 Project Structure

```
lukairo-engine/
├── app/                          # React application source
│   ├── routes/                   # React Router route components
│   ├── welcome/                  # Welcome page components
│   ├── app.css                   # Global styles
│   ├── entry.server.tsx          # Server-side entry point
│   ├── root.tsx                  # Root layout component
│   └── routes.ts                 # Route configuration
├── src/                          # Additional source files
│   ├── styles/                   # CSS modules and animations
│   │   └── lukairo-loader.css    # High-level loader styles
│   ├── scripts/                  # JavaScript modules
│   │   └── neural-core.js        # Neural Core initialization
│   └── components/               # Standalone components
│       └── neural-core.html      # Neural Core 3D visualization
├── assets/                       # Static assets
│   ├── textures/                 # 3D visualization textures
│   │   ├── lukairo_gears.png     # Inner core texture
│   │   ├── lukairo_circuits.png  # Mid-layer texture
│   │   ├── lukairo_globe.png     # Outer layer texture
│   │   └── README.md             # Texture documentation
│   ├── leadership/               # Team photos
│   └── README.md                 # Asset guidelines
├── workers/                      # Cloudflare Workers
│   ├── app.ts                    # Hono API worker
│   └── wrangler.toml             # Worker configuration
├── cf-pages/                     # Cloudflare Pages static files
├── lukairo-static/               # Additional static resources
├── .github/                      # GitHub configuration
│   ├── workflows/                # CI/CD workflows
│   └── copilot-instructions.md   # Copilot guidance
├── index.html                    # Main entry point
├── wrangler.toml                 # Main Cloudflare configuration
├── vite.config.ts                # Vite configuration
├── react-router.config.ts        # React Router configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/STR8AI/lukairo-engine.git
cd lukairo-engine

# Install dependencies
npm install
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run typecheck

# Generate Cloudflare types
npm run cf-typegen

# Deploy to Cloudflare
npm run deploy
```

## 🌐 Deploying to Cloudflare

### Initial Setup

1. **Install Wrangler CLI** (Cloudflare's deployment tool):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```
   This will open your browser to authenticate with your Cloudflare account.

3. **Get your Account ID**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your account
   - Copy your Account ID from the right sidebar
   - Update `wrangler.toml` with your account ID:
     ```toml
     account_id = "your-account-id-here"
     ```

### Deployment Options

#### Option 1: Deploy Workers (API)

Deploy the Hono API worker:

```bash
cd workers
wrangler deploy
```

This deploys the API endpoints defined in `workers/app.ts`.

#### Option 2: Deploy Pages (Frontend)

Deploy the React application:

```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
wrangler pages publish cf-pages --project-name=lukairo-engine
```

#### Option 3: Use the Deploy Script

A convenience script is provided:

```bash
./deploy.sh
```

### Environment Variables

#### For Local Development

Create a `.dev.vars` file in the root directory (this file is gitignored):

```ini
# .dev.vars
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

### Accessing Environment Variables

**In Cloudflare Workers** (e.g., `workers/app.ts`):
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const value = env.VALUE_FROM_CLOUDFLARE;
    // Use the value
  }
}
```

**In React Router loaders/actions**:
```typescript
export async function loader({ context }: Route.LoaderArgs) {
  const value = context.cloudflare.env.VALUE_FROM_CLOUDFLARE;
  // Use the value
}
```

## 🎨 Styling

This project uses Tailwind CSS 4. Utility classes can be used directly in components:

```tsx
<div className="bg-blue-500 dark:bg-blue-700 p-4">
  Hello World
</div>
```

Global styles are in `app/app.css`.

## 🎨 Customization

### Replacing Texture Assets

The Neural Core visualization uses three texture files. To replace the placeholder textures with your production assets:

1. Navigate to `assets/textures/`
2. Replace the placeholder PNGs with your production assets:
   - `lukairo_gears.png` - Inner core rotating gears texture
   - `lukairo_circuits.png` - Mid-layer circuit board pattern
   - `lukairo_globe.png` - Outer data globe/network visualization
3. Ensure dimensions match (1024×512px recommended)
4. Keep file sizes reasonable (<500KB per texture)
5. Use PNG format with transparency for best results
6. Rebuild/redeploy the application

See `assets/textures/README.md` for detailed texture specifications.

### Adjusting Loader Duration

The LUKAIRO loader displays for 7.5 seconds by default. To adjust this:

Edit `src/styles/lukairo-loader.css`:
```css
:root {
  --lk-duration: 7.5s; /* Change this value */
}
```

**Note:** The `--lk-duration` CSS variable controls multiple animations including the progress bar fill, status text cycling, and the final fadeout. Changing this single variable will adjust all timing consistently.

Also update the timeout in `index.html` to match (add 100ms buffer for smooth transition):
```javascript
setTimeout(() => {
  // Initialize Neural Core
  ...
}, 7600); // Loader duration + 100ms buffer (in milliseconds)
```

### Color Scheme

Modify CSS variables in the `:root` selector of `src/styles/lukairo-loader.css`:

```css
:root {
  --lk-bg: #090c11;           /* Background color */
  --lk-panel: #11161c;        /* Panel color */
  --lk-accent: #6CEAD9;       /* Primary cyan accent */
  --lk-accent-alt: #8AB4F8;   /* Secondary blue accent */
  --lk-text-primary: #E8EAED; /* Primary text color */
  --lk-text-secondary: #9AA0A6; /* Secondary text color */
  --lk-glow: rgba(108, 234, 217, 0.4); /* Glow effect */
}
```

### Neural Core Configuration

The Neural Core visualization can be customized by passing configuration options:

```javascript
const neuralCore = new window.NeuralCore({
  containerId: 'neural-core-container',
  texturePath: '/assets/textures/',
  layers: {
    gears: { radius: 1, speed: 0.003, reverse: false },
    circuits: { radius: 1.5, speed: 0.002, reverse: true },
    globe: { radius: 2, speed: 0.001, reverse: false }
  },
  starfield: {
    count: 1200, // Number of stars
    radius: 50   // Distance from center
  }
});
```

## 🧪 Testing

```bash
# Run type checking
npm run typecheck
```

## 📖 Documentation

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [React Router 7 Docs](https://reactrouter.com/)
- [Hono Framework Docs](https://hono.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

### Project Components

- **LUKAIRO Loader**: Pure CSS loading animation (`src/styles/lukairo-loader.css`)
- **Neural Core**: Three.js-powered 3D visualization (`src/scripts/neural-core.js`)
- **Asset Management**: Organized texture and media assets (`assets/`)

### Directory Documentation

- `cf-pages/` - Static HTML pages and resources for Cloudflare Pages deployment
- `lukairo-static/` - Additional static resources and landing pages
- `assets/` - Media assets including 3D textures and images (see `assets/README.md`)
- `src/` - Source files for loader, Neural Core, and custom components

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 GitHub Copilot Instructions

This repository includes custom GitHub Copilot instructions in `.github/copilot-instructions.md`. These instructions help Copilot understand:

- Project structure and conventions
- Development commands
- Coding standards
- Best practices for this codebase

When working with GitHub Copilot, it will automatically reference these instructions to provide better assistance.

## 📄 License

Proudly Canadian 🍁

© 2025 LUKAIRO LDB INC.

---

## 🆘 Troubleshooting

### Common Issues

**Build errors:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Regenerate Cloudflare types
npm run cf-typegen
```

**Wrangler authentication issues:**
```bash
# Re-authenticate
wrangler logout
wrangler login
```

**Deployment fails:**
- Verify your `account_id` in `wrangler.toml` is correct
- Check that you have the necessary permissions in your Cloudflare account
- Ensure all environment variables are set

## 🔗 Useful Links

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [React Router on Cloudflare](https://reactrouter.com/start/deploying/cloudflare)

---

**Built with ❤️ using Cloudflare Workers**
