/* A small 2D particle fluid for the figures on this page: double density relaxation
   (Clavet, Beaudoin and Poulin 2005), in units where the rest spacing of particles is 1 and one step is
   one unit of time. y points up. Every particle keeps its material coordinate (where it started),
   so the deformation map x = phi(X, t) can be drawn. */
(function (root) {
  'use strict';

  function rng(seed) {                         // mulberry32: the same seed gives the same flow
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  class Fluid {
    // o: { W, H, block: [x0, y0, w, h] in particle spacings, seed, h, k, kNear, g, visc }
    constructor(o) {
      this.o = Object.assign({ W: 80, H: 50, block: [1, 1, 24, 36], seed: 7, h: 2.4, k: 0.035, kNear: 0.11, g: 0.012, visc: 0.25, wall: 1 }, o);
      this.reset();
    }
    reset() {
      const o = this.o, rand = rng(o.seed), [bx, by, bw, bh] = o.block;
      const nx = Math.floor(bw), ny = Math.floor(bh), n = nx * ny;
      this.n = n; this.steps = 0;
      this.x = new Float64Array(n); this.y = new Float64Array(n);
      this.px = new Float64Array(n); this.py = new Float64Array(n);
      this.vx = new Float64Array(n); this.vy = new Float64Array(n);
      this.u = new Float32Array(n); this.w = new Float32Array(n);   // material coordinates in [0, 1]
      let i = 0;
      for (let b = 0; b < ny; b++) {
        for (let a = 0; a < nx; a++, i++) {
          this.x[i] = bx + 0.5 + a + (rand() - 0.5) * 0.1;
          this.y[i] = by + 0.5 + b + (rand() - 0.5) * 0.1;
          this.u[i] = (a + 0.5) / nx; this.w[i] = (b + 0.5) / ny;
        }
      }
      // rest density measured on the unjittered lattice, slightly relaxed so the column settles calmly
      let rho = 0;
      const R = Math.ceil(o.h);
      for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) {
        const r = Math.hypot(a, b);
        if (r > 0 && r < o.h) rho += (1 - r / o.h) ** 2;
      }
      this.rho0 = rho * 0.92;
      this.wallTables();
      // spatial grid, cell size h
      this.cs = o.h;
      this.gx = Math.ceil(o.W / this.cs) + 1; this.gy = Math.ceil(o.H / this.cs) + 1;
      this.cellStart = new Int32Array(this.gx * this.gy + 1);
      this.cellOf = new Int32Array(n); this.sorted = new Int32Array(n);
      this.nbr = new Int32Array(256); this.nq = new Float64Array(256);
      this.nux = new Float64Array(256); this.nuy = new Float64Array(256);
    }
    // The walls act like a lattice of fixed ghost particles behind them, so the fluid next to a wall
    // sees the same density as inside and does not pack against it. Tabulated by distance to the wall.
    wallTables() {
      const h = this.o.h, N = 64, R = Math.ceil(h) + 1;
      this.wN = N;
      this.wRho = new Float64Array(N + 1); this.wRhoN = new Float64Array(N + 1);
      this.wPush = new Float64Array(N + 1); this.wPushN = new Float64Array(N + 1);
      for (let s = 0; s <= N; s++) {
        const d = (s / N) * h;
        let a = 0, b = 0, c = 0, e = 0;
        const OFF = 8;
        for (let o = 0; o < OFF; o++) {
          for (let gx = -R; gx <= R; gx++) {
            for (let gy = 0; gy < R; gy++) {
              const dx = gx + o / OFF, dy = d + 0.5 + gy, r = Math.hypot(dx, dy);
              if (r >= h || r < 1e-9) continue;
              const q = 1 - r / h, nrm = dy / r;
              a += q * q; b += q * q * q; c += q * nrm; e += q * q * nrm;
            }
          }
        }
        this.wRho[s] = a / OFF; this.wRhoN[s] = b / OFF; this.wPush[s] = c / OFF; this.wPushN[s] = e / OFF;
      }
    }
    build() {
      const n = this.n, cs = this.cs, gx = this.gx, gy = this.gy, start = this.cellStart;
      start.fill(0);
      for (let i = 0; i < n; i++) {
        const cx = Math.min(gx - 1, Math.max(0, Math.floor(this.x[i] / cs)));
        const cy = Math.min(gy - 1, Math.max(0, Math.floor(this.y[i] / cs)));
        const c = cy * gx + cx;
        this.cellOf[i] = c; start[c + 1]++;
      }
      for (let c = 0; c < gx * gy; c++) start[c + 1] += start[c];
      const fill = start.slice(0, gx * gy);
      for (let i = 0; i < n; i++) this.sorted[fill[this.cellOf[i]]++] = i;
    }
    // calls fn(j) for every particle in the 3x3 cells around (x, y)
    around(x, y, fn) {
      const cs = this.cs, gx = this.gx, gy = this.gy, start = this.cellStart, sorted = this.sorted;
      const cx = Math.floor(x / cs), cy = Math.floor(y / cs);
      for (let b = Math.max(0, cy - 1); b <= Math.min(gy - 1, cy + 1); b++) {
        for (let a = Math.max(0, cx - 1); a <= Math.min(gx - 1, cx + 1); a++) {
          const c = b * gx + a;
          for (let s = start[c]; s < start[c + 1]; s++) fn(sorted[s]);
        }
      }
    }
    step() {
      const o = this.o, n = this.n, h = o.h, h2 = h * h;
      const x = this.x, y = this.y, vx = this.vx, vy = this.vy;
      for (let i = 0; i < n; i++) vy[i] -= o.g;
      // viscosity: damp approaching pairs (quadratic term only, as for a thin fluid)
      this.build();
      for (let i = 0; i < n; i++) {
        this.around(x[i], y[i], (j) => {
          if (j <= i) return;
          const dx = x[j] - x[i], dy = y[j] - y[i], r2 = dx * dx + dy * dy;
          if (r2 >= h2 || r2 < 1e-12) return;
          const r = Math.sqrt(r2), ux = dx / r, uy = dy / r;
          const inward = (vx[i] - vx[j]) * ux + (vy[i] - vy[j]) * uy;
          if (inward <= 0) return;
          const I = (1 - r / h) * o.visc * inward * inward * 0.5;
          vx[i] -= I * ux; vy[i] -= I * uy; vx[j] += I * ux; vy[j] += I * uy;
        });
      }
      // predict positions
      for (let i = 0; i < n; i++) { this.px[i] = x[i]; this.py[i] = y[i]; x[i] += vx[i]; y[i] += vy[i]; }
      // double density relaxation
      this.build();
      const nbr = this.nbr, nq = this.nq, nux = this.nux, nuy = this.nuy;
      for (let i = 0; i < n; i++) {
        let rho = 0, rhoN = 0, m = 0;
        this.around(x[i], y[i], (j) => {
          if (j === i || m >= 256) return;
          const dx = x[j] - x[i], dy = y[j] - y[i], r2 = dx * dx + dy * dy;
          if (r2 >= h2 || r2 < 1e-12) return;
          const r = Math.sqrt(r2), q = 1 - r / h;
          rho += q * q; rhoN += q * q * q;
          nbr[m] = j; nq[m] = q; nux[m] = dx / r; nuy[m] = dy / r; m++;
        });
        // ghost walls: distances to the left, right, bottom and top walls
        const wd0 = x[i], wd1 = o.W - x[i], wd2 = y[i], wd3 = o.H - y[i];
        const ws = this.wN / h;
        const s0 = wd0 < h ? Math.round(wd0 * ws) : -1, s1 = wd1 < h ? Math.round(wd1 * ws) : -1;
        const s2 = wd2 < h ? Math.round(wd2 * ws) : -1, s3 = wd3 < h ? Math.round(wd3 * ws) : -1;
        if (s0 >= 0) { rho += this.wRho[s0]; rhoN += this.wRhoN[s0]; }
        if (s1 >= 0) { rho += this.wRho[s1]; rhoN += this.wRhoN[s1]; }
        if (s2 >= 0) { rho += this.wRho[s2]; rhoN += this.wRhoN[s2]; }
        if (s3 >= 0) { rho += this.wRho[s3]; rhoN += this.wRhoN[s3]; }
        const P = o.k * (rho - this.rho0), PN = o.kNear * rhoN;
        let ax = 0, ay = 0;
        const wp = (s) => (s < 0 ? 0 : Math.max(0, o.wall * (P * this.wPush[s] + PN * this.wPushN[s])));
        ax += wp(s0) - wp(s1); ay += wp(s2) - wp(s3);
        for (let t = 0; t < m; t++) {
          const q = nq[t], D = 0.5 * (P * q + PN * q * q), j = nbr[t];
          x[j] += D * nux[t]; y[j] += D * nuy[t];
          ax -= D * nux[t]; ay -= D * nuy[t];
        }
        x[i] += ax; y[i] += ay;
      }
      // walls
      const W = o.W, H = o.H, e = 0.5;
      for (let i = 0; i < n; i++) {
        if (x[i] < e) x[i] = e; else if (x[i] > W - e) x[i] = W - e;
        if (y[i] < e) y[i] = e; else if (y[i] > H - e) y[i] = H - e;
        vx[i] = x[i] - this.px[i]; vy[i] = y[i] - this.py[i];
      }
      this.steps++;
    }
    // stir: particles within radius R of (cx, cy) pick up some of the velocity (dvx, dvy)
    stir(cx, cy, dvx, dvy, R) {
      const R2 = R * R;
      for (let i = 0; i < this.n; i++) {
        const dx = this.x[i] - cx, dy = this.y[i] - cy, d2 = dx * dx + dy * dy;
        if (d2 > R2) continue;
        const f = 0.35 * (1 - d2 / R2);
        this.vx[i] += (dvx - this.vx[i]) * f; this.vy[i] += (dvy - this.vy[i]) * f;
      }
    }
  }
  root.Fluid = Fluid;
  root.fluidRng = rng;
})(window);
