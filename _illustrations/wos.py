"""Walk-on-spheres thumbnail in the style of Sawhney et al. (Walk on Stars, Fig. 3):
grey domain, heavy black Dirichlet boundary with an epsilon-shell, translucent
periwinkle balls, thin walk segments, labelled black points."""
import sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch, Circle

out = sys.argv[1]
plt.rcParams["mathtext.fontset"] = "cm"

# kidney-shaped domain
t = np.linspace(0, 2 * np.pi, 720, endpoint=False)
r = 1.0 + 0.2 * np.cos(2 * t + 0.5) + 0.12 * np.sin(3 * t + 0.3) - 0.06 * np.cos(5 * t)
P = np.stack([1.25 * r * np.cos(t), r * np.sin(t)], 1)

def dist(p):
    a, b = P, np.roll(P, -1, 0); ab = b - a
    u = np.clip(((p - a) * ab).sum(1) / (ab * ab).sum(1), 0, 1)
    return np.min(np.linalg.norm(p - (a + u[:, None] * ab), axis=1))

eps = 0.075
fig, ax = plt.subplots(figsize=(6, 6), dpi=200)
ax.set_aspect("equal"); ax.axis("off")
path = Path(np.vstack([P, P[:1]]), closed=True)
ax.add_patch(PathPatch(path, facecolor="#e4e4e4", edgecolor="none", zorder=0))
# epsilon-shell: band between the boundary and its inward offset by eps
T = np.roll(P, -1, 0) - np.roll(P, 1, 0); T /= np.linalg.norm(T, axis=1)[:, None]
N = np.stack([T[:, 1], -T[:, 0]], 1)            # outward normal for a CCW curve
inner = P - eps * N
ring = Path(np.vstack([P, P[:1], inner[::-1], inner[-1:]]),
            [Path.MOVETO] + [Path.LINETO] * len(P) + [Path.MOVETO] + [Path.LINETO] * len(P))
ax.add_patch(PathPatch(ring, facecolor="#b3b3b3", edgecolor="none", zorder=1))

# the walk: jump to a point on the largest empty ball until inside the shell
p = np.array([0.62, 0.02]); pts = [p]
angles = [3.0, 3.75, 2.75, 3.6, 3.1, 3.3]
for a in angles:
    R = dist(p)
    ax.add_patch(Circle(p, R, facecolor=(0.56, 0.58, 0.86, 0.30), edgecolor=(0.42, 0.44, 0.74, 0.9), lw=1.6, zorder=2))
    q = p + R * np.array([np.cos(a), np.sin(a)])
    ax.plot(*np.stack([p, q]).T, color="#5458a8", lw=2.0, zorder=3, solid_capstyle="round")
    p = q; pts.append(p)
    if dist(p) < eps: break
print(len(pts), [round(dist(q), 3) for q in pts])

for i, q in enumerate(pts):
    ax.plot(*q, "o", color="black", ms=6.5 if i else 8, zorder=4)
    # put each label on the side away from both of its walk segments
    d = np.zeros(2)
    if i > 0: d += (pts[i - 1] - q) / np.linalg.norm(pts[i - 1] - q)
    if i + 1 < len(pts): d += (pts[i + 1] - q) / np.linalg.norm(pts[i + 1] - q)
    d = -d / (np.linalg.norm(d) + 1e-9) if np.linalg.norm(d) > 1e-3 else np.array([0, -1.0])
    ax.text(*(q + 0.13 * d), rf"$x_{i}$", fontsize=22, ha="center", va="center", zorder=7)

ax.add_patch(PathPatch(path, facecolor="none", edgecolor="black", lw=4.5, zorder=6, joinstyle="round"))
ax.text(0.78, -0.5, r"$\Omega$", fontsize=28, zorder=5)
ax.text(1.42, 0.62, r"$\partial\Omega$", fontsize=24, zorder=5)
ax.set_xlim(P[:, 0].min() - 0.08, P[:, 0].max() + 0.35)
ax.set_ylim(P[:, 1].min() - 0.08, P[:, 1].max() + 0.08)
fig.savefig(out, transparent=True, bbox_inches="tight", pad_inches=0.05)
