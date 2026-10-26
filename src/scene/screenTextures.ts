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

/** Same light blue background as .os__wallpaper in styles.css */
export function drawWallpaper(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
) {
	ctx.fillStyle = "#021225";
	ctx.fillRect(0, 0, w, h);
	ctx.save();
	ctx.translate(w / 2, h * 0.45);
	ctx.scale(1, (0.7 * h) / (0.75 * w));
	const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.75);
	g.addColorStop(0, "#eaf4ff");
	g.addColorStop(0.55, "#c9e1fb");
	g.addColorStop(1, "#a9cbf1");
	ctx.fillStyle = g;
	ctx.fillRect(-w, -h * 3, w * 2, h * 6);
	ctx.restore();
}

/** Old-CRT look, matching .crt / .screen--crt in styles.css: scanlines, dark edges, rounded tube corners. */
function drawCrt(ctx: CanvasRenderingContext2D, w: number, h: number) {
	ctx.fillStyle = "rgba(0,20,60,0.07)";
	for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
	ctx.save();
	ctx.translate(w / 2, h / 2);
	ctx.scale(1, h / w);
	const v = ctx.createRadialGradient(0, 0, w * 0.36, 0, 0, w * 0.66);
	v.addColorStop(0, "rgba(10,30,70,0)");
	v.addColorStop(1, "rgba(10,30,70,0.4)");
	ctx.fillStyle = v;
	ctx.fillRect(-w, -w, w * 2, w * 2);
	ctx.restore();
	// black outside the rounded corners (border-radius: 3.2% / 5.5%)
	const rx = w * 0.032,
		ry = h * 0.055;
	ctx.fillStyle = "#00000017";
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.moveTo(rx, 0);
	ctx.ellipse(rx, ry, rx, ry, 0, -Math.PI / 2, -Math.PI, true);
	ctx.lineTo(0, h - ry);
	ctx.ellipse(rx, h - ry, rx, ry, 0, Math.PI, Math.PI / 2, true);
	ctx.lineTo(w - rx, h);
	ctx.ellipse(w - rx, h - ry, rx, ry, 0, Math.PI / 2, 0, true);
	ctx.lineTo(w, ry);
	ctx.ellipse(w - rx, ry, rx, ry, 0, 0, -Math.PI / 2, true);
	ctx.closePath();
	ctx.fill("evenodd");
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

		ctx.fillStyle = "rgba(238,245,253,0.9)";
		ctx.fillRect(0, h - 48, w, 48);
		ctx.fillStyle = "#1b1d21";
		ctx.font = `400 12px ${UI}`;
		ctx.textAlign = lang === "ar" ? "left" : "right";
		ctx.fillText(clock(), lang === "ar" ? 24 : w - 24, h - 20);
		drawCrt(ctx, w, h);
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
