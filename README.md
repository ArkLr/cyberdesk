# CyberDesk — Step 1: the desk

A first-person cybersecurity awareness game. This step contains the scene and the two
device interfaces: a Windows 11-style computer (Arc OS) and an Android-style phone,
with two close-up views you switch between with the arrow keys. The scene is set late at night.

## Run it

You need **Node.js 18 or newer** (check with `node -v`). Get it from https://nodejs.org if needed.

```bash
cd cyberdesk
npm install        # first time only, takes a minute
npm run dev        # starts the game
```

Open the address it prints (usually http://localhost:5173) in Chrome, Edge or Firefox.

**Controls**
- `←` or the tab on the left edge: look at the phone
- `→` or the tab on the right edge: look at the computer
- **EN / عربي** (top corner): switch language (Arabic mirrors everything, like Arabic Windows/Android)

On the computer: double-click desktop icons, use the Start menu (search, Pinned, All apps), drag
windows by their title bar, double-click a title bar to maximize, use the taskbar to switch/minimize,
and the thin strip at the far end of the taskbar to show the desktop. Mail, Browser, File Explorer and
Recycle Bin open; the other Start menu apps show a "not available yet" notification.

On the phone: Phone (dial pad), Messages, Authenticator and Settings open; tap the bar at the
bottom to go home.

To make a version you can put on a web host: `npm run build`, then upload the `dist/` folder.

## Folder structure

```
cyberdesk/
├─ index.html                 page shell + Google Fonts (IBM Plex Sans / Arabic)
├─ src/
│  ├─ main.tsx                starts React
│  ├─ App.tsx                 puts the 3D scene and the screens together
│  ├─ styles.css              all styling (sections: HUD, COMPUTER SCREEN, PHONE)
│  ├─ store/gameStore.ts      game state: language, current view, where the screen is
│  ├─ i18n/strings.ts         every English and Arabic text
│  ├─ scene/                  the 3D part (react-three-fiber)
│  │  ├─ DeskScene.tsx        the <Canvas>: room + computer + monitor + phone + camera
│  │  ├─ layout.ts            all positions and sizes in meters (tweak the views here)
│  │  ├─ CameraRig.tsx        camera moves, arrow keys
│  │  ├─ Monitor.tsx          your Monitor.blend model
│  │  ├─ Computer.tsx         tower, keyboard, mouse from Desktop_Computer.blend
│  │  ├─ Phone.tsx            your note_8.blend model
│  │  ├─ Room.tsx             desk, walls, window, lamp, props, night lighting
│  │  ├─ screenTextures.ts    what the 3D screens show during camera moves
│  │  ├─ proceduralTextures.ts floor, night sky, wall art (drawn in code)
│  │  └─ prepareModel.ts      shadows / reflections for the models
│  ├─ ui/
│  │  ├─ PcScreen.tsx         places the desktop over the 3D monitor
│  │  ├─ PhoneScreen.tsx      the phone: home screen, dock, apps
│  │  ├─ Hud.tsx              loader, language switch, edge arrows
│  │  ├─ Toast.tsx            small message bubble (phone)
│  │  └─ os/                  the computer's operating system
│  │     ├─ osStore.ts        window manager: open/close/focus/minimize/maximize, Start, notifications
│  │     ├─ Desktop.tsx       wallpaper, desktop icons, windows, notifications
│  │     ├─ Window.tsx        window frame: drag, title bar buttons
│  │     ├─ Taskbar.tsx       Start button, search, apps, tray, clock
│  │     ├─ StartMenu.tsx     app list + tiles
│  │     ├─ icons.tsx         app/folder icons (PNGs from assets/os-icons) and small SVG glyphs
│  │     └─ apps/             MailApp, BrowserApp, FilesApp (also the Recycle Bin)
│  └─ assets/
│     ├─ models/              desktop.glb, monitor.glb, phone.glb (from your .blend files)
│     ├─ Icons/               your Windows .ico files (source)
│     ├─ os-icons/            those icons as 128 px PNGs, used by the computer
│     └─ textures/            desk (wood_table_worn) and wall (plastered_wall_03) maps, 2K/1K
└─ tools/
   ├─ blender/                the scripts that converted the .blend files
   └─ icons/convert_icons.py  makes assets/os-icons from assets/Icons (which .ico is used for what)
```

## How the screens work

The monitor and phone are 3D models. When the camera finishes moving to a device,
the game measures where that device's screen is on your display and places an
HTML page exactly on top of it (`PcScreen` / `PhoneScreen`). The computer
desktop is laid out at 1440 × 800 (like a screen resolution) and scaled to fit, so it looks
the same at any window size. The emails, web pages, SMS and calls in the next steps will be
normal React components inside `src/ui/os/apps/` and `PhoneScreen.tsx`.

To show a Windows-style notification from anywhere in the code:
```ts
import { useOs } from "./ui/os/osStore";
useOs.getState().notify("Mail", "You have 1 new email");
```

## Easy things to tweak

| What | Where |
|---|---|
| How close the camera is | `CAMERA.pcFill` and `CAMERA.phoneFill` in `src/scene/layout.ts` (1 = screen touches the edges) |
| Camera move speed | `DURATION` in `src/scene/CameraRig.tsx` |
| Overall brightness | `toneMappingExposure` in `src/scene/DeskScene.tsx` |
| Lamp / monitor glow | the `pointLight` lines in `src/scene/Room.tsx` |
| Wallpaper | `.os__wallpaper` in `src/styles.css` (and `drawWallpaper` in `screenTextures.ts` to match) |
| Old-CRT screen look (scanlines, grain, rolling band, corners) | `.crt` and `.screen--crt` in `src/styles.css` (and `drawCrt` in `screenTextures.ts` to match) |
| Arc logo | `src/ui/os/ArcLogo.tsx` |
| Desk / wall brightness and texture size | the `color` on the desk and wall materials, and `WOOD_TILE` / `WALL_TILE`, in `src/scene/Room.tsx` |
| Accent color (buttons, window border) | `--os-accent` at the top of `src/styles.css` |
| Default window sizes | `DEFAULT_SIZE` in `src/ui/os/osStore.ts` |

The computer uses the Segoe UI font when it's installed (it is on every Windows PC),
so on Windows it looks exactly like Windows 11. Elsewhere it falls back to IBM Plex Sans.

## About the 3D models

Your `.blend` files were converted to `.glb` with Blender 5.2:
- **Monitor.blend**: its texture (`texture/base_color.png`) isn't packed inside the .blend file,
  so the monitor uses a satin black material. Send the PNG if you want the original look.
- **Desktop_Computer.blend**: only the tower, keyboard and mouse are used now; its monitor is hidden.
- Brand marks were removed (the Windows logo, the Dell photo on the tower,
  the Samsung logo on the phone) so the campaign stays brand-neutral.
- The phone was scaled to real size (163 mm) and laid flat.
- Textures were reduced to 512 px and geometry was compressed (48 MB → 2.5 MB total).

To re-export after editing a model in Blender:

```bash
pip install bpy        # Blender as a Python module (needs Python 3.13)
python3 tools/blender/blend_export.py -- Desktop_Computer.blend desktop.raw.glb desktop desktop.meta.json
npx @gltf-transform/cli optimize desktop.raw.glb src/assets/models/desktop.glb \
  --compress meshopt --texture-compress webp --texture-size 512 --join false --flatten false --instance false
```
(Use `phone` instead of `desktop` for the phone file.)
