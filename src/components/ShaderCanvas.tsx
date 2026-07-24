import { useEffect, useRef } from "react";
import { DISPLAY_FRAG, TRAIL_FRAG, VERT } from "./shaderPrograms";

/**
 * Fullscreen creative atmosphere + fluid ink trail.
 * Ping-pong FBO trail with curl advection → paint-on-water / smoke follow.
 */


type Props = {
  scrollRef: React.MutableRefObject<number>;
};

type Fbo = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
};

function createProgram(
  gl: WebGLRenderingContext,
  vsSrc: string,
  fsSrc: string,
): { program: WebGLProgram; vs: WebGLShader; fs: WebGLShader } | null {
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

  const vs = compile(gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  return { program, vs, fs };
}

function createFbo(gl: WebGLRenderingContext, w: number, h: number): Fbo | null {
  const tex = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!tex || !fbo) return null;

  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteTexture(tex);
    gl.deleteFramebuffer(fbo);
    return null;
  }
  return { tex, fbo };
}

function destroyFbo(gl: WebGLRenderingContext, fbo: Fbo | null) {
  if (!fbo) return;
  gl.deleteTexture(fbo.tex);
  gl.deleteFramebuffer(fbo.fbo);
}

export function ShaderCanvas({ scrollRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, px: 0.5, py: 0.5, moving: 0 });

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
    gl.clearColor(0.02, 0.02, 0.02, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const trailBuilt = createProgram(gl, VERT, TRAIL_FRAG);
    const displayBuilt = createProgram(gl, VERT, DISPLAY_FRAG);
    if (!trailBuilt || !displayBuilt) {
      for (const built of [trailBuilt, displayBuilt]) {
        if (!built) continue;
        gl.deleteProgram(built.program);
        gl.deleteShader(built.vs);
        gl.deleteShader(built.fs);
      }
      return;
    }

    const { program: trailProg, vs: trailVs, fs: trailFs } = trailBuilt;
    const { program: displayProg, vs: displayVs, fs: displayFs } = displayBuilt;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const bindQuad = (program: WebGLProgram) => {
      gl.useProgram(program);
      const posLoc = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    };

    // Trail uniforms
    const tPrev = gl.getUniformLocation(trailProg, "u_prev");
    const tRes = gl.getUniformLocation(trailProg, "u_res");
    const tMouse = gl.getUniformLocation(trailProg, "u_mouse");
    const tPrevMouse = gl.getUniformLocation(trailProg, "u_prev_mouse");
    const tMoving = gl.getUniformLocation(trailProg, "u_moving");
    const tTime = gl.getUniformLocation(trailProg, "u_time");
    const tFade = gl.getUniformLocation(trailProg, "u_fade");

    // Display uniforms
    const dTime = gl.getUniformLocation(displayProg, "u_time");
    const dRes = gl.getUniformLocation(displayProg, "u_res");
    const dMouse = gl.getUniformLocation(displayProg, "u_mouse");
    const dScroll = gl.getUniformLocation(displayProg, "u_scroll");
    const dTrail = gl.getUniformLocation(displayProg, "u_trail");
    const dFade = gl.getUniformLocation(displayProg, "u_fade");

    let raf = 0;
    const start = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let trailW = 0;
    let trailH = 0;
    let readFbo: Fbo | null = null;
    let writeFbo: Fbo | null = null;
    let pointerSeen = false;
    let running = false;
    let lastFrame = 0;

    const trailFade = (scroll: number) => {
      // Strong on intro + manifesto, soft through works/about/contact
      return Math.max(0.22, 1 - Math.min(1, scroll * 1.15) * 0.78);
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const deviceMemory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowPower =
      coarse || navigator.hardwareConcurrency <= 4 || deviceMemory <= 4;
    const dprCap = lowPower ? 1 : 1.5;
    const trailScale = lowPower ? 0.35 : 0.55;
    const targetFrameMs = lowPower ? 1000 / 30 : 0;

    const resizeTrail = (cssW: number, cssH: number) => {
      // Half-res trail for soft smoke + cheaper blur (lighter on touch devices)
      const scale = Math.min(dpr, coarse ? 1 : 1.25) * trailScale;
      const w = Math.max(2, Math.floor(cssW * scale));
      const h = Math.max(2, Math.floor(cssH * scale));
      if (w === trailW && h === trailH && readFbo && writeFbo) return;
      trailW = w;
      trailH = h;
      destroyFbo(gl, readFbo);
      destroyFbo(gl, writeFbo);
      readFbo = createFbo(gl, w, h);
      writeFbo = createFbo(gl, w, h);
      if (readFbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, readFbo.fbo);
        gl.viewport(0, 0, w, h);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      resizeTrail(width, height);
    };

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      const m = mouseRef.current;
      if (!pointerSeen) {
        m.px = nx;
        m.py = ny;
        pointerSeen = true;
      } else {
        m.px = m.x;
        m.py = m.y;
      }
      m.x = nx;
      m.y = ny;
      const dx = m.x - m.px;
      const dy = m.y - m.py;
      const speed = Math.hypot(dx * window.innerWidth, dy * window.innerHeight);
      m.moving = Math.min(1, speed * 0.08);
    };

    const draw = (now: number) => {
      if (!running) return;
      if (targetFrameMs && now - lastFrame < targetFrameMs) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const t = (now - start) / 1000;
      const scroll = scrollRef.current;
      const fade = trailFade(scroll);
      const m = mouseRef.current;

      if (readFbo && writeFbo) {
        // --- Trail update ---
        bindQuad(trailProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, writeFbo.fbo);
        gl.viewport(0, 0, trailW, trailH);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, readFbo.tex);
        gl.uniform1i(tPrev, 0);
        gl.uniform2f(tRes, trailW, trailH);
        gl.uniform2f(tMouse, m.x, m.y);
        gl.uniform2f(tPrevMouse, m.px, m.py);
        gl.uniform1f(tMoving, m.moving);
        gl.uniform1f(tTime, t);
        gl.uniform1f(tFade, fade);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Swap
        const tmp = readFbo;
        readFbo = writeFbo;
        writeFbo = tmp;

        // Decay moving flag so idle cursor stops dumping ink
        m.moving *= 0.86;
        m.px = m.x;
        m.py = m.y;
      }

      // --- Display ---
      bindQuad(displayProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(dTime, t);
      gl.uniform2f(dRes, canvas.width, canvas.height);
      gl.uniform2f(dMouse, m.x * canvas.width, m.y * canvas.height);
      gl.uniform1f(dScroll, scroll);
      gl.uniform1f(dFade, fade);
      if (readFbo) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, readFbo.tex);
        gl.uniform1i(dTrail, 0);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (running || document.hidden) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      destroyFbo(gl, readFbo);
      destroyFbo(gl, writeFbo);
      gl.deleteProgram(trailProg);
      gl.deleteProgram(displayProg);
      gl.deleteShader(trailVs);
      gl.deleteShader(trailFs);
      gl.deleteShader(displayVs);
      gl.deleteShader(displayFs);
      gl.deleteBuffer(buffer);
    };
  }, [scrollRef]);

  return <canvas ref={canvasRef} className="shader-canvas" aria-hidden="true" />;
}
