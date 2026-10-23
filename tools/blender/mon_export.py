import bpy, sys
src, out, png = sys.argv[-3:]
bpy.ops.wm.open_mainfile(filepath=src)
o = bpy.data.objects["polySurface53"]
o.name = "Monitor"
# bake rotation + scale into the mesh so the GLB is in meters with no node transform
bpy.context.view_layer.objects.active = o
o.select_set(True)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
# replace the missing texture with a plain dark plastic
m = o.material_slots[0].material
nt = m.node_tree
for n in list(nt.nodes):
    if n.type == "TEX_IMAGE": nt.nodes.remove(n)
bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
bsdf.inputs["Base Color"].default_value = (0.018, 0.018, 0.02, 1)
bsdf.inputs["Roughness"].default_value = 0.45
m.name = "MonitorPlastic"
for x in [x for x in bpy.data.objects if x.type in ("CAMERA", "LIGHT")]:
    bpy.data.objects.remove(x)
bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_cameras=False, export_lights=False, use_visible=True)
# quick preview render: front view, with a white quad where we think the screen is
import mathutils
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.0378, 0.261), rotation=(1.5708, 0, 0))
p = bpy.context.object; p.scale = (0.598, 0.332, 1)
pm = bpy.data.materials.new("probe"); pm.use_nodes = True
pm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.9, 0.3, 0.1, 1)
p.data.materials.append(pm)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); bpy.context.scene.collection.objects.link(cam)
cam.location = (0.35, -0.9, 0.45); cam.rotation_euler = (1.42, 0, 0.37)
bpy.context.scene.camera = cam
l = bpy.data.objects.new("l", bpy.data.lights.new("l", "SUN")); bpy.context.scene.collection.objects.link(l)
l.rotation_euler = (0.8, 0.2, 0.6); l.data.energy = 4
w = bpy.context.scene.world or bpy.data.worlds.new("w"); bpy.context.scene.world = w
w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.5, 0.5, 0.55, 1)
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.samples = 16; sc.cycles.device = "CPU"
sc.render.resolution_x = 640; sc.render.resolution_y = 420; sc.render.filepath = png
bpy.ops.render.render(write_still=True)
