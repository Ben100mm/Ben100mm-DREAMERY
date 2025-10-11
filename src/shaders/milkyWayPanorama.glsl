// Milky Way Panorama Shaders with Stereographic Projection
// Based on ESO's 360-degree Milky Way panorama

// Vertex Shader
export const milkyWayVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uZoom;
  uniform float uRotationX;
  uniform float uRotationY;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vStereographicUv;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    // Apply mouse-based rotation
    vec3 rotatedPosition = position;
    
    // X-axis rotation (vertical mouse movement)
    float cosX = cos(uRotationX);
    float sinX = sin(uRotationX);
    rotatedPosition.y = position.y * cosX - position.z * sinX;
    rotatedPosition.z = position.y * sinX + position.z * cosX;
    
    // Y-axis rotation (horizontal mouse movement)
    float cosY = cos(uRotationY);
    float sinY = sin(uRotationY);
    rotatedPosition.x = position.x * cosY - rotatedPosition.z * sinY;
    rotatedPosition.z = position.x * sinY + rotatedPosition.z * cosY;
    
    // Apply zoom
    rotatedPosition *= uZoom;
    
    // Convert to stereographic projection UV coordinates
    // This maps the sphere to a plane for the panorama texture
    vec3 normalizedPos = normalize(rotatedPosition);
    float r = length(normalizedPos.xy);
    float theta = atan(normalizedPos.y, normalizedPos.x);
    
    // Stereographic projection
    float phi = acos(normalizedPos.z);
    float rho = 2.0 * tan(phi / 2.0);
    
    vStereographicUv = vec2(
      rho * cos(theta) * 0.5 + 0.5,
      rho * sin(theta) * 0.5 + 0.5
    );
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPosition, 1.0);
  }
`;

// Fragment Shader
export const milkyWayFragmentShader = `
  uniform sampler2D uMilkyWayTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uSaturation;
  uniform vec3 uStarColor;
  uniform float uStarIntensity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vStereographicUv;
  
  // Noise function for star twinkling
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Generate procedural stars
  float generateStars(vec2 uv, float time) {
    vec2 grid = floor(uv * 2000.0);
    vec2 gridUv = fract(uv * 2000.0);
    
    float star = 0.0;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 4; j++) {
        vec2 cell = vec2(float(i), float(j));
        vec2 cellUv = gridUv - cell;
        
        float randomValue = random(grid + cell);
        if (randomValue > 0.98) {
          float distance = length(cellUv);
          float twinkle = sin(time * 2.0 + randomValue * 10.0) * 0.5 + 0.5;
          star += smoothstep(0.02, 0.0, distance) * twinkle * randomValue;
        }
      }
    }
    
    return star;
  }
  
  void main() {
    // Sample the Milky Way panorama texture
    vec4 milkyWayColor = texture2D(uMilkyWayTexture, vStereographicUv);
    
    // Generate procedural stars
    float stars = generateStars(vUv, uTime);
    vec3 starColor = uStarColor * stars * uStarIntensity;
    
    // Combine Milky Way and stars
    vec3 finalColor = milkyWayColor.rgb + starColor;
    
    // Apply brightness and contrast
    finalColor = (finalColor - 0.5) * uContrast + 0.5 + uBrightness;
    
    // Apply saturation
    float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(luminance), finalColor, uSaturation);
    
    // Add subtle glow effect
    float glow = smoothstep(0.8, 1.0, length(vNormal));
    finalColor += glow * 0.1;
    
    gl_FragColor = vec4(finalColor, milkyWayColor.a);
  }
`;

// Equirectangular to Stereographic Projection Utility
export const projectionUtils = {
  // Convert equirectangular UV to 3D position on sphere
  equirectToSphere: (uv: [number, number]): [number, number, number] => {
    const [u, v] = uv;
    const phi = (u - 0.5) * 2 * Math.PI; // longitude
    const theta = (v - 0.5) * Math.PI; // latitude
    
    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.sin(theta);
    const z = Math.cos(theta) * Math.cos(phi);
    
    return [x, y, z];
  },
  
  // Convert 3D sphere position to stereographic projection UV
  sphereToStereographic: (x: number, y: number, z: number): [number, number] => {
    const rho = 2.0 * Math.tan(Math.acos(z) / 2.0);
    const theta = Math.atan2(y, x);
    
    const u = rho * Math.cos(theta) * 0.5 + 0.5;
    const v = rho * Math.sin(theta) * 0.5 + 0.5;
    
    return [u, v];
  },
  
  // Convert equirectangular UV directly to stereographic UV
  equirectToStereographic: (uv: [number, number]): [number, number] => {
    const [x, y, z] = projectionUtils.equirectToSphere(uv);
    return projectionUtils.sphereToStereographic(x, y, z);
  }
};
