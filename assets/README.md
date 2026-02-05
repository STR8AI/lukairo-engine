# LUKAIRO Engine Assets

This directory contains static assets used throughout the LUKAIRO engine application.

## Directory Structure

```
assets/
├── textures/           # 3D visualization textures
│   ├── lukairo_gears.png
│   ├── lukairo_circuits.png
│   ├── lukairo_globe.png
│   └── README.md
├── leadership/         # Leadership team photos/images
└── README.md          # This file
```

## Asset Categories

### Textures (`textures/`)
3D textures used by the Neural Core visualization component:
- **Gears**: Inner core mechanical texture
- **Circuits**: Mid-layer electronic circuit pattern
- **Globe**: Outer data globe/network visualization

See `textures/README.md` for detailed specifications and replacement instructions.

### Leadership (`leadership/`)
Team member photos and profile images used in the leadership/about sections.

## Asset Guidelines

### File Formats
- Images: PNG (with transparency) or JPG
- Vectors: SVG (when applicable)
- 3D Textures: PNG preferred

### Optimization
- Compress images for web delivery
- Use appropriate dimensions (don't over-size)
- Consider using WebP for better compression (with fallbacks)
- Target file sizes: <500KB for textures, <200KB for photos

### Naming Conventions
- Use lowercase with underscores: `lukairo_gears.png`
- Be descriptive: `leadership_john_doe.jpg`
- Include dimensions if multiple sizes: `logo_512x512.png`

## Deployment
These assets are deployed as static files and should be accessible from:
- Development: `/assets/...`
- Production: `/assets/...` (via Cloudflare Pages/Workers)

## Adding New Assets
1. Place assets in the appropriate subdirectory
2. Follow naming conventions
3. Optimize for web delivery
4. Update relevant README if needed
5. Test in both development and production environments
