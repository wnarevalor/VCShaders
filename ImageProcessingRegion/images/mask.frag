#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;

uniform sampler2D texture;
uniform vec2 texOffset;
uniform vec2 uMouse;
uniform bool ridges;
uniform vec2 uResolution;

// holds the 3x3 kernel
uniform float mask[9];

// we need our interpolated tex coord
varying vec2 texcoords2;

const float radius=1.0;
const float depth=radius/2.;

void main() {
  // 1. Use offset to move along texture space.
  // In this case to find the texcoords of the texel neighbours.
  vec2 tc0 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = texcoords2 + vec2(         0.0, -texOffset.t);
  vec2 tc2 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = texcoords2 + vec2(-texOffset.s,          0.0);
  // origin (current fragment texcoords)
  vec2 tc4 = texcoords2 + vec2(         0.0,          0.0);
  vec2 tc5 = texcoords2 + vec2(+texOffset.s,          0.0);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = texcoords2 + vec2(         0.0, +texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, +texOffset.t);

  // 2. Sample texel neighbours within the rgba array
  vec4 rgba[9];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);

  // 3. Apply convolution kernel
  
	vec2 st = gl_FragCoord.xy/(uResolution*2.0);
  float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
  pct = distance(st,vec2(uMouse.x, 1.0 - uMouse.y));
 
    // b. The LENGTH of the vector
    //    from the pixel to the center
    //  vec2 toCenter = vec2(uMouse.xy)-st;
    //  pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(uMouse.xy)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);


	
  vec4 convolution;
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*mask[i];
  }

  vec4 color = vec4(pct/0.1) + convolution;
//  vec2 magnifier_r = vec2(magnifierArea.x, 1.0 - magnifierArea.y);

    // 4. Set color from convolution
  gl_FragColor = vec4(color.rgb, 1.0); 
}
