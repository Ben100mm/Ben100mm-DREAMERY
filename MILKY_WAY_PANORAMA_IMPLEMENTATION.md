# Milky Way Panorama Implementation

## Overview

This implementation adds an interactive 360-degree Milky Way panorama to the 3D advertising page, featuring stereographic projection and WebGL rendering. The component is based on the European Southern Observatory's magnificent 360-degree panorama data.

## Features

### 🌌 Interactive 360° Panorama
- Real-time stereographic projection using custom WebGL shaders
- Mouse-controlled rotation and zoom
- Smooth animations and transitions
- Procedural star field with twinkling effects

### 🎛️ Advanced Controls
- Brightness, contrast, and saturation adjustment
- Star intensity control
- Zoom and auto-rotation settings
- Reset functionality for all parameters

### 🎨 Visual Effects
- Custom shader materials with fresnel effects
- Glow and atmospheric effects
- Smooth mouse interaction
- Loading states and error handling

## Components

### 1. Shader System (`src/shaders/milkyWayPanorama.glsl`)

**Vertex Shader:**
- Handles stereographic projection mapping
- Applies mouse-based rotation transformations
- Supports zoom functionality
- Maps sphere coordinates to panorama texture coordinates

**Fragment Shader:**
- Renders the Milky Way panorama texture
- Generates procedural stars with twinkling animation
- Applies brightness, contrast, and saturation adjustments
- Adds atmospheric glow effects

### 2. Main Component (`src/components/3d/effects/MilkyWayPanorama3D.tsx`)

**Key Features:**
- WebGL-based rendering with Three.js
- Mouse interaction handling (drag to rotate, scroll to zoom)
- Texture loading with fallback generation
- Real-time uniform updates
- Performance optimization with conditional rendering

**Props:**
```typescript
interface MilkyWayPanorama3DProps {
  textureUrl?: string;           // Panorama texture URL
  initialZoom?: number;          // Starting zoom level
  mouseSensitivity?: number;     // Rotation sensitivity
  interactive?: boolean;         // Enable/disable interaction
  starColor?: string;           // Star color
  starIntensity?: number;       // Star brightness
  brightness?: number;          // Overall brightness
  contrast?: number;            // Contrast level
  saturation?: number;          // Color saturation
  autoRotate?: number;          // Auto-rotation speed
  visible?: boolean;            // Component visibility
  customUniforms?: Record<string, any>;
}
```

### 3. Control Panel (`src/components/3d/controls/MilkyWayControls.tsx`)

**Features:**
- Material-UI based interface
- Real-time parameter adjustment
- Toggle visibility and controls
- Reset functionality
- Responsive design with glassmorphism effects

### 4. Section Integration (`src/components/3d/sections/MilkyWaySection3D.tsx`)

**Integration:**
- Seamlessly integrated into the existing 3D advertising page
- Positioned as Section 12 (final section)
- Includes educational content about the technology
- Links to full experience and learning resources

## Usage

### Basic Implementation

```tsx
import { MilkyWayPanorama3D } from './components/3d/effects/MilkyWayPanorama3D';

// In your 3D scene
<MilkyWayPanorama3D
  textureUrl="/milky-way-panorama.jpg"
  interactive={true}
  initialZoom={1.0}
  mouseSensitivity={0.002}
/>
```

### With Controls

```tsx
import { MilkyWayPanorama3D, useMilkyWayControls } from './components/3d/effects/MilkyWayPanorama3D';
import { MilkyWayControls } from './components/3d/controls/MilkyWayControls';

const { controls, updateControl, resetControls } = useMilkyWayControls();

<>
  <MilkyWayPanorama3D
    brightness={controls.brightness}
    contrast={controls.contrast}
    saturation={controls.saturation}
    starIntensity={controls.starIntensity}
    zoom={controls.zoom}
    autoRotate={controls.autoRotate}
  />
  <MilkyWayControls
    controls={controls}
    onUpdateControl={updateControl}
    onResetControls={resetControls}
  />
</>
```

## Setup Instructions

### 1. Texture Preparation

1. Download the ESO Milky Way panorama from: http://www.eso.org/public/images/eso0932a/
2. Save it as `milky-way-panorama.jpg` in the `public/` directory
3. The component will automatically use the real texture
4. If the texture fails to load, a procedural fallback will be generated

### 2. Integration Steps

The component is already integrated into the main 3D advertising page:

1. **Section 12** - Milky Way Panorama section
2. **Navigation** - Accessible via scroll navigation (section 12)
3. **Controls** - Built-in control panel for interactive adjustment

### 3. Customization

**Shader Customization:**
```glsl
// Modify uniforms in the fragment shader
uniform float uCustomParameter;
uniform vec3 uCustomColor;
```

**Material Customization:**
```typescript
// Add custom uniforms
customUniforms={{
  uCustomParameter: { value: 1.0 },
  uCustomColor: { value: new THREE.Color('#ff0000') }
}}
```

## Technical Details

### Stereographic Projection

The implementation uses stereographic projection to map the equirectangular panorama texture onto a sphere:

1. **Equirectangular to Sphere**: Converts UV coordinates to 3D sphere positions
2. **Sphere to Stereographic**: Projects sphere coordinates to stereographic plane
3. **Texture Mapping**: Maps the projected coordinates to the panorama texture

### Performance Optimization

- **Conditional Rendering**: Only renders nearby sections
- **Efficient Shaders**: Optimized GLSL for 60fps performance
- **Texture Management**: Automatic loading and fallback generation
- **Memory Management**: Proper cleanup of WebGL resources

### Browser Compatibility

- **WebGL Support**: Requires WebGL 1.0 or 2.0
- **Modern Browsers**: Optimized for Chrome, Firefox, Safari, Edge
- **Mobile Support**: Touch interaction for mobile devices
- **Fallback**: Graceful degradation for unsupported browsers

## API Reference

### MilkyWayPanorama3D Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `textureUrl` | `string` | `'/milky-way-panorama.jpg'` | Panorama texture URL |
| `initialZoom` | `number` | `1.0` | Starting zoom level |
| `mouseSensitivity` | `number` | `0.002` | Mouse rotation sensitivity |
| `interactive` | `boolean` | `true` | Enable mouse interaction |
| `starColor` | `string` | `'#ffffff'` | Star color |
| `starIntensity` | `number` | `0.3` | Star brightness |
| `brightness` | `number` | `0.0` | Overall brightness |
| `contrast` | `number` | `1.0` | Contrast level |
| `saturation` | `number` | `1.0` | Color saturation |
| `autoRotate` | `number` | `0.01` | Auto-rotation speed |
| `visible` | `boolean` | `true` | Component visibility |

### useMilkyWayControls Hook

```typescript
const { controls, updateControl, resetControls } = useMilkyWayControls();

// controls object contains:
{
  brightness: number;
  contrast: number;
  saturation: number;
  starIntensity: number;
  zoom: number;
  autoRotate: number;
}

// updateControl(key: string, value: number)
// resetControls() - resets all controls to defaults
```

## Troubleshooting

### Common Issues

1. **Texture Not Loading**
   - Check if `milky-way-panorama.jpg` exists in `public/` directory
   - Verify texture format (JPG/PNG supported)
   - Check browser console for loading errors

2. **Poor Performance**
   - Reduce texture resolution
   - Lower geometry complexity
   - Disable auto-rotation
   - Check WebGL context limits

3. **Interaction Not Working**
   - Verify `interactive={true}` prop
   - Check for conflicting event listeners
   - Ensure proper WebGL context

### Debug Mode

Enable debug logging by setting:
```typescript
// In the component
console.log('Milky Way Panorama Debug Mode');
```

## Future Enhancements

### Planned Features
- [ ] Constellation overlays and labels
- [ ] Deep space object annotations
- [ ] VR/AR support
- [ ] Multi-spectral data visualization
- [ ] Educational content integration
- [ ] Export functionality for high-resolution images

### Performance Improvements
- [ ] WebGL 2.0 features
- [ ] Instanced rendering for stars
- [ ] Level-of-detail (LOD) system
- [ ] Texture streaming
- [ ] GPU-based particle systems

## Credits

- **ESO (European Southern Observatory)**: Original 360° Milky Way panorama data
- **Three.js**: 3D graphics library
- **React Three Fiber**: React integration for Three.js
- **Material-UI**: UI component library

## License

This implementation is part of the Dreamery Software LLC proprietary platform. The Milky Way panorama data is used under ESO's terms of use for educational and demonstration purposes.

---

*For technical support or questions about this implementation, please refer to the development team.*
