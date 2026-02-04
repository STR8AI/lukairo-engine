# LUKAIRO Engine Textures

## Required Textures
Place these texture files in this directory:

1. **lukairo_gears.png** (1024×512px)
   - Inner core rotating gears texture
   - Should have mechanical/industrial aesthetic
   - PNG with transparency recommended

2. **lukairo_circuits.png** (1024×512px)
   - Mid-layer circuit board pattern
   - Tech/electronic aesthetic with lines and nodes
   - PNG with transparency for layering effect

3. **lukairo_globe.png** (1024×512px)
   - Outer data globe/network visualization
   - World map or abstract data flow patterns
   - PNG with transparency

## Placeholder Status
Currently using placeholder images. Replace with production assets.

## Texture Guidelines
- Format: PNG (supports transparency)
- Size: 1024×512px recommended
- Color space: sRGB
- Optimize for web delivery
- Keep file sizes reasonable (<500KB per texture)

## Usage
These textures are used by the Neural Core 3D visualization component:
- Loaded via Three.js TextureLoader
- Applied to spherical geometries
- Supports transparency for layering effects
- Fallback to wireframe mode if textures fail to load
