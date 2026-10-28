# Homepage thumbnails for AdaFNIO and FlowMNO, rendered with Cycles on a
# transparent background (shadow catcher). Usage:
#   blender -b -P render.py -- adafnio|flowmno out.png
# then crop and resize into images/ and tn/images/. The Walk-on-Spheres
# thumbnail is drawn in 2D by wos.py instead.
import bpy, bmesh, math, sys, random
from mathutils import Vector

which = sys.argv[sys.argv.index('--')+1]
out = sys.argv[sys.argv.index('--')+2]

# ---------- setup ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
for t in ('OPTIX', 'CUDA'):
    try:
        prefs.compute_device_type = t; prefs.get_devices()
        if any(d.type == t for d in prefs.devices): break
    except Exception: pass
for d in prefs.devices: d.use = True
sc.cycles.device = 'GPU'
sc.cycles.samples = 384
sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_x = sc.render.resolution_y = 1200
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'

world = bpy.data.worlds.new('w'); sc.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (1, 1, 1, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = 0.55

def hexcol(h, a=1.0):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return (*c, a)

def mat(name, col, rough=0.55, alpha=1.0, transmission=0.0, emission=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexcol(col)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Alpha'].default_value = alpha
    b.inputs['Transmission Weight'].default_value = transmission
    if emission:
        b.inputs['Emission Color'].default_value = hexcol(col)
        b.inputs['Emission Strength'].default_value = emission
    return m

def put(obj, m):
    obj.data.materials.clear(); obj.data.materials.append(m)
    for p in getattr(obj.data, 'polygons', []): p.use_smooth = True
    return obj

def sphere(loc, r, m):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=64, ring_count=32)
    return put(bpy.context.object, m)

def cyl(loc, r, depth, m, verts=96, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, vertices=verts, rotation=rot)
    o = put(bpy.context.object, m)
    return o

def bevel(o, w=0.03, seg=6):
    md = o.modifiers.new('b', 'BEVEL'); md.width = w; md.segments = seg; md.limit_method = 'ANGLE'
    for p in o.data.polygons: p.use_smooth = True
    return o

def ground():
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
    g = bpy.context.object; g.is_shadow_catcher = True
    return g

def camera(loc, target, lens=50):
    bpy.ops.object.empty_add(location=target); tgt = bpy.context.object
    bpy.ops.object.camera_add(location=loc); cam = bpy.context.object
    cam.data.lens = lens
    c = cam.constraints.new('TRACK_TO'); c.target = tgt
    c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    sc.camera = cam

def light(loc, size=6, power=900, target=(0, 0, 0)):
    bpy.ops.object.light_add(type='AREA', location=loc)
    l = bpy.context.object; l.data.size = size; l.data.energy = power
    d = Vector(target) - Vector(loc); l.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

def tube(points, r, m, res=24):
    cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = r; cu.bevel_resolution = 8; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
    for p, q in zip(sp.points, points): p.co = (*q, 1)
    o = bpy.data.objects.new('tube', cu); sc.collection.objects.link(o)
    cu.materials.append(m); return o

ground()

# ---------- scenes ----------
if which == 'adafnio':
    card = mat('card', '#fbfbfa', rough=0.5)
    inset = mat('inset', '#d3d9e4', rough=0.55)
    inset_mid = mat('inset_mid', '#a9d9d1', rough=0.5)
    ink = mat('ink', '#1f2440', rough=0.4)
    acc = mat('acc', '#1f8f86', rough=0.35)
    wavem = mat('wave', '#2f9c92', rough=0.4)
    W, Hh, T = 1.25, 0.95, 0.06
    # cards stand upright, facing -x, staggered back and to the right
    cards = [(0.0, -0.95), (0.75, 0.0), (1.5, 0.95)]
    ball = [(-0.32, 0.38), (0.0, 0.52), (0.32, 0.4)]   # (y, z) inside the card: the ball's path over time
    order = [0, 1, 2]                                   # middle card is the synthesized frame
    for i, (x, y) in enumerate(cards):
        k = order[i]
        bpy.ops.mesh.primitive_cube_add(location=(x, y, Hh / 2 + 0.02))
        o = bpy.context.object; o.scale = (T / 2, W / 2, Hh / 2); bpy.ops.object.transform_apply(scale=True)
        put(o, card); bevel(o, 0.03)
        bpy.ops.mesh.primitive_cube_add(location=(x - T / 2 - 0.004, y, Hh / 2 + 0.02))
        ins = bpy.context.object; ins.scale = (0.006, W / 2 - 0.08, Hh / 2 - 0.08); bpy.ops.object.transform_apply(scale=True)
        put(ins, inset_mid if k == 1 else inset); bevel(ins, 0.005, 2)
        by, bz = ball[k]
        r = 0.1
        sphere((x - T / 2 - r * 0.8, y + by, bz), r, acc if k == 1 else ink)
        if k == 1:
            # spectral hint: a low-frequency wave across the synthesized frame
            pts = [(x - T / 2 - 0.02, y - W / 2 + 0.14 + (W - 0.28) * j / 99,
                    0.24 + 0.06 * math.sin(2 * math.pi * 2 * j / 99)) for j in range(100)]
            tube(pts, 0.012, wavem)
    camera((-6.4, -1.2, 4.6), (0.75, 0.0, 0.35), lens=50)
    light((-4, -3, 6), size=5, power=700)

elif which == 'flowmno':
    lav = mat('lav', '#cfc8e8', rough=0.6)
    lav2 = mat('lav2', '#a69bd0', rough=0.6)
    deep = mat('deep', '#5a4e8c', rough=0.5)
    white = mat('white', '#f2f2f4', rough=0.45)
    ink = mat('ink', '#1f2440', rough=0.4)
    def person(x, y, m, s=1.0):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(x, y, 0.52 * s), segments=64, ring_count=32)
        b = bpy.context.object; b.scale = (0.17 * s, 0.15 * s, 0.46 * s); put(b, m)
        sphere((x, y, 1.08 * s), 0.12 * s, m)
    def trail(p0, v, m, n=5, step=0.3, r0=0.08):
        v = Vector(v).normalized()
        for k in range(1, n + 1):
            q = Vector(p0) + v * (0.12 + k * step)
            cyl((q.x, q.y, 0.006), r0 * (1 - 0.13 * k), 0.012, m)
    peds = [((-0.1, 0.75), (0.1, -1.0), deep), ((1.25, 0.25), (-1.0, -0.35), lav2), ((-1.2, 1.55), (0.75, -0.6), lav)]
    for p, v, m in peds:
        person(p[0], p[1], m); trail(p, v, m)
    rx, ry = -0.7, -1.3
    cyl((rx, ry, 0.13), 0.34, 0.2, white)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.3, location=(rx, ry, 0.23), segments=64, ring_count=32)
    d = bpy.context.object; d.scale = (1, 1, 0.55); put(d, white)
    cyl((rx, ry, 0.42), 0.09, 0.08, ink)
    cyl((rx, ry, 0.1), 0.345, 0.04, deep)
    # planned path: one continuous line, swinging right of the oncoming pedestrian
    pts = []
    for k in range(0, 121):
        t = 0.12 + 0.88 * k / 120
        pts.append((rx + 1.5 * t + 0.4 * math.sin(math.pi * t), ry + 2.5 * t, 0.012))
    tube(pts, 0.022, ink)
    end = Vector(pts[-1]); dirv = (end - Vector(pts[-4])).normalized()
    bpy.ops.mesh.primitive_cone_add(radius1=0.075, depth=0.16, location=end + dirv * 0.06, vertices=64)
    cone = bpy.context.object; cone.rotation_euler = dirv.to_track_quat('Z', 'Y').to_euler(); put(cone, ink)
    camera((-3.6, -5.4, 3.6), (0.05, 0.2, 0.45), lens=50)
    light((-3, -4, 7), size=6, power=900)

sc.render.filepath = out
bpy.ops.render.render(write_still=True)
