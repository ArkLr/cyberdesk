import bpy, sys
from collections import defaultdict
bpy.ops.wm.open_mainfile(filepath=sys.argv[-1])
o = bpy.data.objects["polySurface53"]
mw = o.matrix_world
print("loc", tuple(o.location), "rot", tuple(o.rotation_euler), "scale", tuple(o.scale))
print("uv layers", [u.name for u in o.data.uv_layers])
buckets = defaultdict(lambda: [0.0, [], []])
for p in o.data.polygons:
    n = (mw.to_3x3() @ p.normal).normalized()
    if abs(n.y) < 0.97: continue
    c = mw @ p.center
    key = (round(n.y), round(c.y, 3))
    b = buckets[key]; b[0] += p.area
    for vi in p.vertices:
        v = mw @ o.data.vertices[vi].co; b[1].append(v.x); b[2].append(v.z)
for k, (a, xs, zs) in sorted(buckets.items(), key=lambda kv: -kv[1][0])[:12]:
    print(k, "area", round(a, 4), "x", round(min(xs),3), round(max(xs),3), "z", round(min(zs),3), round(max(zs),3))
