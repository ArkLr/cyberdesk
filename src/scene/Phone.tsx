// The phone from note_8.blend, lying on the desk, plus a live screen texture.
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import phoneUrl from "../assets/models/phone.glb?url";
import { PHONE } from "./layout";
import { PhoneScreenTexture } from "./screenTextures";
import { useGame } from "../store/gameStore";
import { prepareModel } from "./prepareModel";

// The original materials are pure-black mirrors; give the back glass and the metal frame real values.
const BODY: Record<string, THREE.MeshPhysicalMaterialParameters> = {
  "note 8 skin": { color: "#10141c", roughness: 0.18, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05 },
  "note 8 shell": { color: "#2a2f38", roughness: 0.3, metalness: 0.85 },
};

export function Phone() {
  const gltf = useGLTF(phoneUrl, false, true);
  const scene = useMemo(() => {
    const root = prepareModel(gltf.scene.clone(true));
    const mats: Record<string, THREE.Material> = {};
    for (const [name, params] of Object.entries(BODY))
      mats[name] = new THREE.MeshPhysicalMaterial({ ...params, envMapIntensity: 1 });
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (Array.isArray(m.material)) m.material = m.material.map((x) => mats[x.name] ?? x);
      else m.material = mats[m.material.name] ?? m.material;
    });
    return root;
  }, [gltf.scene]);
  const lang = useGame((s) => s.lang);
  const tex = useMemo(() => new PhoneScreenTexture(), []);

  useEffect(() => {
    const redraw = () => tex.draw(lang);
    redraw();
    document.fonts?.ready.then(redraw);
    const id = window.setInterval(redraw, 15_000);
    return () => window.clearInterval(id);
  }, [lang, tex]);

  return (
    <group position={PHONE.position} rotation={PHONE.rotation}>
      <primitive object={scene} />
      <mesh position={[0, 0, PHONE.screen.z]}>
        <planeGeometry args={[PHONE.screen.width, PHONE.screen.height]} />
        <meshBasicMaterial map={tex.texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload(phoneUrl, false, true);
