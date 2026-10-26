// The game's progress: intro -> for each event (event -> consequence -> feedback) -> end.
import { create } from "zustand";
import { EVENTS, type EventId, type GameEvent } from "./events";

export type Phase =
  | "intro" // welcome card
  | "event" // the event is on screen, waiting for the player's choice
  | "consequence" // the choice's animation is playing on the device
  | "feedback" // the card with the red flags
  | "end"; // final grade

export interface Result {
  event: EventId;
  choice: string;
  points: number;
}

interface FlowState {
  phase: Phase;
  index: number;
  results: Result[];

  current: () => GameEvent | undefined;
  /** the result of the event being played, once the player has chosen */
  last: () => Result | undefined;
  start: () => void;
  choose: (choice: string) => void;
  consequenceDone: () => void;
  next: () => void;
}

export const useFlow = create<FlowState>((set, get) => ({
  phase: "intro",
  index: 0,
  results: [],

  current: () => EVENTS[get().index],
  last: () => {
    const r = get().results[get().results.length - 1];
    return r && r.event === get().current()?.id ? r : undefined;
  },
  start: () => set({ phase: "event", index: 0, results: [] }),
  choose: (choice) => {
    const ev = get().current();
    // only the first choice counts
    if (get().phase !== "event" || !ev || !(choice in ev.choices)) return;
    set({ phase: "consequence", results: [...get().results, { event: ev.id, choice, points: ev.choices[choice] }] });
  },
  consequenceDone: () => get().phase === "consequence" && set({ phase: "feedback" }),
  next: () => {
    const index = get().index + 1;
    set(index < EVENTS.length ? { phase: "event", index } : { phase: "end" });
  },
}));
