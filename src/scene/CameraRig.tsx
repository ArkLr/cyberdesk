// Moves the camera between the two close-up views and reports where the
// device screen lands on the page, so the HTML screen UI can sit on top of it.
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA, MONITOR, PHONE, WORLD_SCREEN_CENTER } from "./layout";
import { useGame, type View, type ScreenRect } from "../store/gameStore";

const DURATION = 1.1; // seconds per move
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Pose { pos: THREE.Vector3; quat: THREE.Quaternion }

function lookAt(pos: THREE.Vector3, target: THREE.Vector3, up = new THREE.Vector3(0, 1, 0)): Pose {
  const m = new THREE.Matrix4().lookAt(pos, target, up);
  return { pos, quat: new THREE.Quaternion().setFromRotationMatrix(m) };
}

/** Distance at which a w x h rectangle fills `fill` of the view. */
function fitDistance(w: number, h: number, aspect: number, fill: number) {
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(CAMERA.fov) / 2);
  return Math.max(h / fill / 2 / tanHalf, w / fill / 2 / (tanHalf * aspect));
}

/** Phone screen center, its "up" (towards the top of the phone) and its normal, in world space. */
function phoneFrame() {
  const q = new THREE.Quaternion().setFromEuler(PHONE.rotation);
  const center = new THREE.Vector3(0, 0, PHONE.screen.z).applyQuaternion(q).add(PHONE.position);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
  return { center, up, right, normal };
}

function poseFor(view: View, aspect: number): Pose {
  if (view === "pc") {
    const { width, height } = MONITOR.screen;
    const d = fitDistance(width, height, aspect, CAMERA.pcFill);
    return lookAt(WORLD_SCREEN_CENTER.clone().add(new THREE.Vector3(0, 0, d)), WORLD_SCREEN_CENTER);
  }
  const f = phoneFrame();
  const d = fitDistance(PHONE.screen.width, PHONE.screen.height, aspect, CAMERA.phoneFill);
  // straight above the phone, rotated so the phone reads upright
  return lookAt(f.center.clone().addScaledVector(f.normal, d), f.center, f.up);
}

/** The screen's corners in world space. */
function screenCorners(view: View): THREE.Vector3[] {
  if (view === "pc") {
    const c = WORLD_SCREEN_CENTER, w = MONITOR.screen.width / 2, h = MONITOR.screen.height / 2;
    return [new THREE.Vector3(c.x - w, c.y - h, c.z), new THREE.Vector3(c.x + w, c.y + h, c.z)];
  }
  const f = phoneFrame(), w = PHONE.screen.width / 2, h = PHONE.screen.height / 2;
  return [
    f.center.clone().addScaledVector(f.right, -w).addScaledVector(f.up, -h),
    f.center.clone().addScaledVector(f.right, w).addScaledVector(f.up, h),
  ];
}

export function CameraRig() {
  const { camera, size } = useThree();
  const view = useGame((s) => s.view);
  const anim = useRef({ t: 0, from: lookAt(CAMERA.intro.position.clone(), CAMERA.intro.target) });

  const measure = (v: View): ScreenRect => {
    camera.updateMatrixWorld();
    const xs: number[] = [], ys: number[] = [];
    screenCorners(v).forEach((c) => {
      const p = c.clone().project(camera);
      xs.push((p.x * 0.5 + 0.5) * size.width);
      ys.push((-p.y * 0.5 + 0.5) * size.height);
    });
    const x = Math.min(...xs), y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  };

  // Opening shot: start back from the desk.
  useEffect(() => {
    camera.position.copy(anim.current.from.pos);
    camera.quaternion.copy(anim.current.from.quat);
  }, [camera]);

  // A new view was chosen: start moving from wherever the camera is now.
  useEffect(() => {
    if (anim.current.t >= 1) {
      anim.current.from = { pos: camera.position.clone(), quat: camera.quaternion.clone() };
      anim.current.t = 0;
    }
  }, [view, camera]);

  // Window resized: snap to the new framing and re-measure.
  useEffect(() => {
    if (useGame.getState().moving) return;
    const p = poseFor(view, size.width / size.height);
    camera.position.copy(p.pos);
    camera.quaternion.copy(p.quat);
    useGame.getState().setScreenRect(measure(view));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);

  // Arrow keys switch views. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") useGame.getState().goTo("phone");
      if (e.key === "ArrowRight") useGame.getState().goTo("pc");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFrame((_, dt) => {
    const a = anim.current;
    if (a.t >= 1 || !useGame.getState().loaded) return; // wait for the models before the opening glide
    a.t = Math.min(1, a.t + dt / DURATION);
    const e = ease(a.t);
    const to = poseFor(view, size.width / size.height);
    camera.position.lerpVectors(a.from.pos, to.pos, e);
    // pull back and up a little mid-move, like leaning between the screen and the phone
    camera.position.y += Math.sin(e * Math.PI) * 0.12;
    camera.position.z += Math.sin(e * Math.PI) * 0.1;
    camera.quaternion.slerpQuaternions(a.from.quat, to.quat, e);
    if (a.t === 1) useGame.getState().arrived(measure(view));
  });

  return null;
}
