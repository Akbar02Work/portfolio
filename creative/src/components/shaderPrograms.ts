export const VERT = `
attribute vec2 position;
varying vec2 v_uv;
void main() {
  v_uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const TRAIL_FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_prev;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec2 u_prev_mouse;
uniform float u_moving;
uniform float u_time;
uniform float u_fade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 curl(vec2 p) {
  float e = 0.01;
  float n1 = noise(p + vec2(0.0, e));
  float n2 = noise(p - vec2(0.0, e));
  float n3 = noise(p + vec2(e, 0.0));
  float n4 = noise(p - vec2(e, 0.0));
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}

void main() {
  vec2 texel = 1.0 / u_res;
  vec2 flow = curl(v_uv * 2.4 + u_time * 0.08) * 0.0028;
  flow += curl(v_uv * 5.5 - u_time * 0.05) * 0.0012;

  // Soft diffusion + advection (ink bleeding into water)
  vec4 c = texture2D(u_prev, v_uv - flow) * 0.32;
  c += texture2D(u_prev, v_uv - flow + vec2(texel.x, 0.0)) * 0.17;
  c += texture2D(u_prev, v_uv - flow - vec2(texel.x, 0.0)) * 0.17;
  c += texture2D(u_prev, v_uv - flow + vec2(0.0, texel.y)) * 0.17;
  c += texture2D(u_prev, v_uv - flow - vec2(0.0, texel.y)) * 0.17;
  c *= 0.975;

  // Stamp along mouse segment so fast moves leave continuous ribbons
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  vec2 a = u_prev_mouse;
  vec2 b = u_mouse;
  vec2 pa = v_uv - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  float dist = length((pa - ba * h) * aspect);
  float speed = length((b - a) * aspect) * u_res.y;
  float radius = mix(0.028, 0.055, clamp(speed * 0.012, 0.0, 1.0));
  float splat = exp(-dist * dist / (radius * radius)) * u_moving;
  splat *= mix(0.55, 1.35, clamp(speed * 0.02, 0.0, 1.0));
  splat *= u_fade;

  // Dye: lime signal + ember heat in alpha channels encoded in rgb
  vec3 dye = mix(vec3(0.72, 1.0, 0.24), vec3(1.0, 0.42, 0.24), 0.35 + 0.35 * sin(u_time * 0.7));
  c.rgb += dye * splat * 0.55;
  c.a = min(1.0, c.a + splat * 0.85);

  gl_FragColor = clamp(c, 0.0, 1.0);
}
`;

export const DISPLAY_FRAG = `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform sampler2D u_trail;
uniform float u_fade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = v_uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.x, u_res.y);
  vec2 m = (u_mouse - 0.5 * u_res.xy) / min(u_res.x, u_res.y);

  float t = u_time * 0.12;
  float scroll = u_scroll * 0.35;

  float n1 = noise(p * 2.2 + vec2(t, scroll));
  float n2 = noise(p * 4.8 - vec2(t * 0.7, -scroll * 0.4));
  float field = n1 * 0.65 + n2 * 0.35;

  float d = length(p - m * 0.45);
  float glow = exp(-d * 2.8) * 0.55;

  float band = smoothstep(0.35, 0.75, field + glow * 0.35);
  float filament = smoothstep(0.62, 0.64, field + sin(p.x * 8.0 + t * 2.0) * 0.04);

  vec3 voidCol = vec3(0.02, 0.02, 0.02);
  vec3 ink = vec3(0.07, 0.08, 0.07);
  vec3 signal = vec3(0.72, 1.0, 0.24);
  vec3 ember = vec3(1.0, 0.42, 0.24);

  vec3 col = mix(voidCol, ink, field);
  col = mix(col, signal * 0.22, band * 0.55);
  col += signal * filament * 0.18;
  col += ember * glow * 0.12;
  col += signal * exp(-length(p) * 1.4) * 0.05;

  // Fluid ink / smoke trail (strongest on intro + manifesto via u_fade)
  vec4 trail = texture2D(u_trail, uv);
  float smoke = trail.a;
  // Soft warp so residual ink looks watery
  vec2 wobble = vec2(
    noise(uv * 6.0 + t) - 0.5,
    noise(uv * 6.0 - t + 2.3) - 0.5
  ) * 0.004;
  vec4 trail2 = texture2D(u_trail, uv + wobble);
  smoke = max(smoke, trail2.a * 0.85);

  vec3 trailCol = mix(ember, signal, clamp(trail.g / max(trail.r + 0.001, 0.001), 0.0, 1.0));
  trailCol = mix(trailCol, trail.rgb, 0.65);

  float veil = smoothstep(0.02, 0.55, smoke) * u_fade;
  col = mix(col, col + trailCol * 0.55, veil * 0.85);
  col += trailCol * smoke * smoke * 0.35 * u_fade;
  // Thin bright core like wet ink catching light
  col += signal * smoothstep(0.35, 0.9, smoke) * 0.22 * u_fade;

  float vig = smoothstep(1.25, 0.2, length(uv - 0.5));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

