/**
 * Milky Way Panorama Shaders with Stereographic Projection
 * Based on ESO's 360-degree Milky Way panorama
 */

// Vertex Shader - Simple pass-through for fullscreen quad
export const milkyWayVertexShader = `
  void main(void) {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader - Accurate stereographic projection from D3.js example
export const milkyWayFragmentShader = `
  precision mediump float;
  
  uniform sampler2D u_image;
  uniform vec2 u_translate;
  uniform float u_scale;
  uniform vec2 u_rotate;
  uniform float u_brightness;
  uniform float u_contrast;
  uniform float u_saturation;
  
  const float c_pi = 3.14159265358979323846264;
  const float c_halfPi = c_pi * 0.5;
  const float c_twoPi = c_pi * 2.0;
  
  void main(void) {
    // Get screen coordinates
    float x = (gl_FragCoord.x - u_translate.x) / u_scale;
    float y = (u_translate.y - gl_FragCoord.y) / u_scale;
    
    // Inverse stereographic projection
    float rho = sqrt(x * x + y * y);
    float c = 2.0 * atan(rho);
    float sinc = sin(c);
    float cosc = cos(c);
    float lambda = atan(x * sinc, rho * cosc);
    float phi = asin(y * sinc / rho);
    
    // Apply rotation
    float cosphi0 = cos(u_rotate.y);
    float sinphi0 = sin(u_rotate.y);
    float cosphi = cos(phi);
    float x1 = cos(lambda) * cosphi;
    float y1 = sin(lambda) * cosphi;
    float z1 = sin(phi);
    lambda = atan(y1, x1 * cosphi0 + z1 * sinphi0) + u_rotate.x;
    phi = asin(z1 * cosphi0 - x1 * sinphi0);
    
    // Sample the texture with proper UV mapping
    vec2 uv = vec2((lambda + c_pi) / c_twoPi, (phi + c_halfPi) / c_pi);
    vec4 color = texture2D(u_image, uv);
    
    // Apply brightness, contrast, and saturation
    vec3 finalColor = color.rgb;
    
    // Apply contrast
    finalColor = (finalColor - 0.5) * u_contrast + 0.5;
    
    // Apply brightness
    finalColor += u_brightness;
    
    // Apply saturation
    float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(luminance), finalColor, u_saturation);
    
    gl_FragColor = vec4(finalColor, color.a);
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

