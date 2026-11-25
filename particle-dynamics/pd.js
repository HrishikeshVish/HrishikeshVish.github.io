/* Interactive figures for the particle-dynamics article. Each figure runs its own Fluid (fluid.js) and
   animates only while on screen. Colours come from the page's CSS, so the figures follow the light/dark switch. */
(() => {
  'use strict';
  const TAU = 2 * Math.PI;
  const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- colour */
  const T = {};
  function parseColor(s) {
    s = (s || '').trim();
    let m = s.match(/^#([0-9a-f]{3})$/i);
    if (m) return m[1].split('').map((h) => parseInt(h + h, 16));
    m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    m = s.match(/rgba?\(([^)]+)\)/);
    if (m) return m[1].split(/[\s,/]+/).slice(0, 3).map(Number);
    return [128, 128, 128];
  }
  function readTheme() {
    const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n);
    T.fg = parseColor(v('--fig-fg')); T.paper = parseColor(v('--fig-paper')); T.mid = parseColor(v('--fig-mid'));
    T.rule = parseColor(v('--fig-rule')); T.accent = parseColor(v('--accent'));
    T.dark = 0.2126 * T.paper[0] + 0.7152 * T.paper[1] + 0.0722 * T.paper[2] < 128;
  }
  const css = (c, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
  const ink = (a = 1) => css(T.fg, a), acc = (a = 1) => css(T.accent, a);
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const RETHEME = [];
  function retheme() { readTheme(); RETHEME.forEach((f) => f()); }
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', retheme);
  new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ---------------------------------------------------------------- plumbing */
  function surface(cv, aspect) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth || 640, h = Math.round(w * aspect);
    cv.style.height = h + 'px';
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { cv, ctx, w, h };
  }
  function animate(el, frame) {
    let vis = false, raf = 0, last = 0;
    const loop = (t) => {
      raf = 0;
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      if (frame(dt) !== false && vis) raf = requestAnimationFrame(loop); else last = 0;
    };
    const kick = () => { if (!raf && vis) raf = requestAnimationFrame(loop); };
    new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) kick(); }, { rootMargin: '80px' }).observe(el);
    return kick;
  }
  function onWidth(el, fn) {
    let w = -1;
    new ResizeObserver(() => { const nw = el.clientWidth; if (nw && nw !== w) { w = nw; fn(); } }).observe(el);
  }
  function hudOf(root) {
    const m = {};
    root.querySelectorAll('[data-k]').forEach((e) => { (m[e.dataset.k] = m[e.dataset.k] || []).push(e); });
    return (k, v) => { (m[k] || []).forEach((e) => { if (e.textContent !== v) e.textContent = v; }); };
  }
  const act = (root, name, fn) => { const b = root.querySelector(`[data-act="${name}"]`); if (b) b.addEventListener('click', fn); return b; };
  const int = (n) => Math.round(n).toLocaleString('en-US');
  const big = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + ' billion' : n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + ' million' : int(n));

  // a panel maps the fluid box (W x H, y up) into a rectangle of the canvas
  function panel(px, py, pw, ph, W, H) {
    const s = Math.min(pw / W, ph / H), ox = px + (pw - W * s) / 2, oy = py + (ph - H * s) / 2;
    return { s, ox, oy, W, H, X: (x) => ox + x * s, Y: (y) => oy + (H - y) * s, x: (X) => (X - ox) / s, y: (Y) => H - (Y - oy) / s,
      inside: (X, Y) => X >= ox && X <= ox + W * s && Y >= oy && Y <= oy + H * s };
  }
  function drawBox(c, P, label) {
    c.fillStyle = css(T.paper); c.fillRect(P.ox, P.oy, P.W * P.s, P.H * P.s);
    c.strokeStyle = css(T.rule); c.lineWidth = 1; c.strokeRect(P.ox + 0.5, P.oy + 0.5, P.W * P.s - 1, P.H * P.s - 1);
    if (label) {
      c.fillStyle = css(T.mid); c.font = '11px "Geist Mono", ui-monospace, monospace'; c.textBaseline = 'top';
      c.fillText(label, P.ox + 8, P.oy + 7);
    }
  }
  // particles as small squares; colour(i) returns a CSS colour or null for the default ink
  function drawParticles(c, P, xs, ys, idx, size, colour) {
    const r = size / 2;
    if (!colour) { c.fillStyle = ink(0.85); for (const i of idx) c.fillRect(P.X(xs[i]) - r, P.Y(ys[i]) - r, size, size); return; }
    for (const i of idx) { c.fillStyle = colour(i); c.fillRect(P.X(xs[i]) - r, P.Y(ys[i]) - r, size, size); }
  }
  const range = (n) => { const a = new Array(n); for (let i = 0; i < n; i++) a[i] = i; return a; };
  function shuffled(n, seed) { const r = fluidRng(seed), a = range(n); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // stirring with the pointer: drag through the fluid to push it around
  function stirrer(cv, panels, fluid, kick) {
    let last = null;
    const at = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointermove', (e) => {
      const [X, Y] = at(e), P = panels().find((p) => p.inside(X, Y));
      if (!P || !(e.buttons & 1 || e.pointerType === 'touch')) { last = null; return; }
      const x = P.x(X), y = P.y(Y);
      if (last && last.P === P) fluid().stir(x, y, Math.max(-1.5, Math.min(1.5, (x - last.x) * 0.5)), Math.max(-1.5, Math.min(1.5, (y - last.y) * 0.5)), 6);
      last = { P, x, y }; kick();
    });
    cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); last = null; });
    cv.addEventListener('pointerup', () => { last = null; });
  }

  /* ================================================================= figures */

  /* ---- the hero: a dam break you can stir; colour shows where each particle started ---- */
  function figHero(root) {
    const cv = root.querySelector('canvas'), set = hudOf(root);
    const F = new Fluid({ W: 96, H: 52, block: [1, 1, 30, 40], seed: 3 });
    let S, P, mode = 'material';
    const all = range(F.n);
    const material = (i) => (((Math.floor(F.u[i] * 6) + Math.floor(F.w[i] * 8)) % 2) ? acc(0.95) : ink(0.85));
    const speed = (i) => css(mixc(T.fg, T.accent, Math.min(1, Math.hypot(F.vx[i], F.vy[i]) / 0.8)), 0.9);
    function layout() { S = surface(cv, 0.56); P = panel(4, 4, S.w - 8, S.h - 8, F.o.W, F.o.H); kick(); }
    const kick = animate(root, () => {
      if (!S) return false;
      if (!REDUCED) { F.step(); F.step(); }
      if (F.steps > 660) F.reset();
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      drawBox(c, P, null);
      drawParticles(c, P, F.x, F.y, all, Math.max(2, P.s * 0.62), mode === 'material' ? material : speed);
      set('n', int(F.n)); set('dof', int(2 * F.n)); set('t', int(F.steps));
      return !REDUCED;
    });
    stirrer(cv, () => [P], () => F, kick);
    act(root, 'reset', () => { F.reset(); kick(); });
    const bm = act(root, 'mode', () => { mode = mode === 'material' ? 'speed' : 'material'; bm.textContent = mode === 'material' ? 'Colour by speed' : 'Colour by starting position'; kick(); });
    RETHEME.push(kick);
    onWidth(cv.parentElement, layout);
  }

  /* ---- one flow, four discretizations ---- */
  function figDisc(root) {
    const cv = root.querySelector('canvas'), set = hudOf(root);
    const F = new Fluid({ W: 120, H: 66, block: [1, 1, 40, 50], seed: 11 });
    const order = shuffled(F.n, 5), FR = [1, 4, 16, 64];
    const subsets = FR.map((f) => order.slice(0, Math.round(F.n / f)));
    let S, panels = [];
    function layout() {
      const one = cv.clientWidth < 560;
      S = surface(cv, one ? 0.66 : 0.6);
      const gap = one ? 6 : 10, cols = 2, rows = 4 / cols, pw = (S.w - gap * (cols - 1)) / cols, ph = (S.h - gap * (rows - 1)) / rows;
      panels = FR.map((_, k) => panel((k % cols) * (pw + gap), Math.floor(k / cols) * (ph + gap), pw, ph, F.o.W, F.o.H));
      kick();
    }
    const kick = animate(root, () => {
      if (!S) return false;
      if (!REDUCED) { F.step(); F.step(); }
      if (F.steps > 620) F.reset();
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      panels.forEach((P, k) => {
        const n = subsets[k].length;
        drawBox(c, P, `${int(n)} particles · ${int(2 * n)} DoF`);
        drawParticles(c, P, F.x, F.y, subsets[k], Math.max(1.6, P.s * (k === 0 ? 0.7 : 0.9)), null);
      });
      set('t', int(F.steps));
      return !REDUCED;
    });
    stirrer(cv, () => panels, () => F, kick);
    act(root, 'reset', () => { F.reset(); kick(); });
    RETHEME.push(kick);
    onWidth(cv.parentElement, layout);
  }

  /* ---- the interaction graph a message-passing network must evaluate, seen through a lens ---- */
  function figGraph(root) {
    const cv = root.querySelector('canvas'), set = hudOf(root);
    const F = new Fluid({ W: 80, H: 46, block: [1, 1, 24, 36], seed: 9 });
    const all = range(F.n);
    let S, P, radius = 2.0, lens = { x: 30, y: 10 }, LR = 8.5, drag = false;
    function layout() { S = surface(cv, 0.6); P = panel(4, 4, S.w - 8, S.h - 8, F.o.W, F.o.H); kick(); }
    // count the directed edges (messages) of the radius graph over the whole system
    function count() {
      const r2 = radius * radius, cs = radius, gx = Math.ceil(F.o.W / cs) + 1, gy = Math.ceil(F.o.H / cs) + 1;
      const head = new Int32Array(gx * gy).fill(-1), next = new Int32Array(F.n);
      for (let i = 0; i < F.n; i++) {
        const c = Math.min(gy - 1, Math.max(0, Math.floor(F.y[i] / cs))) * gx + Math.min(gx - 1, Math.max(0, Math.floor(F.x[i] / cs)));
        next[i] = head[c]; head[c] = i;
      }
      let E = 0;
      for (let i = 0; i < F.n; i++) {
        const cx = Math.floor(F.x[i] / cs), cy = Math.floor(F.y[i] / cs);
        for (let b = Math.max(0, cy - 1); b <= Math.min(gy - 1, cy + 1); b++) for (let a = Math.max(0, cx - 1); a <= Math.min(gx - 1, cx + 1); a++) {
          for (let j = head[b * gx + a]; j >= 0; j = next[j]) {
            if (j === i) continue;
            const dx = F.x[j] - F.x[i], dy = F.y[j] - F.y[i];
            if (dx * dx + dy * dy < r2) E++;
          }
        }
      }
      return E;
    }
    const kick = animate(root, () => {
      if (!S) return false;
      if (!REDUCED) { F.step(); F.step(); }
      if (F.steps > 700) F.reset();
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      drawBox(c, P, null);
      drawParticles(c, P, F.x, F.y, all, Math.max(2, P.s * 0.55), null);
      // edges, inside the lens only
      const inLens = all.filter((i) => (F.x[i] - lens.x) ** 2 + (F.y[i] - lens.y) ** 2 < LR * LR);
      const r2 = radius * radius;
      c.save();
      c.beginPath(); c.arc(P.X(lens.x), P.Y(lens.y), LR * P.s, 0, TAU); c.clip();
      c.fillStyle = css(T.paper, 0.72); c.fillRect(P.X(lens.x - LR), P.Y(lens.y + LR), 2 * LR * P.s, 2 * LR * P.s);
      c.strokeStyle = acc(0.9); c.lineWidth = 1.1; c.beginPath();
      for (let a = 0; a < inLens.length; a++) for (let b = a + 1; b < inLens.length; b++) {
        const i = inLens[a], j = inLens[b], dx = F.x[j] - F.x[i], dy = F.y[j] - F.y[i];
        if (dx * dx + dy * dy < r2) { c.moveTo(P.X(F.x[i]), P.Y(F.y[i])); c.lineTo(P.X(F.x[j]), P.Y(F.y[j])); }
      }
      c.stroke();
      drawParticles(c, P, F.x, F.y, inLens, Math.max(2.5, P.s * 0.42), () => ink(1));
      c.restore();
      c.strokeStyle = ink(0.6); c.lineWidth = 1.2; c.setLineDash([4, 4]);
      c.beginPath(); c.arc(P.X(lens.x), P.Y(lens.y), LR * P.s, 0, TAU); c.stroke(); c.setLineDash([]);
      const E = count(), deg = E / F.n;
      set('n', int(F.n)); set('deg', deg.toFixed(1)); set('msg', int(E));
      set('million', big(1e6 * deg)); set('r', radius.toFixed(1));
      return !REDUCED;
    });
    const at = (e) => { const r = cv.getBoundingClientRect(); return [P.x(e.clientX - r.left), P.y(e.clientY - r.top)]; };
    cv.addEventListener('pointerdown', (e) => { const [x, y] = at(e); lens = { x, y }; drag = true; cv.setPointerCapture(e.pointerId); kick(); });
    cv.addEventListener('pointermove', (e) => { if (!drag) return; const [x, y] = at(e); lens = { x, y }; kick(); });
    cv.addEventListener('pointerup', () => { drag = false; });
    root.querySelector('[data-in="r"]').addEventListener('input', (e) => { radius = +e.target.value; kick(); });
    RETHEME.push(kick);
    onWidth(cv.parentElement, layout);
  }

  /* ---- pull on one spot: where does a global basis put the error, and where does sampling put it ---- */
  function figPoke(root) {
    const cv = root.querySelector('canvas'), set = hudOf(root);
    const NX = 40, NY = 20, n = NX * NY, PAD = 6, W = NX + 2 * PAD, H = NY + 2 * PAD, ELL = 2.2, FAR = 12;
    const X = new Float64Array(n), Y = new Float64Array(n), U = new Float64Array(n), V = new Float64Array(n);
    for (let b = 0, i = 0; b < NY; b++) for (let a = 0; a < NX; a++, i++) {
      X[i] = PAD + a + 0.5; Y[i] = PAD + b + 0.5; U[i] = (a + 0.5) / NX; V[i] = (b + 0.5) / NY;
    }
    const dx = new Float64Array(n), dy = new Float64Array(n);
    const gx = new Float64Array(n), gy = new Float64Array(n), sx = new Float64Array(n), sy = new Float64Array(n);
    let M = 4, K = 16, Phi, L, anchors, isAnchor, wStart, wIdx, wVal;
    let S, panels = [];
    // the pull: centre c (material point) and displacement g; animated until the reader takes over
    const c = { x: PAD + 12, y: PAD + 10 }, g = { x: 0, y: 0 };
    let user = false, grab = null, clock = 0, amp = 0, resumeAt = 0;

    function setup() {
      K = M * M;
      Phi = new Float64Array(n * K);
      for (let i = 0; i < n; i++) {
        let k = 0;
        for (let a = 0; a < M; a++) for (let b = 0; b < M; b++, k++) Phi[i * K + k] = Math.cos(a * Math.PI * U[i]) * Math.cos(b * Math.PI * V[i]);
      }
      const A = new Float64Array(K * K);
      for (let i = 0; i < n; i++) for (let p = 0; p < K; p++) { const fp = Phi[i * K + p]; for (let q = 0; q <= p; q++) A[p * K + q] += fp * Phi[i * K + q]; }
      L = new Float64Array(K * K);
      for (let p = 0; p < K; p++) for (let q = 0; q <= p; q++) {
        let s = A[p * K + q] + (p === q ? 1e-9 : 0);
        for (let r = 0; r < q; r++) s -= L[p * K + r] * L[q * K + r];
        L[p * K + q] = p === q ? Math.sqrt(Math.max(s, 1e-12)) : s / L[q * K + q];
      }
      // anchors: farthest-point sampling, so K particles cover the body evenly
      const rand = fluidRng(17 + K), dmin = new Float64Array(n).fill(Infinity);
      anchors = [Math.floor(rand() * n)]; isAnchor = new Uint8Array(n); isAnchor[anchors[0]] = 1;
      while (anchors.length < K) {
        const a = anchors[anchors.length - 1];
        let best = 0, bd = -1;
        for (let i = 0; i < n; i++) {
          const d = (X[i] - X[a]) ** 2 + (Y[i] - Y[a]) ** 2;
          if (d < dmin[i]) dmin[i] = d;
          if (dmin[i] > bd) { bd = dmin[i]; best = i; }
        }
        anchors.push(best); isAnchor[best] = 1;
      }
      // kernel weights from each particle to the anchors around it; the width follows the 3rd-nearest anchor
      wStart = new Int32Array(n + 1); const idx = [], val = [], d2 = new Float64Array(K);
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < K; k++) { const a = anchors[k]; d2[k] = (X[a] - X[i]) ** 2 + (Y[a] - Y[i]) ** 2; }
        const third = Float64Array.from(d2).sort()[Math.min(2, K - 1)], s2 = Math.max(1, third);
        let sum = 0; const here = [];
        for (let k = 0; k < K; k++) { const w = Math.exp(-d2[k] / s2); if (w > 1e-4) { here.push([k, w]); sum += w; } }
        for (const [k, w] of here) { idx.push(k); val.push(w / sum); }
        wStart[i + 1] = idx.length;
      }
      wIdx = Int32Array.from(idx); wVal = Float64Array.from(val);
    }
    function solve(b) {
      const y = new Float64Array(K), x = new Float64Array(K);
      for (let p = 0; p < K; p++) { let s = b[p]; for (let r = 0; r < p; r++) s -= L[p * K + r] * y[r]; y[p] = s / L[p * K + p]; }
      for (let p = K - 1; p >= 0; p--) { let s = y[p]; for (let r = p + 1; r < K; r++) s -= L[r * K + p] * x[r]; x[p] = s / L[p * K + p]; }
      return x;
    }
    function fields() {
      for (let i = 0; i < n; i++) {
        const e = Math.exp(-((X[i] - c.x) ** 2 + (Y[i] - c.y) ** 2) / (2 * ELL * ELL));
        dx[i] = g.x * e; dy[i] = g.y * e;
      }
      // global: least-squares fit of the displacement by the K modes
      const bx = new Float64Array(K), by = new Float64Array(K);
      for (let i = 0; i < n; i++) for (let k = 0; k < K; k++) { const f = Phi[i * K + k]; bx[k] += f * dx[i]; by[k] += f * dy[i]; }
      const cx = solve(bx), cy = solve(by);
      for (let i = 0; i < n; i++) {
        let ux = 0, uy = 0;
        for (let k = 0; k < K; k++) { const f = Phi[i * K + k]; ux += f * cx[k]; uy += f * cy[k]; }
        gx[i] = ux; gy[i] = uy;
      }
      // sampled: anchors are exact, the rest is a kernel average of the anchors nearby
      for (let i = 0; i < n; i++) {
        if (isAnchor[i]) { sx[i] = dx[i]; sy[i] = dy[i]; continue; }
        let ux = 0, uy = 0;
        for (let s = wStart[i]; s < wStart[i + 1]; s++) { const a = anchors[wIdx[s]], w = wVal[s]; ux += w * dx[a]; uy += w * dy[a]; }
        sx[i] = ux; sy[i] = uy;
      }
    }
    function stats(ex, ey) {
      let nN = 0, eN = 0, nF = 0, eF = 0;
      for (let i = 0; i < n; i++) {
        const r = Math.hypot(X[i] - c.x, Y[i] - c.y), e = Math.hypot(ex[i] - dx[i], ey[i] - dy[i]);
        if (r < 2 * ELL) { nN++; eN += e; } else if (r > FAR) { nF++; eF += e; }
      }
      return [nN ? eN / nN : 0, nF ? eF / nF : 0];
    }
    function layout() {
      const one = cv.clientWidth < 560;
      S = surface(cv, one ? 1.75 : 0.28);
      const gap = 10, cols = one ? 1 : 3, rows = 3 / cols, pw = (S.w - gap * (cols - 1)) / cols, ph = (S.h - gap * (rows - 1)) / rows;
      panels = [0, 1, 2].map((k) => panel((k % cols) * (pw + gap), Math.floor(k / cols) * (ph + gap), pw, ph, W, H));
      kick();
    }
    const errColour = (e) => css(mixc(T.fg, T.accent, Math.min(1, e / 0.5)), e > 0.05 ? 1 : 0.85);
    function drawSet(P, ex, ey, coloured) {
      const size = Math.max(1.8, P.s * 0.62), r = size / 2;
      for (let i = 0; i < n; i++) {
        c2.fillStyle = coloured ? errColour(Math.hypot(ex[i] - dx[i], ey[i] - dy[i])) : ink(0.85);
        c2.fillRect(P.X(X[i] + ex[i]) - r, P.Y(Y[i] + ey[i]) - r, size, size);
      }
    }
    let c2;
    const kick = animate(root, (dt) => {
      if (!S) return false;
      const now = performance.now();
      if (!user) {
        if (now > resumeAt) {
          clock += dt / 1000; amp = Math.min(1, amp + dt / 1200);
          c.x = PAD + NX / 2 + 12 * Math.cos(0.21 * clock); c.y = PAD + NY / 2 + 4.5 * Math.sin(0.33 * clock + 0.6);
          g.x = amp * 4.5 * Math.cos(0.9 * clock); g.y = amp * 4.5 * Math.sin(0.9 * clock);
        } else { g.x *= 0.85; g.y *= 0.85; amp = 0; }
      }
      fields();
      c2 = S.ctx;
      c2.clearRect(0, 0, S.w, S.h);
      drawBox(c2, panels[0], 'full model');
      drawSet(panels[0], dx, dy, false);
      const P0 = panels[0];
      c2.strokeStyle = acc(1); c2.lineWidth = 1.5;
      c2.beginPath(); c2.arc(P0.X(c.x + g.x), P0.Y(c.y + g.y), 2 * ELL * P0.s, 0, TAU); c2.stroke();
      drawBox(c2, panels[1], `global basis · ${K} modes`);
      drawSet(panels[1], gx, gy, true);
      drawBox(c2, panels[2], `sampled · ${K} anchors`);
      drawSet(panels[2], sx, sy, true);
      const P2 = panels[2], rr = Math.max(3, P2.s * 0.9);
      c2.strokeStyle = ink(0.9); c2.lineWidth = 1;
      for (const a of anchors) { c2.beginPath(); c2.arc(P2.X(X[a] + sx[a]), P2.Y(Y[a] + sy[a]), rr, 0, TAU); c2.stroke(); }
      const [gN, gF] = stats(gx, gy), [sN, sF] = stats(sx, sy);
      set('k', String(K)); set('gn', gN.toFixed(2)); set('sn', sN.toFixed(2)); set('gf', gF.toFixed(2)); set('sf', sF.toFixed(2));
      return !REDUCED || user;
    });
    const at = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => {
      const [px, py] = at(e), P = panels.find((p) => p.inside(px, py));
      if (!P) return;
      user = true; cv.setPointerCapture(e.pointerId);
      const x = P.x(px), y = P.y(py);
      c.x = Math.max(PAD, Math.min(PAD + NX, x)); c.y = Math.max(PAD, Math.min(PAD + NY, y));
      grab = { P, x, y }; g.x = 0; g.y = 0; kick();
    });
    cv.addEventListener('pointermove', (e) => {
      if (!grab) return;
      const [px, py] = at(e);
      let ux = grab.P.x(px) - grab.x, uy = grab.P.y(py) - grab.y;
      const l = Math.hypot(ux, uy); if (l > 7) { ux *= 7 / l; uy *= 7 / l; }
      g.x = ux; g.y = uy; kick();
    });
    const release = () => { if (!grab) return; grab = null; user = false; resumeAt = performance.now() + 2500; kick(); };
    cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', release);
    root.querySelector('[data-in="m"]').addEventListener('input', (e) => { M = +e.target.value; setup(); kick(); });
    setup();
    RETHEME.push(kick);
    onWidth(cv.parentElement, layout);
  }

  /* ---------------------------------------------------------------- boot */
  function init() {
    readTheme();
    const figs = { hero: figHero, disc: figDisc, graph: figGraph, poke: figPoke };
    document.querySelectorAll('[data-fig]').forEach((r) => {
      try { figs[r.dataset.fig](r); } catch (e) { console.error('figure', r.dataset.fig, e); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
