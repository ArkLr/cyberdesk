import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { DESK, DESK_TOP } from "./layout";
import {
	artTexture,
	floorTexture,
	noteTexture,
	skyTexture,
} from "./proceduralTextures";
import woodDiff from "../assets/textures/wood_diff.jpg?url";
import woodNor from "../assets/textures/wood_nor.jpg?url";
import woodRough from "../assets/textures/wood_rough.jpg?url";
import wallDiff from "../assets/textures/wall_diff.jpg?url";
import wallNor from "../assets/textures/wall_nor.jpg?url";
import wallRough from "../assets/textures/wall_rough.jpg?url";
import { useGame } from "../store/gameStore";

const ROOM = { left: -1.7, right: 1.9, back: -1.15, front: 2.2, height: 2.7 };
const STEEL = "#26292c";
// how many meters one copy of each texture covers
const WOOD_TILE = 4;
const WALL_TILE = 2;

/** Color + normal + roughness maps (from wood_table_worn / plastered_wall_03), set to tile. */
function usePbrTextures(diff: string, nor: string, rough: string) {
	return useTexture({ map: diff, normalMap: nor, roughnessMap: rough }, (t) => {
		const all = Array.isArray(t) ? t : [t];
		all.forEach((x) => {
			x.wrapS = x.wrapT = THREE.RepeatWrapping;
			x.anisotropy = 8;
		});
		all[0].colorSpace = THREE.SRGBColorSpace;
	});
}

/** A wall plane whose UVs are in meters from the wall's origin, so neighbouring pieces line up. */
function WallPlane({
	w,
	h,
	position,
	material,
	...props
}: {
	w: number;
	h: number;
	/** center of this piece on its wall (wall-local x, y, z) */
	position: [number, number, number];
	material: THREE.Material;
} & Omit<JSX.IntrinsicElements["mesh"], "position">) {
	const offset = [position[0], position[1]];
	const geo = useMemo(() => {
		const g = new THREE.PlaneGeometry(w, h);
		const p = g.attributes.position;
		const uv = g.attributes.uv;
		for (let i = 0; i < uv.count; i++)
			uv.setXY(
				i,
				(p.getX(i) + offset[0]) / WALL_TILE,
				(p.getY(i) + offset[1]) / WALL_TILE,
			);
		return g;
	}, [w, h, offset[0], offset[1]]);
	return (
		<mesh
			geometry={geo}
			material={material}
			position={position}
			receiveShadow
			{...props}
		/>
	);
}

function Desk() {
	const tex = usePbrTextures(woodDiff, woodNor, woodRough);
	const mat = useMemo(() => {
		// box UVs run 0..1 across each face, so repeat by the desk's size in meters
		Object.values(tex).forEach((t) =>
			t.repeat.set(DESK.width / WOOD_TILE, DESK.depth / WOOD_TILE),
		);
		// the scan is a dark walnut; lift it so the desk still reads in the night lighting
		return new THREE.MeshStandardMaterial({
			...tex,
			color: new THREE.Color(2.2, 2.0, 1.8),
			metalness: 0,
			normalScale: new THREE.Vector2(0.8, 0.8),
		});
	}, [tex]);
	const legH = DESK_TOP - DESK.thickness;
	const x = DESK.width / 2 - 0.05;
	const zf = DESK.centerZ + DESK.depth / 2 - 0.06;
	const zb = DESK.centerZ - DESK.depth / 2 + 0.06;
	return (
		<group>
			<mesh
				position={[0, DESK_TOP - DESK.thickness / 2, DESK.centerZ]}
				castShadow
				receiveShadow
				material={mat}
			>
				<boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
			</mesh>
			{/* steel frame: two side frames joined by a back rail */}
			{[-x, x].map((lx) => (
				<group key={lx}>
					{[zf, zb].map((lz) => (
						<mesh key={lz} position={[lx, legH / 2, lz]} castShadow>
							<boxGeometry args={[0.04, legH, 0.04]} />
							<meshStandardMaterial
								color={STEEL}
								roughness={0.4}
								metalness={0.6}
							/>
						</mesh>
					))}
					<mesh position={[lx, legH - 0.03, DESK.centerZ]} castShadow>
						<boxGeometry args={[0.04, 0.04, DESK.depth - 0.1]} />
						<meshStandardMaterial
							color={STEEL}
							roughness={0.4}
							metalness={0.6}
						/>
					</mesh>
					<mesh position={[lx, 0.015, DESK.centerZ]} castShadow>
						<boxGeometry args={[0.06, 0.03, DESK.depth - 0.06]} />
						<meshStandardMaterial
							color={STEEL}
							roughness={0.4}
							metalness={0.6}
						/>
					</mesh>
				</group>
			))}
			<mesh position={[0, legH - 0.05, zb]} castShadow>
				<boxGeometry args={[DESK.width - 0.1, 0.08, 0.02]} />
				<meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.6} />
			</mesh>
		</group>
	);
}

function Walls() {
	const floor = useMemo(floorTexture, []);
	const sky = useMemo(skyTexture, []);
	const W = ROOM.right - ROOM.left,
		D = ROOM.front - ROOM.back;
	const cx = (ROOM.left + ROOM.right) / 2,
		cz = (ROOM.back + ROOM.front) / 2;
	// window in the left wall
	const win = { z: -0.35, y: 1.55, w: 1.25, h: 1.15 };
	const wallTex = usePbrTextures(wallDiff, wallNor, wallRough);
	// the plaster scan is mid-grey; lift it toward the room's original light wall color
	const wallMat = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				...wallTex,
				color: new THREE.Color(2.1, 2.0, 1.95),
			}),
		[wallTex],
	);
	return (
		<group>
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[cx, 0, cz]}
				receiveShadow
			>
				<planeGeometry args={[W, D]} />
				<meshStandardMaterial map={floor} roughness={0.7} />
			</mesh>
			<mesh rotation={[Math.PI / 2, 0, 0]} position={[cx, ROOM.height, cz]}>
				<planeGeometry args={[W, D]} />
				<meshStandardMaterial color="#ece8e0" roughness={1} />
			</mesh>
			{/* back wall */}
			<WallPlane
				w={W}
				h={ROOM.height}
				position={[cx, ROOM.height / 2, ROOM.back]}
				material={wallMat}
			/>
			{/* skirting */}
			<mesh position={[cx, 0.05, ROOM.back + 0.006]}>
				<boxGeometry args={[W, 0.1, 0.012]} />
				<meshStandardMaterial color="#f1eee8" roughness={0.6} />
			</mesh>
			{/* right wall */}
			<WallPlane
				w={D}
				h={ROOM.height}
				position={[ROOM.right, ROOM.height / 2, cz]}
				rotation={[0, -Math.PI / 2, 0]}
				material={wallMat}
			/>
			{/* left wall, built around the window opening */}
			<group position={[ROOM.left, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
				{/* below / above window */}
				<WallPlane
					w={D}
					h={win.y - win.h / 2}
					position={[-cz, (win.y - win.h / 2) / 2, 0]}
					material={wallMat}
					castShadow
				/>
				<WallPlane
					w={D}
					h={ROOM.height - win.y - win.h / 2}
					position={[-cz, (ROOM.height + win.y + win.h / 2) / 2, 0]}
					material={wallMat}
					castShadow
				/>
				{/* left and right of window (wall-local x = -world z) */}
				{(() => {
					const a = -ROOM.front,
						b = -ROOM.back; // wall-local x range
					const wl = -win.z - win.w / 2,
						wr = -win.z + win.w / 2;
					return (
						<>
							<WallPlane
								w={wl - a}
								h={win.h}
								position={[(a + wl) / 2, win.y, 0]}
								material={wallMat}
								castShadow
							/>
							<WallPlane
								w={b - wr}
								h={win.h}
								position={[(wr + b) / 2, win.y, 0]}
								material={wallMat}
								castShadow
							/>
						</>
					);
				})()}
				{/* sky beyond the glass */}
				<mesh position={[-win.z, win.y, -0.6]}>
					<planeGeometry args={[win.w * 2.2, win.h * 2.2]} />
					<meshBasicMaterial map={sky} toneMapped={false} />
				</mesh>
				{/* frame + mullion */}
				{[
					[0, win.h / 2, win.w + 0.06, 0.05],
					[0, -win.h / 2, win.w + 0.06, 0.05],
					[-win.w / 2, 0, 0.05, win.h],
					[win.w / 2, 0, 0.05, win.h],
					[0, 0, 0.03, win.h],
				].map(([x, y, w, h], i) => (
					<mesh key={i} position={[-win.z + x, win.y + y, 0.02]} castShadow>
						<boxGeometry args={[w, h, 0.08]} />
						<meshStandardMaterial color="#f4f2ee" roughness={0.5} />
					</mesh>
				))}
				{/* sill */}
				<mesh
					position={[-win.z, win.y - win.h / 2 - 0.02, 0.09]}
					castShadow
					receiveShadow
				>
					<boxGeometry args={[win.w + 0.16, 0.03, 0.2]} />
					<meshStandardMaterial color="#f4f2ee" roughness={0.5} />
				</mesh>
			</group>
		</group>
	);
}

/** Thin cylinder between two points. */
function Rod({
	from,
	to,
	r = 0.009,
	color = "#1f2326",
}: {
	from: [number, number, number];
	to: [number, number, number];
	r?: number;
	color?: string;
}) {
	const a = new THREE.Vector3(...from),
		b = new THREE.Vector3(...to);
	const mid = a.clone().add(b).multiplyScalar(0.5);
	const dir = b.clone().sub(a);
	const q = new THREE.Quaternion().setFromUnitVectors(
		new THREE.Vector3(0, 1, 0),
		dir.clone().normalize(),
	);
	return (
		<mesh position={mid} quaternion={q} castShadow>
			<cylinderGeometry args={[r, r, dir.length(), 12]} />
			<meshStandardMaterial color={color} roughness={0.35} metalness={0.5} />
		</mesh>
	);
}

function Lamp() {
	// articulated desk lamp at the back right, head aimed at the desk
	const j0: [number, number, number] = [0, 0.024, 0];
	const j1: [number, number, number] = [0, 0.36, -0.07];
	const j2: [number, number, number] = [0, 0.48, 0.17];
	return (
		<group position={[0.66, DESK_TOP, -0.86]} rotation={[0, -0.5, 0]}>
			<mesh position={[0, 0.012, 0]} castShadow>
				<cylinderGeometry args={[0.075, 0.085, 0.024, 32]} />
				<meshStandardMaterial
					color="#1f2326"
					roughness={0.35}
					metalness={0.5}
				/>
			</mesh>
			<Rod from={j0} to={j1} />
			<Rod from={j1} to={j2} />
			{[j1, j2].map((j, i) => (
				<mesh key={i} position={j} castShadow>
					<sphereGeometry args={[0.016, 16, 16]} />
					<meshStandardMaterial
						color="#1f2326"
						roughness={0.35}
						metalness={0.5}
					/>
				</mesh>
			))}
			{/* head: apex up and back, opening facing down and forward */}
			<group position={[0, 0.43, 0.22]} rotation={[0.62, 0, 0]}>
				<mesh castShadow>
					<coneGeometry args={[0.072, 0.12, 32, 1, true]} />
					<meshStandardMaterial
						color="#c8512f"
						roughness={0.5}
						side={THREE.DoubleSide}
					/>
				</mesh>
				<mesh position={[0, -0.035, 0]}>
					<sphereGeometry args={[0.024, 16, 16]} />
					<meshBasicMaterial color="#fff1d6" toneMapped={false} />
				</mesh>
				<pointLight
					position={[0, -0.08, 0]}
					intensity={0.35}
					distance={1.0}
					decay={2}
					color="#ac9981"
					castShadow
					shadow-mapSize={[512, 512]}
					shadow-bias={-0.002}
				/>
			</group>
		</group>
	);
}

function Mug() {
	return (
		<group position={[-0.68, DESK_TOP, -0.5]}>
			<mesh position={[0, 0.048, 0]} castShadow receiveShadow>
				<cylinderGeometry args={[0.04, 0.037, 0.096, 32, 1, true]} />
				<meshStandardMaterial
					color="#e9e4da"
					roughness={0.3}
					side={THREE.DoubleSide}
				/>
			</mesh>
			<mesh position={[0, 0.002, 0]}>
				<cylinderGeometry args={[0.037, 0.037, 0.004, 32]} />
				<meshStandardMaterial color="#e9e4da" roughness={0.3} />
			</mesh>
			<mesh position={[0, 0.08, 0]}>
				<cylinderGeometry args={[0.038, 0.038, 0.002, 32]} />
				<meshStandardMaterial color="#3a2416" roughness={0.15} />
			</mesh>
			<mesh
				position={[0.04, 0.05, 0]}
				rotation={[0, 0, -Math.PI / 2]}
				castShadow
			>
				<torusGeometry args={[0.024, 0.006, 12, 24, Math.PI]} />
				<meshStandardMaterial color="#e9e4da" roughness={0.3} />
			</mesh>
		</group>
	);
}

function Notebook() {
	return (
		<group position={[-0.6, DESK_TOP, -0.78]} rotation={[0, 0.35, 0]}>
			<mesh position={[0, 0.006, 0]} castShadow receiveShadow>
				<boxGeometry args={[0.16, 0.012, 0.22]} />
				<meshStandardMaterial color="#2f4a5c" roughness={0.8} />
			</mesh>
			<mesh position={[0.02, 0.016, 0.02]} rotation={[0, 0.5, 0]} castShadow>
				<cylinderGeometry args={[0.004, 0.004, 0.14, 8]} />
				<meshStandardMaterial color="#d8a63c" roughness={0.4} metalness={0.3} />
			</mesh>
		</group>
	);
}

function Shelf() {
	const books = useMemo(() => {
		const colors = [
			"#3b5a6f",
			"#b5643c",
			"#d9c9a3",
			"#4b6b4f",
			"#8c3f3f",
			"#2f3a45",
			"#c9a24b",
		];
		let x = -0.42;
		return colors.map((c, i) => {
			const w = 0.03 + (i % 3) * 0.012,
				h = 0.2 + ((i * 7) % 5) * 0.018;
			const b = { x: x + w / 2, w, h, c };
			x += w + 0.004;
			return b;
		});
	}, []);
	return (
		<group position={[0.15, 1.72, ROOM.back + 0.12]}>
			<mesh castShadow receiveShadow>
				<boxGeometry args={[1.0, 0.025, 0.22]} />
				<meshStandardMaterial color="#6b4a33" roughness={0.6} />
			</mesh>
			{books.map((b, i) => (
				<mesh key={i} position={[b.x, b.h / 2 + 0.0125, 0]} castShadow>
					<boxGeometry args={[b.w, b.h, 0.16]} />
					<meshStandardMaterial color={b.c} roughness={0.8} />
				</mesh>
			))}
			<mesh position={[0.3, 0.07, 0]} castShadow>
				<boxGeometry args={[0.14, 0.12, 0.12]} />
				<meshStandardMaterial color="#e8e2d6" roughness={0.5} />
			</mesh>
		</group>
	);
}

function WallArt() {
	const tex = useMemo(artTexture, []);
	return (
		<group position={[-0.95, 1.5, ROOM.back + 0.015]}>
			<mesh castShadow>
				<boxGeometry args={[0.38, 0.5, 0.025]} />
				<meshStandardMaterial color="#2a2522" roughness={0.6} />
			</mesh>
			<mesh position={[0, 0, 0.0135]}>
				<planeGeometry args={[0.33, 0.45]} />
				<meshStandardMaterial map={tex} roughness={0.85} />
			</mesh>
		</group>
	);
}

/** Wall clock showing the player's real local time. */
function WallClock() {
	const hour = useRef<THREE.Group>(null!);
	const minute = useRef<THREE.Group>(null!);
	useFrame(() => {
		const d = new Date();
		const m = d.getMinutes() + d.getSeconds() / 60;
		const h = (d.getHours() % 12) + m / 60;
		minute.current.rotation.z = -(m / 60) * Math.PI * 2;
		hour.current.rotation.z = -(h / 12) * Math.PI * 2;
	});
	return (
		<group position={[0.98, 1.7, ROOM.back + 0.02]}>
			<mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
				<cylinderGeometry args={[0.15, 0.15, 0.03, 48]} />
				<meshStandardMaterial color="#2a2522" roughness={0.5} />
			</mesh>
			<mesh position={[0, 0, 0.0155]}>
				<circleGeometry args={[0.135, 48]} />
				<meshStandardMaterial color="#f3efe7" roughness={0.8} />
			</mesh>
			{Array.from({ length: 12 }, (_, i) => (
				<mesh
					key={i}
					position={[
						Math.sin((i / 12) * Math.PI * 2) * 0.115,
						Math.cos((i / 12) * Math.PI * 2) * 0.115,
						0.017,
					]}
					rotation={[0, 0, -(i / 12) * Math.PI * 2]}
				>
					<planeGeometry args={[0.006, i % 3 === 0 ? 0.024 : 0.012]} />
					<meshBasicMaterial color="#2a2522" />
				</mesh>
			))}
			<group ref={hour} position={[0, 0, 0.019]}>
				<mesh position={[0, 0.035, 0]}>
					<planeGeometry args={[0.01, 0.075]} />
					<meshBasicMaterial color="#2a2522" />
				</mesh>
			</group>
			<group ref={minute} position={[0, 0, 0.021]}>
				<mesh position={[0, 0.05, 0]}>
					<planeGeometry args={[0.006, 0.105]} />
					<meshBasicMaterial color="#2a2522" />
				</mesh>
			</group>
			<mesh position={[0, 0, 0.023]}>
				<circleGeometry args={[0.008, 16]} />
				<meshBasicMaterial color="#c8512f" />
			</mesh>
		</group>
	);
}

function StickyNote() {
	const lang = useGame((s) => s.lang);
	const tex = useMemo(
		() =>
			lang === "ar"
				? noteTexture(["نسخ احتياطي", "يوم الجمعة"], "rtl")
				: noteTexture(["Back up", "photos - Fri"], "ltr"),
		[lang],
	);
	// stuck to the wall, right of the monitor
	return (
		<mesh position={[0.62, 1.23, ROOM.back + 0.002]} rotation={[0, 0, 0.06]}>
			<planeGeometry args={[0.08, 0.08]} />
			<meshStandardMaterial map={tex} roughness={0.9} />
		</mesh>
	);
}

export function Room() {
	return (
		<>
			<color attach="background" args={["#05070a"]} />
			{/* night: almost no ambient light, the screens and the lamp do the work */}
			<hemisphereLight args={["#1c2a40", "#eb8117", 0.05]} />
			{/* cold moonlight through the window */}
			<directionalLight
				position={[-4.5, 3.4, -0.6]}
				intensity={0.35}
				color="#8e9090"
				castShadow
				shadow-mapSize={[2048, 2048]}
				shadow-bias={-0.0004}
				shadow-normalBias={0.02}
				shadow-camera-left={-2}
				shadow-camera-right={2}
				shadow-camera-top={2}
				shadow-camera-bottom={-1}
				shadow-camera-near={0.5}
				shadow-camera-far={10}
			/>
			{/* the monitor is the main light: cool glow on the desk and keyboard */}
			<pointLight
				position={[0, 1.1, -0.4]}
				intensity={0.35}
				distance={1.4}
				decay={2}
				color="#68749c"
			/>
			{/* faint glow from the phone screen */}
			<pointLight
				position={[-0.44, 0.95, -0.24]}
				intensity={0.015}
				distance={0.4}
				decay={2}
				color="#9fc3d6"
			/>
			<Environment resolution={128} frames={1}>
				<Lightformer
					form="rect"
					intensity={0.2}
					color="#9fb6d9"
					position={[-4, 1.6, -0.3]}
					scale={[1.4, 1.3, 1]}
					rotation={[0, Math.PI / 2, 0]}
				/>
				<Lightformer
					form="rect"
					intensity={0.15}
					color="#cfe0f0"
					position={[0, 1.1, 2]}
					scale={[1.2, 0.7, 1]}
				/>
			</Environment>
			<Walls />
			<Desk />
			<Lamp />
			<Mug />
			<Notebook />
			<Shelf />
			<StickyNote />
			<WallArt />
			<WallClock />
		</>
	);
}
