// Tower, keyboard and mouse from Desktop_Computer.blend.
// Its original monitor is hidden; the monitor comes from Monitor.blend (see Monitor.tsx).
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import desktopUrl from "../assets/models/desktop.glb?url";
import { COMPUTER } from "./layout";
import { prepareModel } from "./prepareModel";

// Parts of the Blender file we don't use.
const HIDE = ["Monitor", "Monitor_Power_Cord", "Monitor_Plug", "Desktop_Power_Cord", "Desktop_Plug"];

export function Computer() {
  const gltf = useGLTF(desktopUrl, false, true); // (url, draco, meshopt)

  const scene = useMemo(() => {
    const root = prepareModel(gltf.scene.clone(true));
    HIDE.forEach((n) => {
      const o = root.getObjectByName(n);
      if (o) o.visible = false;
    });
    return root;
  }, [gltf.scene]);

  // Move the tower under the desk (in the Blender file it stands beside it).
  const groupRef = (g: THREE.Group | null) => {
    if (!g || g.userData.towerMoved) return;
    g.userData.towerMoved = true;
    g.updateMatrixWorld(true);
    const tower = scene.getObjectByName("Desktop_tower");
    if (!tower) return;
    const box = new THREE.Box3().setFromObject(tower);
    const center = box.getCenter(new THREE.Vector3());
    const t = COMPUTER.towerTarget;
    const world = tower.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(t.x - center.x, t.y - box.min.y, t.z - center.z));
    tower.position.copy(tower.parent!.worldToLocal(world));
  };

  return (
    <group ref={groupRef} position={COMPUTER.position} rotation={[0, COMPUTER.rotationY, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(desktopUrl, false, true);
