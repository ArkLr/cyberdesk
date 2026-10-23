"""Convert the user's .blend files to web-ready GLB.
Usage: python3 blend_export.py -- <in.blend> <out.glb> <desktop|phone> <report.json>
"""
import bpy, sys, json, bmesh
from mathutils import Vector

src, out, kind, report_path = sys.argv[-4:]
bpy.ops.wm.open_mainfile(filepath=src)
scene = bpy.context.scene
report = {"kind": kind}

def delete(objs):
    for o in objs:
        bpy.data.objects.remove(o, do_unlink=True)

# --- cleanup common to both ---------------------------------------------
delete([o for o in scene.objects if o.type in ("CAMERA", "LIGHT")])
delete([o for o in scene.objects if o.hide_get() or o.hide_render])

def strip_texture(mat_name, color):
    m = bpy.data.materials.get(mat_name)
    if not m: return
    nt = m.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    for n in list(nt.nodes):
        if n.type == "TEX_IMAGE":
            nt.nodes.remove(n)
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1)

if kind == "desktop":
    # brand marks / reference photos -> plain materials
    strip_texture("Windows Button Monitor", (0.02, 0.02, 0.022))
    strip_texture("Black Coated Metal.009", (0.025, 0.025, 0.028))  # tower front photo
    strip_texture("Black Coated Metal.008", (0.025, 0.025, 0.028))
    strip_texture("Black Coated Metal.005", (0.025, 0.025, 0.028))
    # cords: curves -> meshes so glTF keeps them
    for o in [o for o in scene.objects if o.type == "CURVE"]:
        if o.data.bevel_depth == 0 and o.data.bevel_object is None:
            o.data.bevel_depth = 0.003
        bpy.context.view_layer.objects.active = o
        for s in scene.objects: s.select_set(False)
        o.select_set(True)
        bpy.ops.object.convert(target="MESH")
    screen_mat = "Screen"
    screen_obj = "Monitor"
else:
    delete([o for o in scene.objects if o.type == "CURVE"])        # charging cord
    delete([o for o in scene.objects if o.name.startswith("Circle.005")])  # logo
    strip_texture("display 2", (0.0, 0.0, 0.0))
    # scale to a real phone: 162.5 mm tall
    body = scene.objects["body"]
    root = body.parent
    root.rotation_euler = (0, 0, 0)
    bpy.context.view_layer.update()
    bb = [body.matrix_world @ Vector(c) for c in body.bound_box]
    h = max(v.z for v in bb) - min(v.z for v in bb)
    s = 0.1625 / h
    root.scale = (root.scale.x * s, root.scale.y * s, root.scale.z * s)
    bpy.context.view_layer.update()
    bb = [body.matrix_world @ Vector(c) for c in body.bound_box]
    cx = sum(v.x for v in bb) / 8; cy = sum(v.y for v in bb) / 8; cz = sum(v.z for v in bb) / 8
    root.location = (root.location.x - cx, root.location.y - cy, root.location.z - cz)
    bpy.context.view_layer.update()
    screen_mat = "display 2"
    screen_obj = "body"

# --- downscale every image to <= 1024 px ---------------------------------
for img in bpy.data.images:
    if img.size[0] == 0: continue
    mx = max(img.size)
    if mx > 1024:
        f = 1024 / mx
        img.scale(max(1, int(img.size[0] * f)), max(1, int(img.size[1] * f)))
        if img.packed_file:
            img.pack()

# --- find screen rectangle (world space, Blender Z-up) --------------------
o = scene.objects[screen_obj]
mi = [i for i, s in enumerate(o.material_slots) if s.material and s.material.name == screen_mat]
pts, normal_sum = [], Vector()
mw = o.matrix_world
for p in o.data.polygons:
    if p.material_index in mi:
        for vi in p.vertices:
            pts.append(mw @ o.data.vertices[vi].co)
        normal_sum += (mw.to_3x3() @ p.normal) * p.area
if pts:
    mn = Vector((min(v.x for v in pts), min(v.y for v in pts), min(v.z for v in pts)))
    mxv = Vector((max(v.x for v in pts), max(v.y for v in pts), max(v.z for v in pts)))
    n = normal_sum.normalized()
    # convert to glTF Y-up: (x, y, z) -> (x, z, -y)
    to_gl = lambda v: [round(v.x, 4), round(v.z, 4), round(-v.y, 4)]
    report["screen"] = {"min": to_gl(mn), "max": to_gl(mxv), "normal": to_gl(n),
                        "faces": sum(1 for p in o.data.polygons if p.material_index in mi)}

# overall bounds
allpts = []
for ob in scene.objects:
    if ob.type == "MESH":
        allpts += [ob.matrix_world @ Vector(c) for c in ob.bound_box]
mn = Vector((min(v.x for v in allpts), min(v.y for v in allpts), min(v.z for v in allpts)))
mxv = Vector((max(v.x for v in allpts), max(v.y for v in allpts), max(v.z for v in allpts)))
report["bounds"] = {"min": [round(mn.x,4), round(mn.z,4), round(-mxv.y,4)],
                    "max": [round(mxv.x,4), round(mxv.z,4), round(-mn.y,4)]}
report["objects"] = {ob.name: [round(c, 4) for c in ((ob.matrix_world.translation.x, ob.matrix_world.translation.z, -ob.matrix_world.translation.y))]
                     for ob in scene.objects if ob.type == "MESH"}

bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True,
                          export_cameras=False, export_lights=False,
                          export_image_format="AUTO", export_jpeg_quality=82,
                          export_extras=False, use_visible=True)
json.dump(report, open(report_path, "w"), indent=1)
print("REPORT", json.dumps(report))
