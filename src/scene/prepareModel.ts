import * as THREE from "three";

/** Shadows on, and a little environment reflection so plastics and glass read well. */
export function prepareModel(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.castShadow = true;
    m.receiveShadow = true;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    mats.forEach((mat) => {
      const std = mat as THREE.MeshStandardMaterial;
      if (std.isMeshStandardMaterial) std.envMapIntensity = 0.7;
    });
  });
  return root;
}
