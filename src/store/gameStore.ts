import { create } from "zustand";

export type Lang = "en" | "ar";
export type View = "pc" | "phone";
export interface ScreenRect { x: number; y: number; w: number; h: number }

interface GameState {
  lang: Lang;
  /** which device the camera is looking at */
  view: View;
  /** true while the camera travels between the two views */
  moving: boolean;
  /** where the current device's screen sits on the page (CSS pixels), once the camera has landed */
  screenRect: ScreenRect | null;
  loaded: boolean;

  setLang: (l: Lang) => void;
  goTo: (v: View) => void;
  arrived: (rect: ScreenRect) => void;
  setScreenRect: (rect: ScreenRect) => void;
  setLoaded: () => void;
}

export const useGame = create<GameState>((set, get) => ({
  lang: "en",
  view: "pc",
  moving: true, // the game opens with the camera gliding in to the computer
  screenRect: null,
  loaded: false,

  setLang: (lang) => set({ lang }),
  goTo: (view) => {
    if (get().moving || get().view === view) return;
    set({ view, moving: true, screenRect: null });
  },
  arrived: (screenRect) => set({ moving: false, screenRect }),
  setScreenRect: (screenRect) => set({ screenRect }),
  setLoaded: () => set({ loaded: true }),
}));
