// The 3D canvas: room, computer, monitor, phone and the camera.
import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Room } from "./Room";
import { Computer } from "./Computer";
import { Phone } from "./Phone";
import { Monitor } from "./Monitor";
import { CameraRig } from "./CameraRig";
import { CAMERA } from "./layout";
import { useGame } from "../store/gameStore";

/** Renders once everything inside <Suspense> has loaded. */
function MarkLoaded() {
  useEffect(() => useGame.getState().setLoaded(), []);
  return null;
}

export function DeskScene() {
  return (
    <Canvas
      className="stage"
      shadows="soft"
      dpr={[1, 2]}
      camera={{ fov: CAMERA.fov, near: 0.01, far: 30, position: CAMERA.intro.position.toArray() }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
    >
      <Suspense fallback={null}>
        <Room />
        <Computer />
        <Monitor />
        <Phone />
        <MarkLoaded />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
