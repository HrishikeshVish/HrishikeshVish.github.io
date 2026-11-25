/* Interactive figures for the Walk on Spheres article.
   Plain 2D canvas; KaTeX (loaded by the page) is used for the live formulas when present.
   Every figure animates only while it is on screen. */
(() => {
  'use strict';

  const TAU = 2 * Math.PI;
  const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ colour */
  // Black and white plus one accent, all read from the page's CSS custom properties,
  // so the figures follow the reader's light or dark mode.
  const DARKQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  const T = {};
  function parseColor(str) {
    str = (str || '').trim();
    let m = str.match(/^#([0-9a-f]{3})$/i);
    if (m) return m[1].split('').map((h) => parseInt(h + h, 16));
    m = str.match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    m = str.match(/rgba?\(([^)]+)\)/);
    if (m) return m[1].split(/[\s,/]+/).slice(0, 3).map(Number);
    return [128, 128, 128];
  }
  function readTheme() {
    const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n);
    T.fg = parseColor(v('--fig-fg')); T.paper = parseColor(v('--fig-paper')); T.mid = parseColor(v('--fig-mid'));
    T.rule = parseColor(v('--fig-rule')); T.accent = parseColor(v('--accent'));
    T.dark = 0.2126 * T.paper[0] + 0.7152 * T.paper[1] + 0.0722 * T.paper[2] < 128;   // judged from the actual background
    T.accentHex = '#' + T.accent.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('');
  }
  readTheme();
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const clamp01 = (t) => (!(t > 0) ? 0 : t > 1 ? 1 : t);
  // signed values as fills: ink for negative, paper at zero, accent for positive
  function cmapFill(t) { t = clamp01(t); return t < 0.5 ? mix(T.fg, T.paper, 2 * t) : mix(T.paper, T.accent, 2 * t - 1); }
  // the same for lines and dots, with a grey midpoint so values near zero stay visible
  function cmapLine(t) { t = clamp01(t); return t < 0.5 ? mix(T.fg, T.mid, 2 * t) : mix(T.mid, T.accent, 2 * t - 1); }
  function css(c, a = 1) { return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`; }
  const ink = (a = 1) => css(T.fg, a), acc = (a = 1) => css(T.accent, a);
  const glow = (n) => (T.dark ? n : 0);   // a soft glow only on dark backgrounds
  const RETHEME = [];
  const retheme = () => { readTheme(); RETHEME.forEach((f) => f()); };
  if (DARKQ && DARKQ.addEventListener) DARKQ.addEventListener('change', retheme);
  // a host page may also switch themes with a data-theme attribute on the root element
  new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ------------------------------------------------------------------ random */
  let spare = NaN;
  function gauss() {
    if (spare === spare) { const s = spare; spare = NaN; return s; }
    let u = 0;
    while (u === 0) u = Math.random();
    const m = Math.sqrt(-2 * Math.log(u)), a = TAU * Math.random();
    spare = m * Math.sin(a);
    return m * Math.cos(a);
  }
  // radius fraction of a point drawn from the 2D ball's Green's function: density ∝ t log(1/t)
  function greenT() {
    for (;;) {
      const t = Math.random(), u = Math.random() / Math.E;
      if (t > 0 && u < -t * Math.log(t)) return t;
    }
  }

  /* ------------------------------------------------------------------ domain */
  // r(θ) = 1 + c1 cos 4θ + c2 cos 8θ, the domain family of the paper this page grew out of
  class Flower {
    constructor(c1, c2, n = 360) { this.n = n; this.set(c1, c2); }
    set(c1, c2) {
      this.c1 = c1; this.c2 = c2;
      const n = this.n;
      this.px = new Float64Array(n); this.py = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        const th = TAU * i / n, r = this.R(th);
        this.px[i] = r * Math.cos(th); this.py[i] = r * Math.sin(th);
      }
      this.grid = null; this.cx = 0; this.cy = 0; this.exact = false;
    }
    R(th) { return 1 + this.c1 * Math.cos(4 * th) + this.c2 * Math.cos(8 * th); }
    inside(x, y) { return Math.hypot(x, y) < this.R(Math.atan2(y, x)); }
    // exact distance to the boundary polygon over segments i0..i1 (mod n); records the closest point
    seg(x, y, i0, i1) {
      const n = this.n, px = this.px, py = this.py;
      let best = Infinity, bx = 0, by = 0;
      for (let j = i0; j <= i1; j++) {
        const i = ((j % n) + n) % n, k = i + 1 === n ? 0 : i + 1;
        const ax = px[i], ay = py[i], ex = px[k] - ax, ey = py[k] - ay;
        let t = ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const qx = ax + t * ex, qy = ay + t * ey, dx = x - qx, dy = y - qy, d = dx * dx + dy * dy;
        if (d < best) { best = d; bx = qx; by = qy; }
      }
      this.cx = bx; this.cy = by; this.exact = true;
      return Math.sqrt(best);
    }
    distExact(x, y) { return this.seg(x, y, 0, this.n - 1); }
    // exact distance when it is known to be at most dmax: only nearby angles can hold the closest point
    distNear(x, y, dmax) {
      const rho = Math.hypot(x, y);
      if (dmax >= 0.9 * rho) return this.distExact(x, y);
      const half = Math.asin(dmax / rho), th = Math.atan2(y, x), step = TAU / this.n;
      return this.seg(x, y, Math.floor((th - half) / step) - 1, Math.ceil((th + half) / step) + 1);
    }
    buildGrid(res = 170, ext = 1.3) {
      const h = 2 * ext / (res - 1), d = new Float32Array(res * res);
      for (let j = 0; j < res; j++) {
        for (let i = 0; i < res; i++) d[j * res + i] = this.distExact(-ext + i * h, -ext + j * h);
      }
      this.grid = { res, ext, h, d };
    }
    // a radius r with B_r(x) inside the domain. Far from the boundary this is a cheap lower bound from
    // the distance grid (distance is 1-Lipschitz); near it, the exact distance and closest point.
    dist(x, y, eps) {
      const G = this.grid;
      if (G) {
        const i = Math.round((x + G.ext) / G.h), j = Math.round((y + G.ext) / G.h);
        if (i >= 0 && j >= 0 && i < G.res && j < G.res) {
          const off = Math.hypot(x + G.ext - i * G.h, y + G.ext - j * G.h), dn = G.d[j * G.res + i];
          if (dn - off > Math.max(3 * G.h, 2 * eps)) { this.exact = false; return dn - off; }
          return this.distNear(x, y, dn + off);
        }
      }
      return this.distExact(x, y);
    }
    path(ctx, V) {
      ctx.beginPath();
      for (let i = 0; i < this.n; i++) {
        const X = V.X(this.px[i]), Y = V.Y(this.py[i]);
        if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
      }
      ctx.closePath();
    }
  }

  /* ------------------------------------------------------------------ problems */
  // Laplace: g is the trace of a harmonic polynomial, so the exact solution is known everywhere.
  const LAP = { u: (x, y) => 0.5 * (x * x * x - 3 * x * y * y) + 0.5 * x * y + 0.35 * x, f: null };
  LAP.g = LAP.u;
  // Poisson Δu = −f: half the harmonic field plus a Gaussian bump; f = −Δ(bump).
  const POI = (() => {
    const A = 0.9, x0 = 0.22, y0 = 0.12, s2 = 0.1;
    const bump = (x, y) => A * Math.exp(-((x - x0) ** 2 + (y - y0) ** 2) / s2);
    const u = (x, y) => 0.5 * LAP.u(x, y) + bump(x, y);
    const f = (x, y) => bump(x, y) * (4 / s2) * (1 - ((x - x0) ** 2 + (y - y0) ** 2) / s2);
    return { u, g: u, f };
  })();
  function scaleOf(dom, prob) {
    let m = 1e-6;
    for (let j = 0; j <= 80; j++) {
      for (let i = 0; i <= 80; i++) {
        const x = -1.3 + 2.6 * i / 80, y = -1.3 + 2.6 * j / 80;
        if (dom.inside(x, y)) m = Math.max(m, Math.abs(prob.u(x, y)));
      }
    }
    for (let i = 0; i < dom.n; i++) m = Math.max(m, Math.abs(prob.g(dom.px[i], dom.py[i])));
    return m;
  }

  /* ------------------------------------------------------------------ the estimator */
  // One walk on spheres from (x, y). Returns the single-walk estimate; lastSteps holds the jump count and
  // lastWeight the absorption weight. A domain may report the boundary value itself (dom.bval).
  let lastSteps = 0, lastWeight = 1;
  function walk(dom, x, y, eps, prob, rec) {
    let acc = 0, k = 0, w = 1;
    const sq = prob.sigma ? Math.sqrt(prob.sigma) : 0;
    if (rec) { rec.length = 0; rec.push(x, y); }
    for (;;) {
      const r = dom.dist(x, y, eps);
      if (r < eps || k > 400) {
        if (!dom.exact) dom.distExact(x, y);
        lastSteps = k; lastWeight = w;
        if (rec) rec.push(dom.cx, dom.cy);
        return acc + w * (dom.bval !== undefined ? dom.bval : prob.g(dom.cx, dom.cy));
      }
      // absorption: from the centre of a ball, E[e^(−σ τ)] = 1 / I0(r √σ), independent of the exit point
      if (sq) w /= besselI0(sq * r);
      if (prob.f) {
        const t = greenT(), a = TAU * Math.random();
        acc += 0.25 * r * r * prob.f(x + r * t * Math.cos(a), y + r * t * Math.sin(a));
      }
      const a = TAU * Math.random();
      x += r * Math.cos(a); y += r * Math.sin(a); k++;
      if (rec) rec.push(x, y);
    }
  }
  // modified Bessel function of the first kind, order zero
  function besselI0(z) {
    const q = z * z / 4;
    let t = 1, s = 1;
    for (let k = 1; k < 80; k++) { t *= q / (k * k); s += t; if (t < 1e-13 * s) break; }
    return s;
  }
  // first t in [0, 1] with |a + t d| = r, for a inside the circle and a + d outside
  function circleHit(ax, ay, dx, dy, r) {
    const A = dx * dx + dy * dy, B = ax * dx + ay * dy, C = ax * ax + ay * ay - r * r;
    return (-B + Math.sqrt(Math.max(0, B * B - A * C))) / A;
  }

  /* ------------------------------------------------------------------ canvas plumbing */
  function surface(cv, aspect) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth || 640, h = Math.round(w * aspect);
    cv.style.height = h + 'px';
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { cv, ctx, w, h, dpr };
  }
  function layer(S) {
    const cv = document.createElement('canvas');
    cv.width = S.cv.width; cv.height = S.cv.height;
    const ctx = cv.getContext('2d');
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    return { cv, ctx };
  }
  function blit(S, L) { const c = S.ctx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(L.cv, 0, 0); c.restore(); }
  function clearL(L) { const c = L.ctx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, L.cv.width, L.cv.height); c.restore(); }
  function fadeL(L, a) {
    const c = L.ctx;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = 'destination-out'; c.fillStyle = `rgba(0,0,0,${a})`;
    c.fillRect(0, 0, L.cv.width, L.cv.height); c.restore();
  }
  function view(w, h, ext, cx = 0, cy = 0) {
    const s = Math.min(w, h) / (2 * ext);
    return {
      s, X: (x) => w / 2 + (x - cx) * s, Y: (y) => h / 2 - (y - cy) * s,
      x: (X) => cx + (X - w / 2) / s, y: (Y) => cy - (Y - h / 2) / s,
    };
  }
  function glowDot(c, X, Y, r, color) {
    c.save();
    c.shadowColor = color; c.shadowBlur = glow(12); c.fillStyle = color;
    c.beginPath(); c.arc(X, Y, r, 0, TAU); c.fill();
    c.shadowBlur = 0; c.fillStyle = css(T.paper);
    c.beginPath(); c.arc(X, Y, r * 0.45, 0, TAU); c.fill();
    c.restore();
  }
  function boundary(c, dom, V, val, lw) {
    c.save(); c.lineWidth = lw; c.lineCap = 'round';
    for (let i = 0; i < dom.n; i++) {
      const k = (i + 1) % dom.n;
      c.strokeStyle = css(cmapLine(val((dom.px[i] + dom.px[k]) / 2, (dom.py[i] + dom.py[k]) / 2)));
      c.beginPath(); c.moveTo(V.X(dom.px[i]), V.Y(dom.py[i])); c.lineTo(V.X(dom.px[k]), V.Y(dom.py[k])); c.stroke();
    }
    c.restore();
  }
  const ease = (t) => (t >= 1 ? 1 : 1 - (1 - t) ** 3);
  const easeIO = (t) => (t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  // run frame(dt) on animation frames while the element is on screen and frame() does not return false
  function animate(el, frame) {
    let vis = false, raf = 0, last = 0;
    const loop = (t) => {
      raf = 0;
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      if (frame(dt) !== false && vis) raf = requestAnimationFrame(loop); else last = 0;
    };
    const kick = () => { if (!raf && vis) raf = requestAnimationFrame(loop); };
    new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) kick(); },
      { rootMargin: '120px' }).observe(el);
    return kick;
  }
  function onWidth(el, fn) {
    let w = -1;
    new ResizeObserver(() => { const nw = el.clientWidth; if (nw && nw !== w) { w = nw; fn(); } }).observe(el);
  }
  function pointer(cv, getView, onPoint) {
    let id = null;
    const at = (e) => { const r = cv.getBoundingClientRect(), v = getView(); return [v.x(e.clientX - r.left), v.y(e.clientY - r.top)]; };
    cv.addEventListener('pointerdown', (e) => {
      const [x, y] = at(e);
      if (onPoint(x, y, 'down') === false) return;
      id = e.pointerId; cv.setPointerCapture(id); e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => { if (e.pointerId === id) { const [x, y] = at(e); onPoint(x, y, 'move'); } });
    const up = (e) => { if (e.pointerId === id) { id = null; const [x, y] = at(e); onPoint(x, y, 'up'); } };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  }
  function hudOf(root) {
    const m = {};
    root.querySelectorAll('[data-k]').forEach((e) => { m[e.dataset.k] = e; });
    return (k, v) => { if (m[k] && m[k].textContent !== v) m[k].textContent = v; };
  }
  function tex(el, s) {
    if (!el) return;
    if (window.katex) { try { window.katex.render(s, el, { throwOnError: false }); return; } catch (e) { /* fall through */ } }
    el.textContent = s;
  }
  const num = (v, d = 3) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(d);
  const int = (n) => Math.round(n).toLocaleString('en-US');
  function press(btn, on) { if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  function act(root, name, fn) { const b = root.querySelector(`[data-act="${name}"]`); if (b) b.addEventListener('click', fn); return b; }

  /* ------------------------------------------------------------------ sound (opt-in) */
  // big spheres sound low, small spheres high: the walk is heard closing in on the boundary
  const Sound = {
    ac: null, on: false,
    enable(on) {
      this.on = on;
      if (on && !this.ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) this.ac = new A(); }
      if (on && this.ac && this.ac.state === 'suspended') this.ac.resume();
    },
    note(freq, dur = 0.16, gain = 0.05, type = 'triangle') {
      if (!this.on || !this.ac) return;
      const t = this.ac.currentTime, o = this.ac.createOscillator(), g = this.ac.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.ac.destination); o.start(t); o.stop(t + dur + 0.03);
    },
    pent(k) { return [0, 2, 4, 7, 9][((k % 5) + 5) % 5] + 12 * Math.floor(k / 5); },
    jump(r) { const k = Math.max(0, Math.floor(Math.log2(0.9 / Math.max(r, 1e-4)) * 3)); this.note(196 * 2 ** (Math.min(this.pent(k), 40) / 12)); },
    hit(v, vmax) {
      const k = Math.round((v / vmax + 1) * 4), f = 130.8 * 2 ** (this.pent(k) / 12);
      this.note(f, 0.6, 0.06, 'sine'); this.note(f * 1.5, 0.6, 0.035, 'sine');
    },
  };

  /* ================================================================== figures */

  /* ---- walk on spheres, step by step (also the hero animation) ---- */
  function figWalk(root, opts) {
    const hero = !!opts.hero;
    const cv = root.querySelector('canvas'), stage = cv.parentElement, set = hudOf(root);
    const eqEl = root.querySelector('[data-tex]');
    let dom = new Flower(0.14, 0.06), prob = LAP, vmax = scaleOf(dom, prob), eps = 0.02;
    let P = { x: opts.x, y: opts.y }, mode = hero && !REDUCED ? 'play' : 'idle', showPath = false;
    let S, V, base, trail;
    let N = 0, sum = 0, stepsSum = 0, W = null;
    const DUR = hero ? { grow: 210, path: 360, move: 140, project: 260, hold: 380 }
      : { grow: 300, path: 520, move: 200, project: 360, hold: 900 };
    const val = (x, y) => 0.5 + prob.g(x, y) / (2 * vmax);

    function layout() {
      S = surface(cv, hero ? 0.62 : 0.8);
      V = view(S.w, S.h, 1.27);
      base = layer(S); trail = layer(S);
      drawBase(); kick();
    }
    function drawBase() {
      const c = base.ctx;
      clearL(base);
      dom.path(c, V); c.fillStyle = css(T.paper); c.fill();
      c.save(); dom.path(c, V); c.clip();               // ε-shell: the inner half of a 2ε-wide stroke
      c.lineWidth = Math.max(1.2, 2 * eps * V.s); c.strokeStyle = ink(0.1); c.stroke();
      c.restore();
      boundary(c, dom, V, val, hero ? 2.5 : 3);
    }
    function resetStats() { N = 0; sum = 0; stepsSum = 0; W = null; if (trail) clearL(trail); }

    function newWalk() {
      W = { xs: [P.x], ys: [P.y], rad: [], src: [], srcAcc: 0, phase: 'grow', t: 0, path: null, r: 0, bx: 0, by: 0, val: null };
      beginStep();
    }
    function beginStep() {
      const k = W.xs.length - 1, x = W.xs[k], y = W.ys[k];
      const r = dom.distExact(x, y);
      W.r = r; W.t = 0;
      if (r < eps || k > 300) { W.bx = dom.cx; W.by = dom.cy; W.phase = 'project'; return; }
      W.phase = 'grow';
      if (showPath && !hero) {
        // simulate the Brownian path this jump replaces, and jump to where it actually leaves the ball
        const pts = [x, y], s = r / 22;
        let px = x, py = y;
        for (let i = 0; i < 40000; i++) {
          const qx = px + s * gauss(), qy = py + s * gauss();
          if ((qx - x) ** 2 + (qy - y) ** 2 >= r * r) {
            const t = circleHit(px - x, py - y, qx - px, qy - py, r);
            px += t * (qx - px); py += t * (qy - py); pts.push(px, py); break;
          }
          px = qx; py = qy; pts.push(px, py);
        }
        W.path = pts; W.nx = px; W.ny = py;
      } else {
        const a = TAU * Math.random();
        W.path = null; W.nx = x + r * Math.cos(a); W.ny = y + r * Math.sin(a);
      }
      if (prob.f) {
        const t = greenT(), a = TAU * Math.random(), yx = x + r * t * Math.cos(a), yy = y + r * t * Math.sin(a);
        const c = 0.25 * r * r * prob.f(yx, yy);
        W.src.push(yx, yy, c); W.srcAcc += c;
      }
      W.rad.push(r);
      if (!hero) Sound.jump(r);
    }
    function finishWalk() {
      W.val = prob.g(W.bx, W.by) + W.srcAcc;
      N++; sum += W.val; stepsSum += W.rad.length;
      W.phase = 'done'; W.t = 0;
      if (!hero) Sound.hit(W.val, vmax);
      // keep a faint copy of the finished walk
      fadeL(trail, hero ? 0.16 : 0.1);
      const c = trail.ctx;
      c.save(); c.lineWidth = 1;
      c.strokeStyle = ink(0.16);
      for (let k = 0; k < W.rad.length; k++) { c.beginPath(); c.arc(V.X(W.xs[k]), V.Y(W.ys[k]), W.rad[k] * V.s, 0, TAU); c.stroke(); }
      c.strokeStyle = ink(0.3);
      c.beginPath();
      for (let k = 0; k < W.xs.length; k++) { if (k) c.lineTo(V.X(W.xs[k]), V.Y(W.ys[k])); else c.moveTo(V.X(W.xs[k]), V.Y(W.ys[k])); }
      c.lineTo(V.X(W.bx), V.Y(W.by)); c.stroke();
      c.fillStyle = css(cmapLine(val(W.bx, W.by)), 0.9);
      c.beginPath(); c.arc(V.X(W.bx), V.Y(W.by), 2.2, 0, TAU); c.fill();
      c.restore();
      writeTex();
    }
    function runMany(m) {
      const rec = [], c = trail.ctx;
      fadeL(trail, 0.3);
      c.save(); c.lineWidth = 0.6;
      for (let i = 0; i < m; i++) {
        const v = walk(dom, P.x, P.y, eps, prob, rec);
        N++; sum += v; stepsSum += lastSteps;
        c.strokeStyle = ink(0.07);
        c.beginPath();
        for (let j = 0; j < rec.length; j += 2) { if (j) c.lineTo(V.X(rec[j]), V.Y(rec[j + 1])); else c.moveTo(V.X(rec[j]), V.Y(rec[j + 1])); }
        c.stroke();
        const ex = rec[rec.length - 2], ey = rec[rec.length - 1];
        c.fillStyle = css(cmapLine(val(ex, ey)), 0.8);
        c.beginPath(); c.arc(V.X(ex), V.Y(ey), 1.6, 0, TAU); c.fill();
      }
      c.restore();
    }

    function update(dt) {
      if (!W) return;
      W.t += dt;
      switch (W.phase) {
        case 'grow': if (W.t >= DUR.grow) { W.phase = W.path ? 'path' : 'move'; W.t = 0; } break;
        case 'path': if (W.t >= DUR.path) { W.phase = 'move'; W.t = 0; } break;
        case 'move':
          if (W.t >= DUR.move) {
            W.xs.push(W.nx); W.ys.push(W.ny); W.path = null;
            if (mode === 'step') { W.phase = 'await'; W.t = 0; } else beginStep();
          }
          break;
        case 'project': if (W.t >= DUR.project) finishWalk(); break;
        case 'done':
          if (W.t >= DUR.hold) { if (mode === 'play') newWalk(); else W.phase = 'rest'; }
          break;
        default: break;
      }
    }
    function draw() {
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      blit(S, base); blit(S, trail);
      if (W) drawWalk(c);
      glowDot(c, V.X(P.x), V.Y(P.y), 4.6, ink());
    }
    function drawWalk(c) {
      const n = W.xs.length, live = W.phase === 'grow' || W.phase === 'path' || W.phase === 'move';
      for (let k = 0; k < W.rad.length; k++) {
        const cur = live && k === W.rad.length - 1;
        const r = W.rad[k] * (cur && W.phase === 'grow' ? ease(W.t / DUR.grow) : 1);
        const X = V.X(W.xs[k]), Y = V.Y(W.ys[k]);
        c.beginPath(); c.arc(X, Y, r * V.s, 0, TAU);
        if (cur) {
          c.fillStyle = acc(0.08); c.fill();
          c.save(); c.shadowColor = acc(); c.shadowBlur = glow(10); c.strokeStyle = acc(); c.lineWidth = 1.6; c.stroke(); c.restore();
          if (W.phase === 'grow') {           // the radius, measured to the closest boundary point
            c.save(); c.setLineDash([3, 3]); c.strokeStyle = ink(0.45); c.lineWidth = 1;
            dom.distExact(W.xs[k], W.ys[k]);
            c.beginPath(); c.moveTo(X, Y); c.lineTo(X + (V.X(dom.cx) - X) * ease(W.t / DUR.grow), Y + (V.Y(dom.cy) - Y) * ease(W.t / DUR.grow)); c.stroke();
            c.restore();
          }
        } else { c.strokeStyle = ink(0.35); c.lineWidth = 1; c.stroke(); }
      }
      // source samples, one per ball, sized by their contribution
      for (let i = 0; i < W.src.length; i += 3) {
        if (live && i / 3 === W.rad.length - 1 && W.phase === 'grow') continue;
        const X = V.X(W.src[i]), Y = V.Y(W.src[i + 1]), m = Math.min(4, 1.6 + 30 * Math.abs(W.src[i + 2]));
        c.fillStyle = W.src[i + 2] >= 0 ? acc() : ink(0.8);
        c.beginPath(); c.arc(X, Y, m, 0, TAU); c.fill();
      }
      // the visited centres
      c.strokeStyle = ink(0.6); c.lineWidth = 1;
      c.beginPath();
      for (let k = 0; k < n; k++) { if (k) c.lineTo(V.X(W.xs[k]), V.Y(W.ys[k])); else c.moveTo(V.X(W.xs[k]), V.Y(W.ys[k])); }
      c.stroke();
      c.fillStyle = ink(0.85);
      for (let k = 1; k < n; k++) { c.beginPath(); c.arc(V.X(W.xs[k]), V.Y(W.ys[k]), 1.8, 0, TAU); c.fill(); }
      let hx = W.xs[n - 1], hy = W.ys[n - 1];
      if (W.phase === 'path' && W.path) {
        const m = Math.max(2, Math.floor(ease(W.t / DUR.path) * W.path.length / 2) * 2);
        c.save(); c.strokeStyle = ink(0.75); c.lineWidth = 0.9; c.beginPath();
        for (let j = 0; j < m; j += 2) { if (j) c.lineTo(V.X(W.path[j]), V.Y(W.path[j + 1])); else c.moveTo(V.X(W.path[j]), V.Y(W.path[j + 1])); }
        c.stroke(); c.restore();
        hx = W.path[m - 2]; hy = W.path[m - 1];
      } else if (W.phase === 'move') {
        const s = easeIO(W.t / DUR.move);
        hx += (W.nx - hx) * s; hy += (W.ny - hy) * s;
        c.strokeStyle = ink(0.6);
        c.beginPath(); c.moveTo(V.X(W.xs[n - 1]), V.Y(W.ys[n - 1])); c.lineTo(V.X(hx), V.Y(hy)); c.stroke();
      } else if (W.phase === 'project' || W.phase === 'done' || W.phase === 'rest') {
        const s = W.phase === 'project' ? ease(W.t / DUR.project) : 1;
        const tx = hx + (W.bx - hx) * s, ty = hy + (W.by - hy) * s;
        c.save(); c.strokeStyle = acc(); c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(V.X(hx), V.Y(hy)); c.lineTo(V.X(tx), V.Y(ty)); c.stroke(); c.restore();
        if (W.phase !== 'project') {
          const pulse = W.phase === 'done' ? 1 + 2.5 * (1 - ease(Math.min(1, W.t / 500))) : 1;
          c.save(); c.strokeStyle = css(cmapLine(val(W.bx, W.by))); c.lineWidth = 2; c.shadowColor = c.strokeStyle; c.shadowBlur = glow(12);
          c.beginPath(); c.arc(V.X(W.bx), V.Y(W.by), 5 * pulse, 0, TAU); c.stroke(); c.restore();
        }
        hx = tx; hy = ty;
      }
      glowDot(c, V.X(hx), V.Y(hy), 3.6, acc());
    }
    function writeHud() {
      if (W && W.rad.length) {
        set('step', String(W.rad.length));
        set('r', num(W.r));
      } else { set('step', '0'); set('r', '—'); }
      set('n', int(N));
      set('est', N ? num(sum / N) : '—');
      set('exact', num(prob.u(P.x, P.y)));
      set('steps', N ? (stepsSum / N).toFixed(1) : '—');
      set('eps', eps < 0.01 ? eps.toFixed(4) : eps.toFixed(3));
    }
    function writeTex() {
      if (!eqEl) return;
      const done = W && W.val !== null;
      const g = done ? num(prob.g(W.bx, W.by)) : '\\,?\\,';
      if (!prob.f) {
        tex(eqEl, `\\hat u(x) = \\textcolor{${T.accentHex}}{g(\\bar x_K)} = ${g}`);
      } else {
        const s = W ? W.srcAcc : 0;
        tex(eqEl, `\\hat u(x) = \\textcolor{${T.accentHex}}{g(\\bar x_K)} + {\\textstyle\\sum_k \\frac{r_k^2}{4} f(y_k)} = ${g} ${s < 0 ? '-' : '+'} ${Math.abs(s).toFixed(3)}`
          + (done ? ` = ${num(W.val)}` : ''));
      }
    }

    const kick = animate(root, (dt) => {
      if (!S) return false;
      if (hero && !W && mode === 'play') newWalk();
      const before = W && W.phase;
      update(hero ? dt * (1 + Math.min(5, N / 5)) : dt);
      draw();
      writeHud();
      if (W && (W.phase !== before || prob.f)) writeTex();
      if (!W) return false;
      return W.phase !== 'await' && W.phase !== 'rest';
    });

    // interaction
    if (!hero) {
      pointer(cv, () => V, (x, y, ph) => {
        if (ph === 'up') return;
        if (!dom.inside(x, y) || dom.distExact(x, y) < 1.5 * eps) return ph === 'down' ? false : undefined;
        P = { x, y }; resetStats(); writeTex(); kick();
      });
      const bPlay = act(root, 'play', () => {
        mode = mode === 'play' ? 'idle' : 'play'; press(bPlay, mode === 'play');
        if (mode === 'play' && (!W || W.phase === 'await' || W.phase === 'rest')) { if (W && W.phase === 'await') beginStep(); else newWalk(); }
        kick();
      });
      act(root, 'step', () => {
        mode = 'step'; press(bPlay, false);
        if (!W || W.phase === 'rest' || W.phase === 'done') newWalk();
        else if (W.phase === 'await') beginStep();
        writeTex(); kick();
      });
      act(root, 'many', () => { if (W && W.phase !== 'rest' && W.phase !== 'done') W = null; runMany(100); W = null; writeTex(); kick(); draw(); writeHud(); });
      act(root, 'reset', () => { mode = 'idle'; press(bPlay, false); resetStats(); writeTex(); draw(); writeHud(); });
      const bPath = act(root, 'path', () => { showPath = !showPath; press(bPath, showPath); });
      const bSrc = act(root, 'source', () => {
        prob = prob === LAP ? POI : LAP; press(bSrc, prob === POI);
        vmax = scaleOf(dom, prob); resetStats(); drawBase(); writeTex(); draw(); writeHud(); kick();
      });
      const bSnd = act(root, 'sound', () => { Sound.enable(!Sound.on); press(bSnd, Sound.on); });
      root.querySelectorAll('[data-in]').forEach((inp) => {
        inp.addEventListener('input', () => {
          const c1 = +root.querySelector('[data-in="c1"]').value, c2 = +root.querySelector('[data-in="c2"]').value;
          eps = 10 ** +root.querySelector('[data-in="eps"]').value;
          set('c1', num(c1, 2)); set('c2', num(c2, 2));
          if (inp.dataset.in !== 'eps') {
            dom.set(c1, c2); vmax = scaleOf(dom, prob);
            if (!dom.inside(P.x, P.y) || dom.distExact(P.x, P.y) < 2 * eps) P = { x: -0.25, y: 0.15 };
          }
          resetStats(); drawBase(); writeTex(); draw(); writeHud(); kick();
        });
      });
    }
    RETHEME.push(() => { if (!S) return; drawBase(); clearL(trail); writeTex(); draw(); kick(); });
    onWidth(stage, () => {
      layout(); resetStats(); writeTex(); writeHud();
      if (hero && REDUCED) { runMany(60); draw(); writeHud(); }   // a still picture instead of motion
    });
  }

  /* ---- Kakutani: Brownian paths from a point, averaged at the boundary ---- */
  function figKakutani(root) {
    const cv = root.querySelector('canvas'), stage = cv.parentElement, set = hudOf(root);
    const dom = new Flower(0.14, 0.06), prob = LAP, vmax = scaleOf(dom, prob);
    const val = (x, y) => 0.5 + prob.g(x, y) / (2 * vmax);
    const AUTO = REDUCED ? 0 : 120;
    let P = { x: -0.32, y: 0.22 }, S, V, base, trail;
    let N = 0, sum = 0, stepsSum = 0, live = null, queued = 0;

    function layout() {
      S = surface(cv, 0.8); V = view(S.w, S.h, 1.27);
      base = layer(S); trail = layer(S);
      const c = base.ctx;
      dom.path(c, V); c.fillStyle = css(T.paper); c.fill();
      boundary(c, dom, V, val, 3);
      reset();
    }
    function reset() { N = 0; sum = 0; stepsSum = 0; live = null; queued = 0; clearL(trail); kick(); }
    function simulate(x, y) {
      const s = 0.012, pts = [x, y];
      let steps = 0;
      for (;;) {
        const nx = x + s * gauss(), ny = y + s * gauss();
        steps++;
        if (!dom.inside(nx, ny) || steps > 400000) {
          let ax = x, ay = y, bx = nx, by = ny;         // bisect for the crossing
          for (let i = 0; i < 16; i++) {
            const mx = (ax + bx) / 2, my = (ay + by) / 2;
            if (dom.inside(mx, my)) { ax = mx; ay = my; } else { bx = mx; by = my; }
          }
          pts.push(bx, by);
          return { pts, ex: bx, ey: by, steps, v: prob.g(bx, by), shown: 0 };
        }
        x = nx; y = ny;
        if ((steps & 1) === 0) pts.push(x, y);
      }
    }
    function commit(p) {
      N++; sum += p.v; stepsSum += p.steps;
      const c = trail.ctx, col = cmapLine(val(p.ex, p.ey));
      c.save();
      c.strokeStyle = css(col, 0.14); c.lineWidth = 0.8; c.beginPath();
      for (let j = 0; j < p.pts.length; j += 2) { if (j) c.lineTo(V.X(p.pts[j]), V.Y(p.pts[j + 1])); else c.moveTo(V.X(p.pts[j]), V.Y(p.pts[j + 1])); }
      c.stroke();
      const rr = Math.hypot(p.ex, p.ey), ux = p.ex / rr, uy = p.ey / rr, X = V.X(p.ex), Y = V.Y(p.ey);
      c.strokeStyle = css(col, 0.9); c.lineWidth = 1.3;
      c.beginPath(); c.moveTo(X + ux * 3, Y - uy * 3); c.lineTo(X + ux * 10, Y - uy * 10); c.stroke();
      c.restore();
    }
    const kick = animate(root, (dt) => {
      if (!S) return false;
      if (!live && (queued > 0 || N < AUTO)) { live = simulate(P.x, P.y); if (queued > 0) queued--; }
      if (live) {
        live.shown += dt * 3 * (1 + N / 6);
        if (live.shown * 2 >= live.pts.length) { commit(live); live = null; }
      }
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h); blit(S, base); blit(S, trail);
      if (live) {
        const m = Math.min(live.pts.length, Math.floor(live.shown) * 2);
        c.save(); c.strokeStyle = ink(0.85); c.lineWidth = 0.9; c.beginPath();
        for (let j = 0; j < m; j += 2) { if (j) c.lineTo(V.X(live.pts[j]), V.Y(live.pts[j + 1])); else c.moveTo(V.X(live.pts[j]), V.Y(live.pts[j + 1])); }
        c.stroke(); c.restore();
        if (m >= 2) glowDot(c, V.X(live.pts[m - 2]), V.Y(live.pts[m - 1]), 2.8, acc());
      }
      glowDot(c, V.X(P.x), V.Y(P.y), 4.6, ink());
      set('n', int(N));
      set('est', N ? num(sum / N) : '—');
      set('exact', num(prob.u(P.x, P.y)));
      set('steps', N ? int(stepsSum / N) : '—');
      return !!live || queued > 0 || N < AUTO;
    });
    pointer(cv, () => V, (x, y, ph) => {
      if (ph === 'up') return;
      if (!dom.inside(x, y) || dom.distExact(x, y) < 0.03) return ph === 'down' ? false : undefined;
      P = { x, y }; reset();
    });
    act(root, 'many', () => { if (live) { commit(live); live = null; } for (let i = 0; i < 100; i++) commit(simulate(P.x, P.y)); kick(); });
    act(root, 'reset', () => { reset(); });
    RETHEME.push(() => { if (S) layout(); });
    onWidth(stage, layout);
  }

  /* ---- where Brownian motion leaves a disk: uniform from the centre, Poisson kernel elsewhere ---- */
  function figExit(root) {
    const cv = root.querySelector('canvas'), stage = cv.parentElement, set = hudOf(root);
    const BINS = 72, MAX = 24000, R0 = 1.05, K = 0.15, RHO = 0.65;
    let P = { x: 0.5, y: 0.25 }, S, V, trail;
    let hist = new Float64Array(BINS), total = 0;

    function layout() { S = surface(cv, 0.86); V = view(S.w, S.h, 1.86); trail = layer(S); reset(); }
    function reset() { hist = new Float64Array(BINS); total = 0; clearL(trail); kick(); }
    function shoot(keep) {
      const s = 0.02, pts = keep ? [P.x, P.y] : null;
      let x = P.x, y = P.y;
      for (let i = 0; i < 1e6; i++) {
        const nx = x + s * gauss(), ny = y + s * gauss();
        if (nx * nx + ny * ny >= 1) {
          const t = circleHit(x, y, nx - x, ny - y, 1);
          x += t * (nx - x); y += t * (ny - y);
          if (pts) pts.push(x, y);
          break;
        }
        x = nx; y = ny;
        if (pts && (i & 1)) pts.push(x, y);
      }
      let a = Math.atan2(y, x); if (a < 0) a += TAU;
      hist[Math.min(BINS - 1, Math.floor(a / TAU * BINS))]++; total++;
      return pts;
    }
    const kick = animate(root, () => {
      if (!S) return false;
      const t0 = performance.now();
      let n = 0;
      if (total < MAX) {
        fadeL(trail, 0.22);
        while (performance.now() - t0 < 6 && n < 80) {
          const pts = shoot(n < 3);
          if (pts) {
            const c = trail.ctx;
            c.strokeStyle = ink(0.35); c.lineWidth = 0.7; c.beginPath();
            for (let j = 0; j < pts.length; j += 2) { if (j) c.lineTo(V.X(pts[j]), V.Y(pts[j + 1])); else c.moveTo(V.X(pts[j]), V.Y(pts[j + 1])); }
            c.stroke();
          }
          n++;
        }
      }
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      c.fillStyle = css(T.paper); c.beginPath(); c.arc(V.X(0), V.Y(0), V.s, 0, TAU); c.fill();
      blit(S, trail);
      c.strokeStyle = ink(0.6); c.lineWidth = 1.2; c.beginPath(); c.arc(V.X(0), V.Y(0), V.s, 0, TAU); c.stroke();
      // histogram of exit angles, as radial bars (length ∝ density)
      if (total > 0) {
        c.save(); c.lineCap = 'butt'; c.strokeStyle = ink(0.78);
        c.lineWidth = Math.max(1.5, TAU * R0 * V.s / BINS * 0.62);
        for (let b = 0; b < BINS; b++) {
          const ratio = hist[b] / total * BINS, a = (b + 0.5) / BINS * TAU, L = K * ratio;
          c.beginPath();
          c.moveTo(V.X(R0 * Math.cos(a)), V.Y(R0 * Math.sin(a)));
          c.lineTo(V.X((R0 + L) * Math.cos(a)), V.Y((R0 + L) * Math.sin(a)));
          c.stroke();
        }
        c.restore();
      }
      // the Poisson kernel, in the same units
      const rho2 = P.x * P.x + P.y * P.y;
      c.save(); c.strokeStyle = acc(); c.lineWidth = 2; c.shadowColor = acc(); c.shadowBlur = glow(6); c.beginPath();
      for (let i = 0; i <= 360; i++) {
        const a = i / 360 * TAU, ratio = (1 - rho2) / (1 - 2 * (P.x * Math.cos(a) + P.y * Math.sin(a)) + rho2);
        const r = R0 + K * ratio, X = V.X(r * Math.cos(a)), Y = V.Y(r * Math.sin(a));
        if (i) c.lineTo(X, Y); else c.moveTo(X, Y);
      }
      c.stroke(); c.restore();
      glowDot(c, V.X(P.x), V.Y(P.y), 4.6, acc());
      const rho = Math.sqrt(rho2);
      set('rho', rho.toFixed(2)); set('n', int(total));
      set('note', rho < 0.02 ? 'centre: every direction equally likely' : 'off-centre: the near side wins');
      return total < MAX;
    });
    pointer(cv, () => V, (x, y, ph) => {
      if (ph === 'up') return;
      const r = Math.hypot(x, y);
      if (ph === 'down' && r > 1) return false;
      const m = r > RHO ? RHO / r : 1;
      P = r < 0.04 ? { x: 0, y: 0 } : { x: x * m, y: y * m }; reset();
    });
    act(root, 'centre', () => { P = { x: 0, y: 0 }; reset(); });
    act(root, 'off', () => { P = { x: 0.5, y: 0.25 }; reset(); });
    RETHEME.push(() => { if (S) { clearL(trail); kick(); } });
    onWidth(stage, layout);
  }

  /* ---- every pixel its own estimate; error vs walks, and steps vs ε ---- */
  function figField(root) {
    const cvF = root.querySelector('[data-c="field"]'), cvE = root.querySelector('[data-c="err"]'), cvK = root.querySelector('[data-c="steps"]');
    const set = hudOf(root), RES = 150, EXT = 1.3, MAXSPP = 512;
    const dom = new Flower(0.14, 0.06);
    dom.buildGrid(170, EXT);
    let prob = LAP, vmax = scaleOf(dom, prob), eps = 10 ** -2.5;
    const pix = [], PXs = [], PYs = [];
    for (let j = 0; j < RES; j++) {
      for (let i = 0; i < RES; i++) {
        const x = -EXT + (i + 0.5) * 2 * EXT / RES, y = EXT - (j + 0.5) * 2 * EXT / RES;
        if (dom.inside(x, y) && dom.distExact(x, y) > 1e-3) { pix.push(j * RES + i); PXs.push(x); PYs.push(y); }
      }
    }
    const M = pix.length, sum = new Float64Array(M), cnt = new Uint32Array(M), exact = new Float64Array(M);
    const order = new Uint32Array(M);
    const small = document.createElement('canvas'); small.width = RES; small.height = RES;
    const sctx = small.getContext('2d'), img = sctx.createImageData(RES, RES);
    let cursor = 0, pass = 0, walks = 0, steps = 0, errs = [], stepCurve = null;
    let SF, SE, SK, VF;

    function restart() {
      vmax = scaleOf(dom, prob);
      for (let p = 0; p < M; p++) { sum[p] = 0; cnt[p] = 0; exact[p] = prob.u(PXs[p], PYs[p]); order[p] = p; }
      for (let p = M - 1; p > 0; p--) { const q = Math.floor(Math.random() * (p + 1)); const t = order[p]; order[p] = order[q]; order[q] = t; }
      img.data.fill(0); cursor = 0; pass = 0; walks = 0; steps = 0; errs = [];
      kick();
    }
    function paint(p) {
      const c = cmapFill(0.5 + sum[p] / cnt[p] / (2 * vmax)), o = 4 * pix[p];
      img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255;
    }
    function rmse() { let e = 0; for (let p = 0; p < M; p++) { const d = sum[p] / cnt[p] - exact[p]; e += d * d; } return Math.sqrt(e / M); }
    function work(ms) {
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        for (let b = 0; b < 128; b++) {
          const p = order[cursor];
          sum[p] += walk(dom, PXs[p], PYs[p], eps, prob, null); cnt[p]++;
          walks++; steps += lastSteps; paint(p);
          if (++cursor === M) {
            cursor = 0; pass++;
            if ((pass & (pass - 1)) === 0) errs.push([pass, rmse()]);
            if (pass >= MAXSPP) return;
          }
        }
      }
    }
    function computeSteps() {
      stepCurve = [];
      for (let e = 1; e <= 5; e++) {
        let s = 0, n = 0;
        while (n < 1500) {
          const x = (Math.random() * 2 - 1) * 1.2, y = (Math.random() * 2 - 1) * 1.2;
          if (!dom.inside(x, y)) continue;
          walk(dom, x, y, 10 ** -e, LAP, null); s += lastSteps; n++;
        }
        stepCurve.push([e, s / n]);
      }
    }
    function layout() {
      SF = surface(cvF, 1); VF = view(SF.w, SF.h, EXT);
      SE = surface(cvE, 0.62); SK = surface(cvK, 0.62);
      kick();
    }
    function drawField() {
      const c = SF.ctx;
      sctx.putImageData(img, 0, 0);
      c.clearRect(0, 0, SF.w, SF.h);
      dom.path(c, VF); c.fillStyle = css(T.paper); c.fill();
      c.save(); dom.path(c, VF); c.clip();
      c.imageSmoothingEnabled = true;
      c.drawImage(small, VF.X(-EXT), VF.Y(EXT), 2 * EXT * VF.s, 2 * EXT * VF.s);
      c.restore();
      boundary(c, dom, VF, (x, y) => 0.5 + prob.g(x, y) / (2 * vmax), 2.5);
    }
    function axes(c, S, box, xt, yt) {
      c.strokeStyle = css(T.rule); c.lineWidth = 1;
      c.beginPath(); c.moveTo(box.l, box.t); c.lineTo(box.l, box.b); c.lineTo(box.r, box.b); c.stroke();
      c.fillStyle = css(T.mid); c.font = '10.5px "Geist Mono", ui-monospace, monospace';
      c.textAlign = 'center'; c.textBaseline = 'top';
      xt.forEach(([X, s]) => { c.fillText(s, X, box.b + 5); c.fillRect(X, box.b, 1, 3); });
      c.textAlign = 'right'; c.textBaseline = 'middle';
      yt.forEach(([Y, s]) => { c.fillText(s, box.l - 6, Y); c.fillRect(box.l - 3, Y, 3, 1); });
    }
    function drawErr() {
      const c = SE.ctx, box = { l: 44, r: SE.w - 12, t: 14, b: SE.h - 28 };
      c.clearRect(0, 0, SE.w, SE.h);
      const lx = (n) => box.l + Math.log2(n) / 9 * (box.r - box.l);
      const ly = (e) => box.b - (Math.log10(Math.max(e, 1e-3)) + 3) / 3 * (box.b - box.t);
      axes(c, SE, box, [1, 8, 64, 512].map((n) => [lx(n), String(n)]), [[ly(1), '1'], [ly(0.1), '0.1'], [ly(0.01), '0.01'], [ly(0.001), '0.001']]);
      c.fillStyle = css(T.mid); c.textAlign = 'right'; c.textBaseline = 'bottom';
      c.fillText('walks per pixel', box.r, box.b - 4);
      c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('RMS error', box.l + 6, box.t - 2);
      if (!errs.length) return;
      const [n0, e0] = errs[0];
      c.save(); c.setLineDash([4, 4]); c.strokeStyle = ink(0.4); c.lineWidth = 1;
      c.beginPath(); c.moveTo(lx(1), ly(e0 * Math.sqrt(n0))); c.lineTo(lx(512), ly(e0 * Math.sqrt(n0) / Math.sqrt(512))); c.stroke(); c.restore();
      c.fillStyle = ink(0.6); c.textAlign = 'right'; c.textBaseline = 'bottom';
      c.fillText('∝ 1/√N', lx(512) - 2, ly(e0 * Math.sqrt(n0) / Math.sqrt(512)) - 4);
      c.save(); c.strokeStyle = acc(); c.lineWidth = 1.8; c.shadowColor = acc(); c.shadowBlur = glow(8);
      c.beginPath(); errs.forEach(([n, e], i) => { if (i) c.lineTo(lx(n), ly(e)); else c.moveTo(lx(n), ly(e)); }); c.stroke();
      c.fillStyle = acc(); errs.forEach(([n, e]) => { c.beginPath(); c.arc(lx(n), ly(e), 2.6, 0, TAU); c.fill(); });
      c.restore();
    }
    function drawSteps() {
      const c = SK.ctx, box = { l: 44, r: SK.w - 12, t: 14, b: SK.h - 28 };
      c.clearRect(0, 0, SK.w, SK.h);
      const ymax = stepCurve ? Math.ceil(Math.max(...stepCurve.map((p) => p[1])) / 5) * 5 + 5 : 30;
      const lx = (e) => box.l + (e - 0.5) / 5 * (box.r - box.l), ly = (s) => box.b - s / ymax * (box.b - box.t);
      axes(c, SK, box, [1, 2, 3, 4, 5].map((e) => [lx(e), `1e-${e}`]), [0, ymax / 2, ymax].map((s) => [ly(s), String(s)]));
      c.fillStyle = css(T.mid); c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText('ε (log scale)', box.r, box.b - 4);
      c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('mean steps per walk', box.l + 6, box.t - 2);
      const e = -Math.log10(eps);
      c.save(); c.setLineDash([2, 4]); c.strokeStyle = css(T.mid);
      c.beginPath(); c.moveTo(lx(e), box.t); c.lineTo(lx(e), box.b); c.stroke(); c.restore();
      if (!stepCurve) return;
      c.save(); c.strokeStyle = ink(0.85); c.lineWidth = 1.8; c.beginPath();
      stepCurve.forEach(([x, s], i) => { if (i) c.lineTo(lx(x), ly(s)); else c.moveTo(lx(x), ly(s)); }); c.stroke();
      c.fillStyle = ink(0.85); stepCurve.forEach(([x, s]) => { c.beginPath(); c.arc(lx(x), ly(s), 2.6, 0, TAU); c.fill(); });
      c.restore();
    }
    const kick = animate(root, () => {
      if (!SF) return false;
      if (!stepCurve) computeSteps();
      if (pass < MAXSPP) work(9);
      drawField(); drawErr(); drawSteps();
      set('spp', int(pass)); set('steps', walks ? (steps / walks).toFixed(1) : '—');
      set('err', errs.length ? errs[errs.length - 1][1].toFixed(4) : '—');
      set('eps', eps.toExponential(1).replace('e-', '·10⁻').replace(/⁻(\d)/, (m, d) => '⁻' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]));
      return pass < MAXSPP;
    });
    const bL = act(root, 'laplace', () => { prob = LAP; press(bL, true); press(bP, false); restart(); });
    const bP = act(root, 'poisson', () => { prob = POI; press(bP, true); press(bL, false); restart(); });
    act(root, 'restart', restart);
    root.querySelector('[data-in="eps"]').addEventListener('input', (e) => { eps = 10 ** +e.target.value; restart(); });
    restart();
    RETHEME.push(() => { for (let p = 0; p < M; p++) if (cnt[p]) paint(p); kick(); });
    onWidth(cvF.parentElement, layout);
  }

  /* ------------------------------------------------------------------ rooms with holes */
  // An axis-aligned room (the outer boundary) minus circles and boxes. Each piece of boundary carries its
  // own value, and every distance is exact, so the walk needs nothing else.
  class Scene {
    constructor(hx, hy, wall, items, R = 0) {
      this.hx = hx; this.hy = hy; this.wall = wall; this.items = items; this.R = R;   // R > 0: a far circle instead of a room
      this.cx = 0; this.cy = 0; this.bval = wall; this.exact = true;
    }
    sd(it, x, y) {                       // signed distance to an item, negative inside it
      if (it.kind === 'circle') return Math.hypot(x - it.x, y - it.y) - it.r;
      const qx = Math.abs(x - it.x) - it.hx, qy = Math.abs(y - it.y) - it.hy;
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
    }
    itemAt(x, y, pad = 0) { for (const it of this.items) if (this.sd(it, x, y) <= pad) return it; return null; }
    inside(x, y) {
      const out = this.R ? Math.hypot(x, y) < this.R : Math.abs(x) < this.hx && Math.abs(y) < this.hy;
      return out && !this.itemAt(x, y);
    }
    dist(x, y) {
      let best, cx, cy, v = this.wall;
      if (this.R) {
        const L = Math.hypot(x, y) || 1e-12;
        best = this.R - L; cx = x / L * this.R; cy = y / L * this.R;
      } else {
        const ax = this.hx - Math.abs(x), ay = this.hy - Math.abs(y);
        if (ax < ay) { best = ax; cx = (x < 0 ? -1 : 1) * this.hx; cy = y; } else { best = ay; cx = x; cy = (y < 0 ? -1 : 1) * this.hy; }
      }
      for (const it of this.items) {
        let d, px, py;
        if (it.kind === 'circle') {
          const dx = x - it.x, dy = y - it.y, L = Math.hypot(dx, dy) || 1e-12;
          d = L - it.r; px = it.x + dx / L * it.r; py = it.y + dy / L * it.r;
        } else {
          px = Math.max(it.x - it.hx, Math.min(it.x + it.hx, x)); py = Math.max(it.y - it.hy, Math.min(it.y + it.hy, y));
          d = Math.hypot(x - px, y - py);
        }
        if (d < best) { best = d; cx = px; cy = py; v = it.v; }
      }
      this.cx = cx; this.cy = cy; this.bval = v; this.exact = true;
      return best;
    }
    distExact(x, y) { return this.dist(x, y); }
  }
  function itemPath(c, it, V) {
    c.beginPath();
    if (it.kind === 'circle') c.arc(V.X(it.x), V.Y(it.y), it.r * V.s, 0, TAU);
    else c.rect(V.X(it.x - it.hx), V.Y(it.y + it.hy), 2 * it.hx * V.s, 2 * it.hy * V.s);
  }
  function viewRect(w, h, hx, hy) {
    const s = Math.min(w / (2 * hx), h / (2 * hy));
    return { s, X: (x) => w / 2 + x * s, Y: (y) => h / 2 - y * s, x: (X) => (X - w / 2) / s, y: (Y) => -(Y - h / 2) / s };
  }

  /* ------------------------------------------------------------------ a progressive field solve */
  // Walk on Spheres at every pixel of a grid, one walk per pixel per pass, in shuffled order.
  class FieldSolver {
    constructor(dom, x0, x1, y0, y1, res) {
      Object.assign(this, { dom, x0, x1, y0, y1, max: 256 });
      this.rx = res; this.ry = Math.max(2, Math.round(res * (y1 - y0) / (x1 - x0)));
      this.small = document.createElement('canvas'); this.small.width = this.rx; this.small.height = this.ry;
      this.sctx = this.small.getContext('2d'); this.img = this.sctx.createImageData(this.rx, this.ry);
      this.rebuild();
    }
    px2x(i) { return this.x0 + (i + 0.5) * (this.x1 - this.x0) / this.rx; }
    px2y(j) { return this.y1 - (j + 0.5) * (this.y1 - this.y0) / this.ry; }
    rebuild() {
      const pix = [], X = [], Y = [];
      for (let j = 0; j < this.ry; j++) {
        for (let i = 0; i < this.rx; i++) {
          const x = this.px2x(i), y = this.px2y(j);
          if (this.dom.inside(x, y) && this.dom.distExact(x, y) > 1e-3) { pix.push(j * this.rx + i); X.push(x); Y.push(y); }
        }
      }
      this.pix = pix; this.X = X; this.Y = Y; this.M = pix.length;
      this.sum = new Float64Array(this.M); this.cnt = new Uint32Array(this.M); this.order = new Uint32Array(this.M);
    }
    restart(prob, eps, tmap) {
      Object.assign(this, { prob, eps, tmap, cursor: 0, pass: 0, walks: 0, steps: 0, wsum: 0 });
      this.sum.fill(0); this.cnt.fill(0); this.img.data.fill(0);
      for (let p = 0; p < this.M; p++) this.order[p] = p;
      for (let p = this.M - 1; p > 0; p--) { const q = Math.floor(Math.random() * (p + 1)); const t = this.order[p]; this.order[p] = this.order[q]; this.order[q] = t; }
    }
    paint(p) {
      const c = cmapFill(this.tmap(this.sum[p] / this.cnt[p])), o = 4 * this.pix[p], d = this.img.data;
      d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
    }
    repaintAll() { for (let p = 0; p < this.M; p++) if (this.cnt[p]) this.paint(p); }
    busy() { return this.M > 0 && this.pass < this.max; }
    work(ms) {
      if (!this.busy()) return false;
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        for (let b = 0; b < 64; b++) {
          const p = this.order[this.cursor];
          this.sum[p] += walk(this.dom, this.X[p], this.Y[p], this.eps, this.prob, null); this.cnt[p]++;
          this.walks++; this.steps += lastSteps; this.wsum += lastWeight; this.paint(p);
          if (++this.cursor === this.M) { this.cursor = 0; if (++this.pass >= this.max) return false; }
        }
      }
      return true;
    }
    draw(c, V) {
      this.sctx.putImageData(this.img, 0, 0);
      c.save(); c.imageSmoothingEnabled = true;
      c.drawImage(this.small, V.X(this.x0), V.Y(this.y1), (this.x1 - this.x0) * V.s, (this.y1 - this.y0) * V.s);
      c.restore();
    }
    // running means on the whole grid, fixed values where given, lightly box-blurred: input for contouring
    meanGrid(fixed, rad) {
      const { rx, ry } = this, G = new Float32Array(rx * ry).fill(NaN), H = new Float32Array(rx * ry), K = new Float32Array(rx * ry);
      for (let p = 0; p < this.M; p++) if (this.cnt[p]) G[this.pix[p]] = this.sum[p] / this.cnt[p];
      for (const [k, v] of fixed) G[k] = v;
      const pass = (src, dst, dx, dy) => {
        for (let j = 0; j < ry; j++) {
          for (let i = 0; i < rx; i++) {
            let s = 0, n = 0;
            for (let t = -rad; t <= rad; t++) {
              const ii = i + t * dx, jj = j + t * dy;
              if (ii < 0 || jj < 0 || ii >= rx || jj >= ry) continue;
              const v = src[jj * rx + ii];
              if (v === v) { s += v; n++; }
            }
            dst[j * rx + i] = n && src[j * rx + i] === src[j * rx + i] ? s / n : NaN;
          }
        }
      };
      pass(G, H, 1, 0); pass(H, K, 0, 1);
      for (const [k, v] of fixed) K[k] = v;
      return K;
    }
  }
  // iso-lines of a grid (marching squares), as one Path2D per level in canvas coordinates
  function contourPaths(F, G, levels, V) {
    const { rx, ry } = F, out = [];
    const X = (i) => V.X(F.px2x(i)), Y = (j) => V.Y(F.px2y(j));
    for (const L of levels) {
      const path = new Path2D();
      for (let j = 0; j < ry - 1; j++) {
        for (let i = 0; i < rx - 1; i++) {
          const a = G[j * rx + i], b = G[j * rx + i + 1], d = G[(j + 1) * rx + i], e = G[(j + 1) * rx + i + 1];
          if (a !== a || b !== b || d !== d || e !== e) continue;
          const pts = [];
          if ((a < L) !== (b < L)) pts.push([i + (L - a) / (b - a), j]);
          if ((b < L) !== (e < L)) pts.push([i + 1, j + (L - b) / (e - b)]);
          if ((d < L) !== (e < L)) pts.push([i + (L - d) / (e - d), j + 1]);
          if ((a < L) !== (d < L)) pts.push([i, j + (L - a) / (d - a)]);
          for (let q = 0; q + 1 < pts.length; q += 2) {
            path.moveTo(X(pts[q][0]), Y(pts[q][1])); path.lineTo(X(pts[q + 1][0]), Y(pts[q + 1][1]));
          }
        }
      }
      out.push({ L, path });
    }
    return out;
  }

  /* ---- absorption: the screened Poisson equation, walkers that fade ---- */
  function figAbsorb(root) {
    const cv = root.querySelector('canvas'), stage = cv.parentElement, set = hudOf(root);
    const dom = new Flower(0.14, 0.06);
    dom.buildGrid(170, 1.3);
    const vmax = scaleOf(dom, LAP), tmap = (v) => 0.5 + v / (2 * vmax);
    const F = new FieldSolver(dom, -1.3, 1.3, -1.3, 1.3, 150);
    let sigma = 10 ** 1.3 - 1, S, V;
    function restart() { F.restart({ g: LAP.g, f: null, sigma }, 10 ** -2.5, tmap); kick(); }
    function layout() { S = surface(cv, 0.8); V = view(S.w, S.h, 1.27); kick(); }
    const kick = animate(root, () => {
      if (!S) return false;
      const busy = F.work(9);
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      dom.path(c, V); c.fillStyle = css(T.paper); c.fill();
      c.save(); dom.path(c, V); c.clip(); F.draw(c, V); c.restore();
      boundary(c, dom, V, (x, y) => tmap(LAP.g(x, y)), 3);
      // the length over which absorption forgets the boundary: about 1/√σ
      if (sigma > 0.05) {
        const L = Math.min(1.6, 1 / Math.sqrt(sigma)) * V.s, x0 = 14, y0 = S.h - 16;
        c.save(); c.strokeStyle = ink(0.8); c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + L, y0); c.moveTo(x0, y0 - 4); c.lineTo(x0, y0 + 4); c.moveTo(x0 + L, y0 - 4); c.lineTo(x0 + L, y0 + 4); c.stroke();
        c.fillStyle = css(T.mid); c.font = '11px "Geist Mono", ui-monospace, monospace'; c.textBaseline = 'bottom';
        c.fillText('1/√σ', x0, y0 - 6); c.restore();
      }
      set('sigma', sigma < 10 ? sigma.toFixed(2) : sigma.toFixed(1));
      set('spp', int(F.pass));
      set('w', F.walks ? (F.wsum / F.walks).toFixed(3) : '—');
      set('steps', F.walks ? (F.steps / F.walks).toFixed(1) : '—');
      return busy;
    });
    root.querySelector('[data-in="sigma"]').addEventListener('input', (e) => { sigma = 10 ** +e.target.value - 1; restart(); });
    RETHEME.push(() => { F.repaintAll(); kick(); });
    restart();
    onWidth(stage, layout);
  }

  /* ---- electrostatics: two conductors in a grounded box ---- */
  function figElectro(root) {
    const cv = root.querySelector('canvas'), stage = cv.parentElement, set = hudOf(root);
    const HX = 1.35, HY = 0.85, EPS = 2e-3, LEVELS = [-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8];
    const items = [
      { kind: 'circle', x: -0.62, y: 0.14, r: 0.2, v: 1 },
      { kind: 'box', x: 0.62, y: -0.08, hx: 0.11, hy: 0.34, v: -1 },
    ];
    const sc = new Scene(HX, HY, 0, items), prob = { g: () => 0, f: null }, tmap = (v) => 0.5 + 0.5 * v;
    const F = new FieldSolver(sc, -HX, HX, -HY, HY, 180);
    let S, V, fixed = [], paths = null, lastContour = 0, drag = null, probe = null;
    function computeFixed() {
      fixed = [];
      for (let j = 0; j < F.ry; j++) for (let i = 0; i < F.rx; i++) { const it = sc.itemAt(F.px2x(i), F.px2y(j)); if (it) fixed.push([j * F.rx + i, it.v]); }
    }
    function restart() { F.rebuild(); computeFixed(); F.restart(prob, EPS, tmap); paths = null; kick(); }
    function layout() { S = surface(cv, 0.66); V = viewRect(S.w, S.h, HX + 0.03, HY + 0.03); paths = null; kick(); }
    function estimate(x, y, n) {
      let s = 0, s2 = 0;
      for (let i = 0; i < n; i++) { const v = walk(sc, x, y, EPS, prob, null); s += v; s2 += v * v; }
      const m = s / n;
      return { m, se: Math.sqrt(Math.max(0, s2 / n - m * m) / n) };
    }
    function draw() {
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      c.fillStyle = css(T.paper); c.fillRect(V.X(-HX), V.Y(HY), 2 * HX * V.s, 2 * HY * V.s);
      F.draw(c, V);
      if (paths) {
        c.save(); c.lineWidth = 1;
        paths.forEach(({ L, path }) => {
          c.setLineDash(L === 0 ? [3, 3] : []);
          c.strokeStyle = L === 0 ? css(T.mid) : css(cmapLine(tmap(L)), 0.75); c.stroke(path);
        });
        c.restore();
      }
      c.strokeStyle = css(T.mid); c.lineWidth = 2; c.strokeRect(V.X(-HX), V.Y(HY), 2 * HX * V.s, 2 * HY * V.s);
      c.font = '500 12px "Geist Mono", ui-monospace, monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
      for (const it of items) {
        itemPath(c, it, V); c.fillStyle = css(cmapFill(tmap(it.v))); c.fill();
        c.fillStyle = css(T.paper); c.fillText(it.v > 0 ? '+1' : '−1', V.X(it.x), V.Y(it.y));
      }
      if (probe) {
        c.save(); c.strokeStyle = ink(0.8); c.lineWidth = 1.2;
        c.beginPath(); c.arc(V.X(probe.x), V.Y(probe.y), 6, 0, TAU); c.stroke();
        c.beginPath(); c.moveTo(V.X(probe.x) - 11, V.Y(probe.y)); c.lineTo(V.X(probe.x) - 7, V.Y(probe.y));
        c.moveTo(V.X(probe.x) + 7, V.Y(probe.y)); c.lineTo(V.X(probe.x) + 11, V.Y(probe.y)); c.stroke(); c.restore();
      }
    }
    const kick = animate(root, () => {
      if (!S) return false;
      const busy = F.work(drag ? 5 : 9), now = performance.now();
      if (!paths || now - lastContour > 280 || !busy) { paths = contourPaths(F, F.meanGrid(fixed, 2), LEVELS, V); lastContour = now; }
      draw();
      set('spp', int(F.pass)); set('steps', F.walks ? (F.steps / F.walks).toFixed(1) : '—');
      set('probe', probe ? `${num(probe.m)} ± ${probe.se.toFixed(3)}` : '—');
      return busy;
    });
    const at = (e) => { const r = cv.getBoundingClientRect(); return [V.x(e.clientX - r.left), V.y(e.clientY - r.top)]; };
    const fits = (it, x, y) => {
      const ext = it.kind === 'circle' ? [it.r, it.r] : [it.hx, it.hy];
      if (Math.abs(x) + ext[0] > HX - 0.06 || Math.abs(y) + ext[1] > HY - 0.06) return false;
      return items.every((o) => o === it || Math.hypot(o.x - x, o.y - y) > 0.5);
    };
    cv.addEventListener('pointerdown', (e) => {
      const [x, y] = at(e), it = sc.itemAt(x, y, 0.04);
      if (it) { drag = { it, dx: it.x - x, dy: it.y - y, id: e.pointerId }; cv.setPointerCapture(e.pointerId); e.preventDefault(); probe = null; return; }
      if (sc.inside(x, y)) { probe = { x, y, ...estimate(x, y, 2000) }; kick(); draw(); }
    });
    cv.addEventListener('pointermove', (e) => {
      const [x, y] = at(e);
      if (drag && e.pointerId === drag.id) {
        const nx = x + drag.dx, ny = y + drag.dy;
        if (fits(drag.it, nx, ny)) { drag.it.x = nx; drag.it.y = ny; restart(); }
      } else if (!drag && e.pointerType === 'mouse' && sc.inside(x, y)) { probe = { x, y, ...estimate(x, y, 600) }; draw(); set('probe', `${num(probe.m)} ± ${probe.se.toFixed(3)}`); }
    });
    const end = (e) => { if (drag && e.pointerId === drag.id) { drag = null; kick(); } };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('pointerleave', () => { if (!drag) { probe = null; draw(); set('probe', '—'); } });
    act(root, 'restart', restart);
    RETHEME.push(() => { F.repaintAll(); if (S) { draw(); kick(); } });
    restart();
    onWidth(stage, layout);
  }

  /* ---- robot navigation on a harmonic potential, from pointwise gradient estimates ---- */
  function figRobot(root) {
    const cv = root.querySelector('canvas'), stage = cv.parentElement, set = hudOf(root);
    // An open field: obstacles and a far circle (radius 6, off the picture) at u = 1, the goal at u = 0.
    // Walls held at 1 around a room would make u exponentially flat far from the goal, which no Monte Carlo
    // estimate can resolve; in the open plane the chance of reaching the goal decays only logarithmically.
    const HX = 1.95, HY = 1.95, EPS = 2e-3, BATCH = 64, HITS = 30, MAXPAIRS = 6000;   // the visible window
    const goal = { kind: 'circle', x: 1.0, y: 0.42, r: 0.11, v: 0 };
    const obstacles = [
      { kind: 'circle', x: -0.25, y: 0.12, r: 0.2, v: 1 },
      { kind: 'circle', x: 0.42, y: -0.22, r: 0.17, v: 1 },
      { kind: 'box', x: 0.28, y: 0.5, hx: 0.2, hy: 0.05, v: 1 },
      { kind: 'box', x: -0.7, y: -0.35, hx: 0.05, hy: 0.22, v: 1 },
    ];
    const sc = new Scene(HX, HY, 1, [goal, ...obstacles], 6), prob = { g: () => 1, f: null };
    const tmap = (v) => 0.5 + 0.5 * Math.pow(Math.max(0, 1 - v), 0.35);
    const F = new FieldSolver(sc, -HX, HX, -HY, HY, 96);
    let S, V, start = { x: -1.1, y: -0.55 }, R = null, drag = null;

    function plan() { R = { x: start.x, y: start.y, path: [start.x, start.y], walks: 0, u: NaN, done: false, n: 0 }; kick(); }
    function restartField() { F.rebuild(); F.restart(prob, EPS, tmap); }
    // ∇u(x) = (2/r²) E[u(y)(y − x)] over the circle of radius r, from antithetic pairs on evenly spaced
    // directions. Only walks that reach the goal carry information, so keep sampling until enough have.
    function stepRobot() {
      const x = R.x, y = R.y, r = sc.dist(x, y);
      let gx = 0, gy = 0, us = 0, pairs = 0, hits = 0;
      while (hits < HITS && pairs < MAXPAIRS) {
        const th0 = Math.random() * Math.PI / BATCH;
        for (let i = 0; i < BATCH; i++) {
          const a = th0 + Math.PI * i / BATCH, nx = Math.cos(a), ny = Math.sin(a);
          const ua = walk(sc, x + r * nx, y + r * ny, EPS, prob, null), ub = walk(sc, x - r * nx, y - r * ny, EPS, prob, null);
          gx += (ua - ub) * nx; gy += (ua - ub) * ny; us += ua + ub;
          hits += (ua < 0.5) + (ub < 0.5);
        }
        pairs += BATCH;
      }
      R.walks += 2 * pairs; R.u = us / (2 * pairs); R.n++; R.last = 2 * pairs;
      const g = Math.hypot(gx, gy) || 1e-12, h = Math.min(0.03, 0.5 * r);
      R.x -= h * gx / g; R.y -= h * gy / g;
      R.path.push(R.x, R.y);
      if (Math.hypot(R.x - goal.x, R.y - goal.y) - goal.r < 0.02 || R.n > 600) R.done = true;
    }
    function layout() { S = surface(cv, 0.86); V = viewRect(S.w, S.h, HX + 0.03, HY + 0.03); kick(); }
    function draw() {
      const c = S.ctx;
      c.clearRect(0, 0, S.w, S.h);
      c.fillStyle = css(T.paper); c.fillRect(V.X(-HX), V.Y(HY), 2 * HX * V.s, 2 * HY * V.s);
      c.save(); c.globalAlpha = 0.6; F.draw(c, V); c.restore();   // context only: the robot never reads it
      c.strokeStyle = css(T.rule); c.lineWidth = 1; c.strokeRect(V.X(-HX), V.Y(HY), 2 * HX * V.s, 2 * HY * V.s);
      for (const it of obstacles) { itemPath(c, it, V); c.fillStyle = ink(0.88); c.fill(); }
      itemPath(c, goal, V); c.fillStyle = acc(); c.fill();
      c.save(); c.strokeStyle = acc(0.5); c.lineWidth = 1;
      c.beginPath(); c.arc(V.X(goal.x), V.Y(goal.y), goal.r * V.s + 6, 0, TAU); c.stroke(); c.restore();
      // start marker
      c.save(); c.strokeStyle = ink(); c.lineWidth = 1.5; c.beginPath(); c.arc(V.X(start.x), V.Y(start.y), 5, 0, TAU); c.stroke(); c.restore();
      if (R && R.path.length > 2) {
        c.save(); c.strokeStyle = acc(); c.lineWidth = 2; c.lineJoin = 'round'; c.shadowColor = acc(); c.shadowBlur = glow(8);
        c.beginPath();
        for (let j = 0; j < R.path.length; j += 2) { if (j) c.lineTo(V.X(R.path[j]), V.Y(R.path[j + 1])); else c.moveTo(V.X(R.path[j]), V.Y(R.path[j + 1])); }
        c.stroke(); c.restore();
      }
      if (R) glowDot(c, V.X(R.x), V.Y(R.y), 4.4, acc());
    }
    const kick = animate(root, () => {
      if (!S) return false;
      const t0 = performance.now();
      if (R && !R.done) { while (!R.done && performance.now() - t0 < 7) stepRobot(); }
      const fieldBusy = F.work(Math.max(2, 11 - (performance.now() - t0)));
      draw();
      set('n', R ? int(R.n) : '0'); set('walks', R ? int(R.walks) : '0'); set('last', R && R.last ? int(R.last) : '—');
      set('u', R && R.u === R.u ? num(R.u) : '—'); set('spp', int(F.pass));
      return (R && !R.done) || fieldBusy;
    });
    const at = (e) => { const r = cv.getBoundingClientRect(); return [V.x(e.clientX - r.left), V.y(e.clientY - r.top)]; };
    cv.addEventListener('pointerdown', (e) => {
      const [x, y] = at(e);
      const onGoal = Math.hypot(x - goal.x, y - goal.y) < goal.r + 0.09;
      if (!onGoal && !sc.inside(x, y)) return;
      drag = { goal: onGoal, id: e.pointerId }; cv.setPointerCapture(e.pointerId); e.preventDefault();
      if (!onGoal) { start = { x, y }; plan(); }
    });
    cv.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const [x, y] = at(e);
      if (drag.goal) {
        const ok = Math.abs(x) < HX - 0.12 && Math.abs(y) < HY - 0.12 && obstacles.every((o) => sc.sd(o, x, y) > goal.r + 0.05)
          && Math.hypot(x - start.x, y - start.y) > 0.2;
        if (ok) { goal.x = x; goal.y = y; restartField(); plan(); }
      } else if (sc.inside(x, y) && sc.dist(x, y) > 0.02) { start = { x, y }; plan(); }
    });
    const end = (e) => { if (drag && e.pointerId === drag.id) drag = null; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    act(root, 'replan', plan);
    RETHEME.push(() => { F.repaintAll(); if (S) { draw(); kick(); } });
    restartField(); plan();
    onWidth(stage, layout);
  }

  /* ------------------------------------------------------------------ boot */
  function init() {
    readTheme();
    const figs = {
      hero: (r) => figWalk(r, { hero: true, x: -0.42, y: 0.2 }),
      walk: (r) => figWalk(r, { x: -0.32, y: 0.2 }),
      kakutani: figKakutani, exit: figExit, field: figField,
      absorb: figAbsorb, electro: figElectro, robot: figRobot,
    };
    document.querySelectorAll('[data-fig]').forEach((r) => {
      try { figs[r.dataset.fig](r); } catch (e) { console.error('figure', r.dataset.fig, e); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
