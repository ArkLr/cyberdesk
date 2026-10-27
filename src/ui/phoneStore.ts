// The phone's state: the heads-up notification (one at a time), text messages, and the call on screen.
// Texts are stored as keys into strings.ts (`sms.<key>`, `calls.<key>`) so they follow the language.
import { create } from "zustand";

export interface PhoneNotice {
  id: number;
  app: string;
  body: string;
}

export interface Sms {
  id: string;
  from: string;
  /** strings.ts `sms.<key>` */
  key: string;
  time: number;
}

/** One line of a call: who says it, and its key in strings.ts `calls`. */
export interface CallLine {
  me: boolean;
  key: string;
}

export interface Call {
  id: number;
  who: string;
  number: string;
  incoming: boolean;
  state: "ringing" | "active" | "ended";
  /** a status under the number instead of the timer (strings.ts `calls.<key>`) */
  status?: string;
  lines: CallLine[];
  /** answers the player can pick (keys into strings.ts `calls`) */
  options: string[];
  /** when the call was answered (ms), for the timer */
  since: number;
}

interface PhoneState {
  notice: PhoneNotice | null;
  sms: Sms[];
  call: Call | null;
  notify: (app: string, body: string) => void;
  dismiss: () => void;
  addSms: (sms: Sms) => void;
  /** a text arrives: it's kept in Messages and pops up as a heads-up notification */
  receiveSms: (from: string, key: string, body: string) => void;
  startCall: (call: Pick<Call, "who" | "number" | "incoming"> & Partial<Omit<Call, "id">>) => void;
  answer: () => void;
  say: (line: CallLine) => void;
  setOptions: (options: string[]) => void;
  patch: (p: Partial<Call>) => void;
  endCall: () => void;
  clearCall: () => void;
}

let callId = 0;

export const usePhone = create<PhoneState>((set, get) => ({
  notice: null,
  sms: [],
  call: null,
  notify: (app, body) => set({ notice: { id: Date.now(), app, body } }),
  dismiss: () => set({ notice: null }),
  addSms: (sms) => set({ sms: [sms, ...get().sms.filter((s) => s.id !== sms.id)] }),
  receiveSms: (from, key, body) => {
    get().addSms({ id: key, from, key, time: Date.now() });
    get().notify(from, body);
  },
  startCall: (call) =>
    // a call takes over the screen, so the heads-up notification goes away
    set({ notice: null, call: { id: ++callId, state: call.incoming ? "ringing" : "active", lines: [], options: [], since: Date.now(), ...call } }),
  answer: () => {
    const c = get().call;
    if (c) set({ call: { ...c, state: "active", since: Date.now() } });
  },
  say: (line) => {
    const c = get().call;
    if (c && c.state !== "ended") set({ call: { ...c, lines: [...c.lines, line] } });
  },
  setOptions: (options) => {
    const c = get().call;
    if (c && c.state === "active") set({ call: { ...c, options } });
  },
  patch: (p) => {
    const c = get().call;
    if (c) set({ call: { ...c, ...p } });
  },
  endCall: () => {
    const c = get().call;
    if (c) set({ call: { ...c, state: "ended", options: [] } });
  },
  clearCall: () => set({ call: null }),
}));
