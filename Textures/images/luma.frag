precision mediump float;

// uniforms are defined and sent by the sketch
uniform bool inverted;
uniform float r_scale;
uniform float g_scale;
uniform float b_scale;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

// returns luma of given texel
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

void main() {
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);
  gl_FragColor = inverted ? vec4((vec3(1.0, 1.0, 1.0) - texel.rgb), 1.0) : vec4(vec3(texel.r - r_scale, texel.g - g_scale, texel.b - b_scale), 1.0);
}