import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_scroll;

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
  vec2 uv = gl_FragCoord.xy / u_res.xy;
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

  float vig = smoothstep(1.25, 0.2, length(uv - 0.5));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

type Props = {
  scrollRef: React.MutableRefObject<number>;
};

export function ShaderCanvas({ scrollRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      canvas.style.display = "none";
      return;
    }

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uScroll = gl.getUniformLocation(program, "u_scroll");

    let raf = 0;
    const start = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX * dpr;
      mouseRef.current.y = (window.innerHeight - e.clientY) * dpr;
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uScroll, scrollRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [scrollRef]);

  return <canvas ref={canvasRef} className="shader-canvas" aria-hidden="true" />;
}
