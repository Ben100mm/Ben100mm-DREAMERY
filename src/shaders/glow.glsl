// Glow Effect Vertex Shader
export const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Glow Effect Fragment Shader
export const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float power;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Calculate view direction
    vec3 viewDirection = normalize(-vPosition);
    
    // Fresnel effect
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), power);
    
    // Apply intensity
    float glowIntensity = fresnel * intensity;
    
    gl_FragColor = vec4(glowColor, glowIntensity);
  }
`;

