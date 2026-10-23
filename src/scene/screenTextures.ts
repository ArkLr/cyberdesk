// What the 3D screens show while the camera is moving.
// Once the camera lands, the HTML screen (src/ui) appears on top, so these only
// need to match it closely enough that the switch isn't noticeable.
import * as THREE from "three";
import type { Lang } from "../store/gameStore";

const UI =
	'"Segoe UI", "IBM Plex Sans", "IBM Plex Sans Arabic", system-ui, sans-serif';

function makeCanvas(w: number, h: number) {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 8;
	return { canvas, texture };
}

const clock = () =>
	new Date().toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

/** Same wallpaper as .os__wallpaper in styles.css */
/** Rough stand-in for the GradientASCII wallpaper, shown while the camera moves. */
export function drawWallpaper(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
) {
	ctx.fillStyle = "#03060f";
	ctx.fillRect(0, 0, w, h);
	// blue band arching across the middle
	ctx.save();
	ctx.translate(w / 2, h * 0.5);
	ctx.scale(1, 0.32);
	const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.6);
	g.addColorStop(0, "rgba(56,110,235,0.75)");
	g.addColorStop(0.55, "rgba(30,63,216,0.35)");
	g.addColorStop(1, "rgba(30,63,216,0)");
	ctx.fillStyle = g;
	ctx.fillRect(-w, -h * 2, w * 2, h * 4);
	ctx.restore();
}

export class PcScreenTexture {
	canvas: HTMLCanvasElement;
	texture: THREE.CanvasTexture;
	constructor() {
		({ canvas: this.canvas, texture: this.texture } = makeCanvas(
			1440,
			Math.round(1440 * (0.332 / 0.598)),
		));
	}
	draw(lang: Lang) {
		const ctx = this.canvas.getContext("2d")!;
		const { width: w, height: h } = this.canvas;
		drawWallpaper(ctx, w, h);
		// taskbar
		ctx.fillStyle = "rgba(16,18,22,0.92)";
		ctx.fillRect(0, h - 40, w, 40);
		ctx.fillStyle = "#f2f4f7";
		ctx.font = `400 12px ${UI}`;
		ctx.textAlign = lang === "ar" ? "left" : "right";
		ctx.fillText(clock(), lang === "ar" ? 24 : w - 24, h - 16);
		this.texture.needsUpdate = true;
	}
}

export class PhoneScreenTexture {
	canvas: HTMLCanvasElement;
	texture: THREE.CanvasTexture;
	constructor() {
		({ canvas: this.canvas, texture: this.texture } = makeCanvas(
			512,
			Math.round(512 * (0.1463 / 0.073)),
		));
	}
	draw(_lang: Lang) {
		const ctx = this.canvas.getContext("2d")!;
		const { width: w, height: h } = this.canvas;
		const g = ctx.createLinearGradient(0, 0, w * 0.3, h);
		g.addColorStop(0, "#0d1b2e");
		g.addColorStop(0.55, "#1d3a5f");
		g.addColorStop(1, "#4b4f7a");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = "rgba(255,255,255,0.95)";
		ctx.textAlign = "center";
		ctx.font = `300 120px ${UI}`;
		ctx.fillText(clock(), w / 2, h * 0.2);
		this.texture.needsUpdate = true;
	}
}
