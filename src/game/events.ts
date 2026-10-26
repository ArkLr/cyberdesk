// The game's events, in order. Each one sets up its scene on a device; the player's
// real UI actions (opening a file, clicking a link...) end up in `useFlow.choose()`.
// All texts are in strings.ts under `events.<id>`.
import { useOs, type AppId, type Mail, type OsFile } from "../ui/os/osStore";
import { useGame } from "../store/gameStore";
import { getStrings } from "../i18n/strings";
import { useFlow } from "./flow";
import { usePhone } from "../ui/phoneStore";

export type EventId = "crack" | "photo" | "phish" | "update" | "invoice" | "scam" | "vishing";

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

/** A website download: the file lands in Downloads and shows in the browser's downloads bar. */
export function download(file: OsFile) {
  const os = useOs.getState();
  if (os.files.some((f) => f.id === file.id)) return;
  os.addFile(file);
  useOs.setState({ lastDownload: file.id });
  os.notify(t().downloadDone, file.name);
}

/** The site "starts" the download by itself. */
export const downloadCrack = () => download(CRACK_FILE);

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

/* ---------------- 3 · bank phishing link ---------------- */

/** The bank's real site, and the look-alike the email links to. */
export const BANK_URL = "arcbank.dz";
export const PHISH_URL = "arcbank-verify-account.com/login";

export const PHISH_MAIL: Mail = {
  id: "phish-mail",
  key: "arcbank",
  from: "ArcBank Security",
  address: "alerts@arcbank-verify-account.com",
  folder: "inbox",
  time: 0,
  read: false,
  link: PHISH_URL,
  event: "phish",
};

const live = (id: EventId) => {
  const flow = useFlow.getState();
  return flow.phase === "event" && flow.current()?.id === id;
};

/** Every page the player opens in the browser comes through here. */
export function visitUrl(url: string | null) {
  const from = useOs.getState().browserUrl;
  useOs.getState().openUrl(url);
  const { choose } = useFlow.getState();
  // typing the bank's address yourself is the safe choice
  if (url === BANK_URL && live("phish")) choose("official");
  // closing the news tab, or checking for updates in the browser itself
  if (live("update") && url === null && from === NEWS_URL) choose("close");
  if (live("update") && url === ABOUT_URL) choose("settings");
}

/** The look-alike page's form was sent. */
export function phishLogin() {
  if (live("phish")) useFlow.getState().choose("login");
}

/** The delayed consequence: a few seconds later, the phone buzzes with the transfer. */
export function stealMoney() {
  setTimeout(() => {
    useGame.getState().goTo("phone");
    setTimeout(() => usePhone.getState().notify("ArcBank", t().phoneNotice.transfer), 1600);
    setTimeout(() => useFlow.getState().consequenceDone(), 6500);
  }, 3000);
}

/* ---------------- 4 · fake browser update ---------------- */

export const NEWS_URL = "dailynova-news.com";
/** the browser's own Settings > About page */
export const ABOUT_URL = "browser://settings/help";
/** where the fake update really comes from */
export const UPDATE_HOST = "browser-update-center.click";
export const UPDATE_FILE: OsFile = {
  id: "update-exe",
  name: "Update.exe",
  folder: "downloads",
  size: "2.4 MB",
  kind: "exe",
  event: "update",
};

/* ---------------- 5 · invoice with macros (ransomware) ---------------- */

export const INVOICE_MAIL: Mail = {
  id: "invoice-mail",
  key: "invoice",
  from: "Parcel Express",
  address: "billing@parcelexpress-invoices.net",
  folder: "inbox",
  time: 0,
  read: false,
  attachment: { name: "Invoice_7731.docm", size: "86 KB" },
  event: "invoice",
};

/** The yellow bar's "Enable Content" button in Writer. */
export function enableContent() {
  if (live("invoice")) useFlow.getState().choose("enable");
  else useOs.getState().notify(t().apps.writer, t().macrosBlocked);
}

/* ---------------- 6 · tech-support scam ---------------- */

export const SCAM_URL = "pc-security-alert.live";
export const SCAM_NUMBER = "0800 471 193";

/** Task Manager's "End task". Ending the browser is the way out of the full-screen scam. */
export function endTask(app: AppId) {
  const os = useOs.getState();
  const wasScam = app === "browser" && os.browserUrl === SCAM_URL;
  os.windows.filter((w) => w.app === app).forEach((w) => os.close(w.id));
  if (app === "browser") useOs.setState({ browserUrl: null });
  if (wasScam && live("scam")) useFlow.getState().choose("close");
}

/* ---------------- 7 · SMS code + spoofed bank call ---------------- */

/** ArcBank's real number (on the back of the card). The scammer fakes it as caller ID. */
export const BANK_NUMBER = "021 98 76 54";
export const SMS_CODE = "482913";
/** how long after the SMS the "bank" calls */
const RING_DELAY = 12000;

const digits = (s: string) => s.replace(/\D/g, "");
const say = (me: boolean, key: string) => () => usePhone.getState().say({ me, key });

/**
 * Plays a call's lines: each step runs `delay` ms after the previous one, but only while
 * the same call is on screen. `done` always runs at the end (it moves the game on).
 */
function callScript(steps: [number, () => void][], done?: () => void, doneAfter = 1500) {
  const id = usePhone.getState().call?.id;
  let at = 0;
  for (const [delay, step] of steps) {
    at += delay;
    setTimeout(() => usePhone.getState().call?.id === id && step(), at);
  }
  if (done) setTimeout(done, at + doneAfter);
}

/** The fake "support" line from event 6: remote access, then payment. */
function supportCall(counts: boolean) {
  const phone = usePhone.getState();
  phone.startCall({ who: SCAM_NUMBER, number: SCAM_NUMBER, incoming: false, status: "calling" });
  callScript(
    [
      [2200, () => usePhone.getState().patch({ status: undefined, since: Date.now() })],
      [400, say(false, "sup1")],
      [3200, say(false, "sup2")],
      [4200, say(true, "supMe")],
      [2400, say(false, "sup3")],
      [4400, () => usePhone.getState().endCall()],
    ],
    counts
      ? () => {
          // the scam page is gone once the "technician" is done
          endTask("browser");
          useFlow.getState().consequenceDone();
        }
      : undefined,
    2500,
  );
}

/** Calling ArcBank yourself. `report`: right after the scam call, to check. */
function bankCall(report: boolean, done?: () => void) {
  usePhone.getState().startCall({ who: "ArcBank", number: BANK_NUMBER, incoming: false, status: report ? "callingCard" : "calling" });
  callScript(
    [
      [2400, () => usePhone.getState().patch({ status: undefined, since: Date.now() })],
      [300, say(false, "realHello")],
      ...(report
        ? ([
            [2200, say(true, "meReport")],
            [3000, say(false, "realSafe")],
          ] as [number, () => void][])
        : ([[2200, say(false, "realHelp")]] as [number, () => void][])),
      [5000, () => usePhone.getState().endCall()],
    ],
    done,
  );
}

/** The phone's call button (dial pad or a contact). */
export function placeCall(number: string) {
  const n = digits(number);
  if (!n) return;
  if (n === digits(SCAM_NUMBER)) {
    const counts = live("scam");
    if (counts) useFlow.getState().choose("call");
    return supportCall(counts);
  }
  if (n === digits(BANK_NUMBER)) return bankCall(false);
  usePhone.getState().startCall({ who: number, number, incoming: false, status: "calling" });
  callScript([[5000, () => usePhone.getState().patch({ status: "noAnswer", state: "ended" })]]);
}

function startVishing() {
  const phone = usePhone.getState();
  phone.dismiss();
  phone.clearCall();
  phone.addSms({ id: "code", from: "ArcBank", key: "code", time: Date.now() });
  phone.notify("ArcBank", t().sms.code);
  setTimeout(() => live("vishing") && usePhone.getState().startCall({ who: "ArcBank", number: BANK_NUMBER, incoming: true }), RING_DELAY);
}

/** Answer on the incoming call: the "bank" explains, then asks for the code. */
export function answerCall() {
  usePhone.getState().answer();
  callScript([
    [900, say(false, "vish1")],
    [3600, say(false, "vish2")],
    [2800, () => usePhone.getState().setOptions(["read", "askName"])],
  ]);
}

/** The red button: decline, hang up, or close the ended call. */
export function hangUp() {
  const phone = usePhone.getState();
  const c = phone.call;
  if (!c) return;
  if (c.state === "ended") return phone.clearCall();
  phone.endCall();
  if (c.incoming && live("vishing")) pickOption("hangup");
}

/** One of the answers during the scam call (or hanging up). */
export function pickOption(id: string) {
  if (!live("vishing")) return;
  const { choose, consequenceDone } = useFlow.getState();
  choose(id);
  usePhone.getState().setOptions([]);
  const end = () => usePhone.getState().endCall();
  if (id === "read") {
    callScript(
      [
        [0, say(true, "meRead")],
        [2600, say(false, "vishThanks")],
        [2800, end],
        [1600, () => usePhone.getState().notify("ArcBank", t().phoneNotice.emptied)],
      ],
      consequenceDone,
      4500,
    );
  } else if (id === "askName") {
    callScript(
      [
        [0, say(true, "meAsk")],
        [2600, say(false, "vishName")],
        [3600, say(true, "meBye")],
        [2200, end],
      ],
      consequenceDone,
      2000,
    );
  } else {
    // hung up: now call the number on the back of the card
    setTimeout(() => bankCall(true, consequenceDone), 1500);
  }
}

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
  {
    id: "phish",
    device: "pc",
    choices: { login: 0, official: 10, delete: 10 },
    start: () => {
      const os = useOs.getState();
      os.addMail({ ...PHISH_MAIL, time: Date.now() });
      os.openApp("mail");
      os.notify(PHISH_MAIL.from, t().mails.arcbank.subject);
    },
  },
  {
    id: "update",
    device: "pc",
    choices: { install: 0, close: 10, settings: 10 },
    start: () => visitUrl(NEWS_URL),
  },
  {
    id: "invoice",
    device: "pc",
    choices: { enable: 0, forward: 5, delete: 10 },
    start: () => {
      const os = useOs.getState();
      os.addMail({ ...INVOICE_MAIL, time: Date.now() });
      os.openApp("mail");
      os.notify(INVOICE_MAIL.from, t().mails.invoice.subject);
    },
  },
  {
    id: "scam",
    device: "pc",
    choices: { call: 0, close: 10 },
    start: () => visitUrl(SCAM_URL),
  },
  {
    id: "vishing",
    device: "phone",
    choices: { read: 0, askName: 5, hangup: 10 },
    start: startVishing,
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
  const ev = file.event as EventId | undefined;
  if (action === "delete") os.deleteFile(file.id);

  if (ev && live(ev)) {
    const flow = useFlow.getState();
    const choice = action === "open" ? OPEN_CHOICE[ev] : action;
    if (choice && choice in flow.current()!.choices) return flow.choose(choice);
  }
  if (action === "scan") {
    // the game's malware is caught when scanned outside its own choices
    if (ev) os.removeFile(file.id);
    os.notify(t().apps.security, ev ? t().scanThreat(file.name) : t().scanClean(file.name));
  } else if (action === "open") os.notify(file.name, t().cantOpen);
}

/** What opening an event's file counts as. */
const OPEN_CHOICE: Partial<Record<EventId, string>> = { crack: "run", update: "install" };

export type MailAction = "openAttachment" | "openLink" | "reply" | "forward" | "delete";

/** Everything the player does to an email comes through here (see fileAction). */
export function mailAction(mail: Mail, action: MailAction, to = "") {
  const os = useOs.getState();
  const flow = useFlow.getState();
  const isLive = flow.phase === "event" && flow.current()?.id === mail.event;

  if (action === "delete") os.deleteMail(mail.id);
  if (action === "reply") os.addMail({ id: `re-${mail.id}`, key: `re-${mail.key}`, from: mail.from, address: mail.address, folder: "sent", time: Date.now(), read: true });
  if (action === "forward") os.addMail({ id: `fw-${mail.id}`, key: `fw-${mail.key}`, from: mail.from, address: to, folder: "sent", time: Date.now(), read: true });
  if (action === "openLink" && mail.link) os.openUrl(mail.link);
  // documents open in Writer (opening one isn't a choice; enabling its macros is)
  if (action === "openAttachment" && mail.attachment?.name.endsWith(".docm")) return os.openDoc(mail.attachment.name);

  // choose() ignores actions that aren't a choice of this event (e.g. following the phishing link)
  if (isLive) {
    flow.choose(action === "openAttachment" ? "open" : action);
    return;
  }
  if (action === "openAttachment" && mail.attachment) os.notify(mail.attachment.name, t().cantOpen);
}
