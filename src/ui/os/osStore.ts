// Window manager for the computer: which apps are open, their positions,
// the Start menu, and the notification toasts.
import { create } from "zustand";

export type AppId = "mail" | "browser" | "files" | "bin";

export interface Win {
  id: string;
  app: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export interface Note {
  id: number;
  title: string;
  body: string;
}

// The desktop is laid out at this size and scaled to fit the 3D screen.
export const DESKTOP_W = 1440;
export const DESKTOP_H = 800;
export const TASKBAR_H = 40;

const DEFAULT_SIZE: Record<AppId, { w: number; h: number }> = {
  mail: { w: 1080, h: 620 },
  browser: { w: 1040, h: 620 },
  files: { w: 860, h: 520 },
  bin: { w: 760, h: 460 },
};

interface OsState {
  windows: Win[];
  topZ: number;
  startOpen: boolean;
  notes: Note[];

  openApp: (app: AppId) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  /** taskbar button: open, bring to front, or minimize if already in front */
  taskbarClick: (app: AppId) => void;
  showDesktop: () => void;
  setStart: (open: boolean) => void;
  notify: (title: string, body: string) => void;
  dismiss: (id: number) => void;
}

let noteId = 0;

export const useOs = create<OsState>((set, get) => ({
  windows: [],
  topZ: 1,
  startOpen: false,
  notes: [],

  openApp: (app) => {
    const existing = get().windows.find((w) => w.app === app);
    const z = get().topZ + 1;
    if (existing) {
      set({ topZ: z, startOpen: false, windows: get().windows.map((w) => (w.id === existing.id ? { ...w, minimized: false, z } : w)) });
      return;
    }
    const { w, h } = DEFAULT_SIZE[app];
    const offset = (get().windows.length % 5) * 28;
    const win: Win = {
      id: `${app}-${Date.now()}`,
      app,
      w,
      h,
      x: Math.round((DESKTOP_W - w) / 2) + offset - 40,
      y: Math.round((DESKTOP_H - TASKBAR_H - h) / 2) + offset - 30,
      z,
      minimized: false,
      maximized: false,
    };
    set({ topZ: z, startOpen: false, windows: [...get().windows, win] });
  },
  close: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),
  focus: (id) => {
    const z = get().topZ + 1;
    set({ topZ: z, windows: get().windows.map((w) => (w.id === id ? { ...w, z } : w)) });
  },
  minimize: (id) => set({ windows: get().windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)) }),
  toggleMaximize: (id) => set({ windows: get().windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) }),
  move: (id, x, y) => set({ windows: get().windows.map((w) => (w.id === id ? { ...w, x, y } : w)) }),
  taskbarClick: (app) => {
    const win = get().windows.find((w) => w.app === app);
    if (!win) return get().openApp(app);
    const isFront = !win.minimized && win.z === Math.max(...get().windows.filter((w) => !w.minimized).map((w) => w.z));
    if (isFront) get().minimize(win.id);
    else get().openApp(app);
  },
  showDesktop: () => set({ startOpen: false, windows: get().windows.map((w) => ({ ...w, minimized: true })) }),
  setStart: (startOpen) => set({ startOpen }),
  notify: (title, body) => {
    const id = ++noteId;
    set({ notes: [...get().notes, { id, title, body }].slice(-3) });
    setTimeout(() => get().dismiss(id), 4500);
  },
  dismiss: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),
}));

/** The window currently in front (not minimized), if any. */
export const activeWindowId = (wins: Win[]) => {
  const visible = wins.filter((w) => !w.minimized);
  if (!visible.length) return null;
  return visible.reduce((a, b) => (b.z > a.z ? b : a)).id;
};
