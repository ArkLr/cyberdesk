// The monitor from Monitor.blend, plus a live screen texture.
import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import monitorUrl from "../assets/models/monitor.glb?url";
import { MONITOR } from "./layout";
import { PcScreenTexture } from "./screenTextures";
import { useGame } from "../store/gameStore";
import { prepareModel } from "./prepareModel";

export function Monitor() {
  const gltf = useGLTF(monitorUrl, false, true);
  const lang = useGame((s) => s.lang);
  const tex = useMemo(() => new PcScreenTexture(), []);

  const scene = useMemo(() => {
    const root = prepareModel(gltf.scene.clone(true));
    // the model's texture wasn't packed in the .blend: satin black plastic with a light clear coat
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#141518",
      roughness: 0.38,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.9,
    });
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.material = mat;
    });
    return root;
  }, [gltf.scene]);

  useEffect(() => {
    const redraw = () => tex.draw(lang);
    redraw();
    document.fonts?.ready.then(redraw);
    const id = window.setInterval(redraw, 15_000);
    return () => window.clearInterval(id);
  }, [lang, tex]);

  const s = MONITOR.screen;
  return (
    <group position={MONITOR.position}>
      <primitive object={scene} />
      {/* live screen, just in front of the display surface */}
      <mesh position={[s.center.x, s.center.y, s.center.z + 0.0004]}>
        <planeGeometry args={[s.width, s.height]} />
        <meshBasicMaterial map={tex.texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload(monitorUrl, false, true);
