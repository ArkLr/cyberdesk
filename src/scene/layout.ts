// All positions in meters, world space, Y up. The player sits at +Z looking toward -Z.
// Numbers marked "from model" come from src/assets/models/*.meta.json (Blender export report).
import * as THREE from "three";

// The desktop model's floor sits at y = -0.3387 and its desk surface at y = 0.481 (from model).
export const MODEL_FLOOR = -0.3387;
export const DESK_TOP = 0.481 - MODEL_FLOOR; // 0.82 m

// Tower, keyboard and mouse from Desktop_Computer.blend (its old monitor is hidden).
// Rotated so everything faces the player.
export const COMPUTER = {
	rotationY: Math.PI / 2,
	position: new THREE.Vector3(-0.872, -MODEL_FLOOR, 0),
	// where the tower goes (world), so it sits under the desk instead of beside it
	towerTarget: new THREE.Vector3(-0.62, 0, -0.52),
};

// Monitor.blend: 61 cm wide, faces +Z, stand base at y = 0 (from model).
export const MONITOR = {
	position: new THREE.Vector3(0, DESK_TOP, -0.66),
	// visible display area, in the model's own coordinates (from model)
	screen: {
		center: new THREE.Vector3(0, 0.261, 0.0378),
		width: 0.598,
		height: 0.332,
	},
};

export const DESK = {
	width: 1.7,
	depth: 0.92,
	thickness: 0.035,
	centerZ: -0.5,
};

// Phone lying face up on the desk, left of the keyboard.
export const PHONE = {
	position: new THREE.Vector3(-0.44, DESK_TOP + 0.0049, -0.24),
	rotation: new THREE.Euler(-Math.PI / 2, 0, 0.3),
	// from model: screen 73 x 146 mm, front face at z = +0.004
	screen: { width: 0.073, height: 0.1463, z: 0.0046 },
};

export const CAMERA = {
	fov: 40,
	// where the camera starts before gliding in to the computer
	intro: {
		position: new THREE.Vector3(0.05, 1.3, 0.75),
		target: new THREE.Vector3(0, 1.0, -0.6),
	},
	// how much of the view the screen fills (1 = edge to edge). A bit under 1 keeps the bezel in view.
	pcFill: 0.99,
	phoneFill: 0.92,
};

export const WORLD_SCREEN_CENTER = MONITOR.screen.center
	.clone()
	.add(MONITOR.position);
