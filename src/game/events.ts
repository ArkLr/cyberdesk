// The game's events, in order. Each one sets up its scene on a device; the player's
// real UI actions (opening a file, clicking a link...) end up in `useFlow.choose()`.
// All texts are in strings.ts under `events.<id>`.
import { useOs, type Mail, type OsFile } from "../ui/os/osStore";
import { useGame } from "../store/gameStore";
import { getStrings } from "../i18n/strings";
import { useFlow } from "./flow";

export type EventId = "crack" | "photo";

/** How many events the full game has (shown as "2 / 7"). */
export const EVENT_COUNT = 7;

export interface GameEvent {
  id: EventId;
  device: "pc" | "phone";
  /** choice id -> points (10 safe, 5 partly safe, 0 risky) */
  choices: Record<string, number>;
  start: () => void;
}

export type FileAction = "open" | "scan" | "delete";

const t = () => getStrings(useGame.getState().lang);

/* ---------------- 1 · cracked game download ---------------- */

export const CRACK_URL = "free-gamez-crack.xyz";
export const CRACK_FILE: OsFile = {
  id: "crack-exe",
  name: "SuperRacer 2026 - FULL CRACKED FREE.exe",
  folder: "downloads",
  size: "48.2 MB",
  kind: "exe",
  event: "crack",
};

/** The site "starts" the download by itself; the file lands in Downloads. */
export function downloadCrack() {
  const os = useOs.getState();
  if (os.files.some((f) => f.id === CRACK_FILE.id)) return;
  os.addFile(CRACK_FILE);
  os.notify(t().downloadDone, CRACK_FILE.name);
}

/* ---------------- 2 · email with an "image" ---------------- */

export const PHOTO_MAIL: Mail = {
  id: "photo-mail",
  key: "david",
  from: "David",
  address: "david.photos@mail-share.top",
  folder: "inbox",
  time: 0,
  read: false,
  attachment: { name: "IMG_2041.jpg.exe", size: "1.3 MB" },
  event: "photo",
};

export const EVENTS: GameEvent[] = [
  {
    id: "crack",
    device: "pc",
    choices: { run: 0, scan: 5, delete: 10 },
    start: () => {
      useOs.getState().openUrl(CRACK_URL);
      setTimeout(downloadCrack, 3500); // matches the page's countdown
    },
  },
  {
    id: "photo",
    device: "pc",
    choices: { open: 0, reply: 5, delete: 10 },
    start: () => {
      const os = useOs.getState();
      os.addMail({ ...PHOTO_MAIL, time: Date.now() });
      os.openApp("mail");
      os.notify(PHOTO_MAIL.from, t().mails.david.subject);
    },
  },
];

export const MAX_SCORE = EVENTS.reduce((sum, e) => sum + Math.max(...Object.values(e.choices)), 0);

/** A = 90 %, B = 70 %, C = 50 % (63 / 49 / 35 out of 70). */
export function grade(score: number) {
  const r = score / MAX_SCORE;
  return r >= 0.9 ? "A" : r >= 0.7 ? "B" : r >= 0.5 ? "C" : "D";
}

/**
 * Everything the player does to a file comes through here, so a file that
 * belongs to the running event can turn into a choice.
 */
export function fileAction(file: OsFile, action: FileAction) {
  const os = useOs.getState();
  const flow = useFlow.getState();
  const live = flow.phase === "event" && flow.current()?.id === file.event;

  if (file.event === "crack" && live) {
    if (action === "delete") os.deleteFile(file.id);
    flow.choose(action === "open" ? "run" : action);
    return;
  }
  // ordinary behaviour for every other file
  if (action === "delete") os.deleteFile(file.id);
  else if (action === "scan") os.notify(t().apps.security, t().scanClean(file.name));
  else os.notify(file.name, t().cantOpen);
}

export type MailAction = "openAttachment" | "reply" | "delete";

/** Everything the player does to an email comes through here (see fileAction). */
export function mailAction(mail: Mail, action: MailAction) {
  const os = useOs.getState();
  const flow = useFlow.getState();
  const live = flow.phase === "event" && flow.current()?.id === mail.event;

  if (action === "delete") os.deleteMail(mail.id);
  if (action === "reply") os.addMail({ id: `re-${mail.id}`, key: `re-${mail.key}`, from: mail.from, address: mail.address, folder: "sent", time: Date.now(), read: true });

  if (mail.event === "photo" && live) {
    flow.choose(action === "openAttachment" ? "open" : action);
    return;
  }
  if (action === "openAttachment" && mail.attachment) os.notify(mail.attachment.name, t().cantOpen);
}
