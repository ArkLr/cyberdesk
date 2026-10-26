// The phone's heads-up notification (one at a time), shown at the top of its screen.
import { create } from "zustand";

export interface PhoneNotice {
  id: number;
  app: string;
  body: string;
}

interface PhoneState {
  notice: PhoneNotice | null;
  notify: (app: string, body: string) => void;
  dismiss: () => void;
}

export const usePhone = create<PhoneState>((set) => ({
  notice: null,
  notify: (app, body) => set({ notice: { id: Date.now(), app, body } }),
  dismiss: () => set({ notice: null }),
}));
