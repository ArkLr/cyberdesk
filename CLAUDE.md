# CyberDesk

Browser game for a public cybersecurity awareness campaign. The player sits at a desk in first person and can use only two devices: a Windows 10-style PC and an
Android-style phone. Desktop browsers only. Bilingual: English and Arabic (Arabic = full RTL).

## Planned gameplay (not built yet)

A guided sequence of 7 events: 6 on the PC, 1 on the phone. Each event offers a safe or a
risky choice. Afterwards the player gets feedback (right/wrong + the red flags they should
have noticed) and, at the end, a grade with a review of every choice.

1. Cracked game download from an unknown website (run / scan / delete)
2. Email with a disguised attachment, `IMG_2041.jpg.exe`
3. Bank phishing link to a look-alike login page (delayed consequence: money leaves the account)
4. Fake "update your browser" banner
5. Invoice document asking to "Enable content" → ransomware takeover
6. Tech-support scam popup with a phone number
7. Phone: SMS code + spoofed bank call asking for the code (vishing)
   Choices happen through real UI actions (opening files, clicking links, answering calls),
   not quiz buttons.

## Stack

Vite + React 18 + TypeScript, three.js via @react-three/fiber + drei, zustand for state.
Run: `npm install`, `npm run dev`. Check: `npx tsc --noEmit`.

## How it works

- `src/scene/`: the 3D room. `layout.ts` holds every position/size in meters (Y up; the
  player looks toward -Z). `CameraRig.tsx` moves between two close-up views ("pc" and
  "phone"; switched with the arrow keys / edge buttons) and, once the camera lands,
  projects the device screen's corners to CSS pixels → `gameStore.screenRect`.
- `src/ui/PcScreen.tsx` and `PhoneScreen.tsx`: HTML UIs positioned exactly over the 3D
  screens using `screenRect`. The PC desktop is laid out at a fixed 1440×800 and
  CSS-scaled to fit (`ScaleContext` gives the scale, e.g. for window dragging). The phone
  is designed at 360px wide and scaled.
- `src/scene/screenTextures.ts`: canvas textures shown on the 3D screens only while the
  camera moves. Keep them visually close to the HTML UIs.
- `src/ui/os/`: the fake OS ("Nova OS"). `osStore.ts` is the window manager
  (open/close/focus/minimize/maximize, Start menu, `notify(title, body)` toasts).
  `Desktop`, `Window`, `Taskbar`, `StartMenu`, `icons.tsx` (inline SVG),
  `apps/` (MailApp, BrowserApp, FilesApp; FilesApp also serves as the Recycle Bin).
  The wallpaper is React Bits `GradientASCII.jsx`, typed via `GradientASCII.d.ts`.
- `src/store/gameStore.ts`: language, current view, camera-moving flag, screenRect.
- `src/i18n/strings.ts`: ALL user-facing text, in both `en` and `ar`. Never hardcode UI text.
- `src/styles.css`: all styling, one file, BEM-like class names (`.win__bar`, `.ph__icon`).
- Models: `src/assets/models/*.glb`, converted from the user's .blend files with
  `tools/blender/` scripts (meshopt-compressed; load with `useGLTF(url, false, true)`).

## Rules

- Every new string goes in both languages. Use CSS logical properties (`inset-inline-start`,
  `margin-inline`) so RTL works. Phone numbers, codes, URLs and the dial pad stay LTR.
- The arrows are physical: ← is always the phone (it sits left of the keyboard), even in Arabic.
- Keep React.StrictMode. In GradientASCII.jsx, `loseContext()` was deliberately removed
  from the cleanup because it breaks StrictMode remounts (the canvas turns white). Don't re-add it.
- The user prefers small, step-by-step changes and runs the code locally.
