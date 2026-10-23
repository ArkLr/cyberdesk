import * as THREE from "three";

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

// deterministic noise so the room looks the same every load
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** Light oak planks for the floor. */
export const floorTexture = () =>
  canvasTex(1024, 1024, (ctx) => {
    const planks = 6;
    const ph = 1024 / planks;
    for (let i = 0; i < planks; i++) {
      const base = 150 + rnd() * 25;
      ctx.fillStyle = `rgb(${base + 28},${base + 2},${base - 38})`;
      ctx.fillRect(0, i * ph, 1024, ph);
      for (let k = 0; k < 70; k++) {
        ctx.strokeStyle = `rgba(90,60,30,${0.04 + rnd() * 0.07})`;
        ctx.lineWidth = 1 + rnd() * 2;
        const y = i * ph + rnd() * ph;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(300, y + rnd() * 8 - 4, 700, y + rnd() * 8 - 4, 1024, y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(50,32,18,0.55)";
      ctx.fillRect(0, i * ph, 1024, 2);
      const cut = rnd() * 1024;
      ctx.fillRect(cut, i * ph, 2, ph);
    }
  }, [3, 3]);

/** Evening sky seen through the window, with a low skyline. */
export const skyTexture = () =>
  canvasTex(512, 512, (ctx) => {
    // late night: dark sky, a few stars, a skyline with lit windows
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#03060d");
    g.addColorStop(0.7, "#0b1424");
    g.addColorStop(1, "#1a2233");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(220,230,255,${0.3 + rnd() * 0.6})`;
      ctx.fillRect(rnd() * 512, rnd() * 300, 1.5, 1.5);
    }
    let x = 0;
    while (x < 512) {
      const w = 20 + rnd() * 50, h = 30 + rnd() * 90;
      ctx.fillStyle = "#0a0d14";
      ctx.fillRect(x, 512 - h, w, h);
      for (let wy = 512 - h + 6; wy < 506; wy += 9)
        for (let wx = x + 4; wx < x + w - 4; wx += 7)
          if (rnd() < 0.18) {
            ctx.fillStyle = rnd() < 0.7 ? "#e8c27a" : "#9fc3e8";
            ctx.fillRect(wx, wy, 3, 4);
          }
      x += w + 2;
    }
  });

/** Handwritten sticky note. */
export const noteTexture = (lines: string[], dir: "ltr" | "rtl") =>
  canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = "#f5df6d";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, 256, 34);
    ctx.direction = dir;
    ctx.fillStyle = "#2b3a8c";
    ctx.font = '500 30px "IBM Plex Sans", "IBM Plex Sans Arabic", system-ui, sans-serif';
    ctx.textAlign = dir === "rtl" ? "right" : "left";
    lines.forEach((l, i) => ctx.fillText(l, dir === "rtl" ? 232 : 24, 92 + i * 46));
  });

/** Abstract print for the wall: dunes at dusk. */
export const artTexture = () =>
  canvasTex(400, 540, (ctx) => {
    ctx.fillStyle = "#efe6d6";
    ctx.fillRect(0, 0, 400, 540);
    ctx.fillStyle = "#d9824b";
    ctx.beginPath();
    ctx.arc(250, 190, 70, 0, Math.PI * 2);
    ctx.fill();
    const bands = ["#c9a36f", "#b07a4f", "#8a5a3c", "#5e3f2e"];
    bands.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      const y0 = 260 + i * 60;
      ctx.moveTo(0, 540);
      ctx.lineTo(0, y0);
      for (let x = 0; x <= 400; x += 20) ctx.lineTo(x, y0 + Math.sin(x / 70 + i * 1.7) * 26);
      ctx.lineTo(400, 540);
      ctx.closePath();
      ctx.fill();
    });
  });
