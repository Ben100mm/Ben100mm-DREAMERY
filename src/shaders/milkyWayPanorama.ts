/**
 * Milky Way Panorama Shaders with Stereographic Projection
 * Based on ESO's 360-degree Milky Way panorama
 */

// Vertex Shader - Fullscreen quad
export const milkyWayVertexShader = `
  void main(void) {
    // Create a fullscreen quad that covers the entire viewport
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader - Procedural Milky Way with dreamery blue tinge
export const milkyWayFragmentShader = `
  precision mediump float;
  
  uniform sampler2D u_image;
  uniform vec2 u_translate;
  uniform float u_scale;
  uniform vec2 u_rotate;
  uniform float u_brightness;
  uniform float u_contrast;
  uniform float u_saturation;
  uniform float u_time;
  uniform bool u_hasTexture;
  
  const float c_pi = 3.14159265358979323846264;
  const float c_halfPi = c_pi * 0.5;
  const float c_twoPi = c_pi * 2.0;
  
  // Noise function for procedural generation
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main(void) {
    if (u_hasTexture) {
      // Use texture-based rendering when available
      float x = (gl_FragCoord.x - u_translate.x) / u_scale;
      float y = (u_translate.y - gl_FragCoord.y) / u_scale;
      
      float rho = sqrt(x * x + y * y);
      float c = 2.0 * atan(rho);
      float sinc = sin(c);
      float cosc = cos(c);
      float lambda = atan(x * sinc, rho * cosc);
      float phi = asin(y * sinc / rho);
      
      float cosphi0 = cos(u_rotate.y);
      float sinphi0 = sin(u_rotate.y);
      float cosphi = cos(phi);
      float x1 = cos(lambda) * cosphi;
      float y1 = sin(lambda) * cosphi;
      float z1 = sin(phi);
      lambda = atan(y1, x1 * cosphi0 + z1 * sinphi0) + u_rotate.x;
      phi = asin(z1 * cosphi0 - x1 * sinphi0);
      
      vec2 uv = vec2((lambda + c_pi) / c_twoPi, (phi + c_halfPi) / c_pi);
      vec4 color = texture2D(u_image, uv);
      
      vec3 finalColor = color.rgb;
      finalColor = (finalColor - 0.5) * u_contrast + 0.5;
      finalColor += u_brightness;
      float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
      finalColor = mix(vec3(luminance), finalColor, u_saturation);
      
      gl_FragColor = vec4(finalColor, color.a);
    } else {
      // Stars only - no blue background
      // Use normalized device coordinates for fullscreen coverage
      vec2 uv = gl_FragCoord.xy / u_translate.xy;
      uv = (uv - 0.5) * 2.0;
      
      // Star field only
      float stars = 0.0;
      for (int i = 0; i < 8; i++) {
        vec2 starUV = uv * (float(i + 1) * 3.0);
        float starNoise = noise(starUV + u_time * 0.05);
        if (starNoise > 0.98) {
          stars += pow(starNoise, 20.0);
        }
      }
      
      // Star color - white/light blue stars
      vec3 starColor = vec3(0.9, 0.95, 1.0); // White stars
      
      // Only show stars, no background
      vec3 result = stars * starColor * 2.0;
      
      // Apply contrast and brightness to stars only
      result = (result - 0.5) * u_contrast + 0.5;
      result += u_brightness;
      
      // Apply saturation to stars only
      float luminance = dot(result, vec3(0.299, 0.587, 0.114));
      result = mix(vec3(luminance), result, u_saturation);
      
      gl_FragColor = vec4(result, 1.0);
    }
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

