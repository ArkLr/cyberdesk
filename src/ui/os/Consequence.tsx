// What happens on the computer right after the player's choice, before the feedback card.
// Picked by "<event>:<choice>"; choices without an animation just pause for a moment.
import { useEffect, useState } from "react";
import { useFlow } from "../../game/flow";
import { BANK_URL, CRACK_FILE, PHOTO_MAIL, stealMoney } from "../../game/events";
import type { Mail } from "./osStore";
import { useOs } from "./osStore";
import { SecurityIcon } from "./icons";
import { useT } from "../../i18n/strings";

/** Runs `steps` one after another: step i starts `delays[i]` ms after step i-1. */
function useStages(delays: number[]) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= delays.length) return;
    const id = setTimeout(() => setStage((s) => s + 1), delays[stage]);
    return () => clearTimeout(id);
  }, [stage, delays]);
  return stage;
}

const STOLEN = ["Arc/Login Data", "Arc/Cookies", "Arc/Autofill", "Mail/accounts.db", "Wallet/keys.json"];
const STOLEN_DELAYS = [1400, ...STOLEN.map(() => 450)];

/** Event 1, ran the file: the screen flickers, then the passwords leave the PC. */
function DataStolen() {
  const t = useT();
  const stage = useStages(STOLEN_DELAYS);
  const done = stage > STOLEN.length;
  return (
    <div className="cons">
      {stage === 0 && <div className="cons__flicker" />}
      {stage > 0 && (
        <div className="cons__term" dir="ltr">
          <div className="cons__term-head">C:\Users\Arc\AppData\Local\Temp\sr26.exe</div>
          <p>&gt; {t.cons.sending}</p>
          {STOLEN.slice(0, stage).map((f) => (
            <p key={f}>&gt; upload {f} <span className="cons__ok">100%</span></p>
          ))}
        </div>
      )}
      {done && (
        <div className="cons__alert cons__alert--bad" role="alertdialog">
          <strong>{t.cons.stolenTitle}</strong>
          <p>{t.cons.stolen}</p>
          <button onClick={() => useFlow.getState().consequenceDone()}>{t.cons.continue}</button>
        </div>
      )}
    </div>
  );
}

const SCAN_DELAYS = [2600];

/** Event 1, scanned the file: the antivirus finds it and quarantines it. */
function ScanFile() {
  const t = useT();
  const stage = useStages(SCAN_DELAYS);
  useEffect(() => {
    if (stage === 1) useOs.getState().removeFile(CRACK_FILE.id);
  }, [stage]);
  return (
    <div className="cons cons--dim">
      <div className="cons__scan" role="alertdialog">
        <header><SecurityIcon size={22} /> {t.apps.security}</header>
        {stage === 0 ? (
          <>
            <p>{t.cons.scanning(CRACK_FILE.name)}</p>
            <div className="cons__bar"><i /></div>
          </>
        ) : (
          <>
            <strong className="cons__threat">⚠ {t.cons.threatFound}</strong>
            <code dir="ltr">{t.cons.threatName}</code>
            <p>{t.cons.quarantined}</p>
            <button onClick={() => useFlow.getState().consequenceDone()}>{t.cons.continue}</button>
          </>
        )}
      </div>
    </div>
  );
}

const WEBCAM_DELAYS = [1600, 1400];

/** Event 2, opened the attachment: nothing shows up, but the webcam light turns on. */
function WebcamOn() {
  const t = useT();
  const stage = useStages(WEBCAM_DELAYS);
  useEffect(() => {
    if (stage !== 1) return;
    const os = useOs.getState();
    os.setWebcam(true);
    os.notify(t.camTitle, t.camBody);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);
  return (
    <div className="cons">
      {stage === 0 && (
        <div className="cons__opening">
          <span className="cons__spinner" />
          <span dir="ltr">{t.cons.opening("IMG_2041.jpg")}</span>
        </div>
      )}
      {stage === 2 && (
        <div className="cons__alert cons__alert--bad" role="alertdialog">
          <strong>{t.cons.webcamTitle}</strong>
          <p>{t.cons.webcam}</p>
          <button onClick={() => useFlow.getState().consequenceDone()}>{t.cons.continue}</button>
        </div>
      )}
    </div>
  );
}

/** Event 2, replied: the scammer answers at once, from the same address. */
function ScammerReplies() {
  const t = useT();
  useEffect(() => {
    const ids = [
      setTimeout(() => {
        const os = useOs.getState();
        os.addMail({ ...PHOTO_MAIL, id: "photo-again", key: "davidAgain", time: Date.now(), event: undefined });
        os.notify(PHOTO_MAIL.from, t.mails.davidAgain.body);
      }, 1500),
      setTimeout(() => useFlow.getState().consequenceDone(), 4500),
    ];
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

const PHISH_DELAYS = [1800, 1800];

/**
 * Event 3, logged in on the look-alike page: it "verifies" the account and sends the player
 * to the real bank site, so nothing seems wrong... until the phone buzzes (stealMoney).
 */
function PhishLogin() {
  const t = useT();
  const stage = useStages(PHISH_DELAYS);
  useEffect(() => {
    if (stage !== 2) return;
    useOs.getState().openUrl(BANK_URL);
    stealMoney();
  }, [stage]);
  if (stage === 2) return null;
  return (
    <div className="cons cons--dim">
      <div className="cons__opening">
        {stage === 0 ? <span className="cons__spinner" /> : <span className="cons__ok">✓</span>}
        <span>{stage === 0 ? t.cons.verifying : t.cons.verified}</span>
      </div>
    </div>
  );
}

const FINE_DELAYS = [1500];

/** Event 3, went to the real site: no suspension there, the email was fake. */
function BankFine() {
  const t = useT();
  const stage = useStages(FINE_DELAYS);
  if (stage === 0) return null;
  return (
    <div className="cons">
      <div className="cons__alert cons__alert--good" role="alertdialog">
        <strong>{t.cons.bankFineTitle}</strong>
        <p>{t.cons.bankFine}</p>
        <button onClick={() => useFlow.getState().consequenceDone()}>{t.cons.continue}</button>
      </div>
    </div>
  );
}

const AD_COUNT = 14;
const AD_DELAYS = [700, ...Array.from({ length: AD_COUNT }, (_, i) => Math.max(120, 420 - i * 30)), 900];

/** Event 4, ran Update.exe: ad pop-ups open faster and faster all over the screen. */
function Adware() {
  const t = useT();
  const stage = useStages(AD_DELAYS);
  const shown = Math.min(Math.max(stage - 1, 0), AD_COUNT);
  return (
    <div className="cons">
      {Array.from({ length: shown }, (_, i) => {
        const ad = t.cons.ads[i % t.cons.ads.length];
        // spread over the desktop without randomness, so it looks the same every time
        const left = 40 + ((i * 389) % 1080);
        const top = 30 + ((i * 211) % 520);
        return (
          <div key={i} className={`cons__ad cons__ad--${i % 4}`} style={{ left, top }}>
            <header>
              <span>{t.cons.adTitle}</span>
              <b aria-hidden="true">×</b>
            </header>
            <strong>{ad}</strong>
            <button tabIndex={-1}>{t.cons.adBtn}</button>
          </div>
        );
      })}
      {stage > AD_COUNT + 1 && (
        <div className="cons__alert cons__alert--bad" role="alertdialog">
          <strong>{t.cons.adwareTitle}</strong>
          <p>{t.cons.adware}</p>
          <button onClick={() => useFlow.getState().consequenceDone()}>{t.cons.continue}</button>
        </div>
      )}
    </div>
  );
}

const LOCK_FILES = [
  "CV_2026.docx", "Family_trip_2025.jpg", "Thesis_final_v3.docx", "Bank_statements.pdf", "Wedding_video.mp4",
  "Budget_2026.xlsx", "IMG_0412.jpg", "IMG_0413.jpg", "Passport_scan.pdf", "Notes.txt",
];
// flicker, then one file every 350 ms, the new wallpaper, then the ransom note
const RANSOM_DELAYS = [1400, ...LOCK_FILES.map(() => 350), 1200, 1600];
const RANSOM_SECONDS = 72 * 3600;

/** Event 5, enabled the macros: files get encrypted one by one, the wallpaper changes, then the ransom note. */
function Ransomware() {
  const t = useT();
  const stage = useStages(RANSOM_DELAYS);
  const locked = Math.min(Math.max(stage - 1, 0), LOCK_FILES.length);
  const wallpaper = stage > LOCK_FILES.length + 1;
  const note = stage > LOCK_FILES.length + 2;
  const [left, setLeft] = useState(RANSOM_SECONDS);

  useEffect(() => {
    // the document window goes away as soon as the macro runs
    if (stage !== 1) return;
    const os = useOs.getState();
    os.windows.filter((w) => w.app === "writer").forEach((w) => os.close(w.id));
  }, [stage]);
  useEffect(() => {
    if (!note) return;
    const id = setInterval(() => setLeft((l) => Math.max(l - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [note]);

  const clock = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map((n) => String(n).padStart(2, "0")).join(":");

  return (
    <div className="cons">
      {stage === 0 && <div className="cons__flicker" />}
      {stage > 0 && !wallpaper && (
        <div className="cons__locker" dir="ltr">
          <header>C:\Users\Arc\Documents</header>
          {LOCK_FILES.map((f, i) => (
            <p key={f} className={i < locked ? "cons__locked" : ""}>
              <span aria-hidden="true">{i < locked ? "🔒" : "📄"}</span> {i < locked ? `${f}.locked` : f}
            </p>
          ))}
        </div>
      )}
      {wallpaper && (
        <div className="cons__ransom-bg">
          <span>{t.cons.ransomBg}</span>
        </div>
      )}
      {note && (
        <div className="cons__ransom" role="alertdialog">
          <h2>🔒 {t.cons.ransomTitle}</h2>
          <p>{t.cons.ransomBody}</p>
          <p>{t.cons.ransomPay}</p>
          <code dir="ltr">bc1q-demo-not-a-real-wallet-7731</code>
          <div className="cons__ransom-timer">
            <span>{t.cons.ransomTimer}</span>
            <b dir="ltr">{clock}</b>
          </div>
          <button className="cons__ransom-pay" tabIndex={-1}>{t.cons.ransomCheck}</button>
          <button className="cons__ransom-go" onClick={() => useFlow.getState().consequenceDone()}>{t.cons.continue}</button>
        </div>
      )}
    </div>
  );
}

/** Event 5, forwarded the invoice: the friend opens it, and it gets them instead. */
function FriendReplies() {
  const t = useT();
  useEffect(() => {
    const ids = [
      setTimeout(() => {
        const os = useOs.getState();
        const to = os.mails.find((m) => m.id === "fw-invoice-mail")?.address ?? "friend@arcmail.example";
        const name = to.split("@")[0].replace(/^./, (c) => c.toUpperCase());
        const reply: Mail = { id: "friend-reply", key: "friendLocked", from: name, address: to, folder: "inbox", time: Date.now(), read: false };
        os.addMail(reply);
        os.notify(name, t.mails.friendLocked.body);
      }, 2000),
      setTimeout(() => useFlow.getState().consequenceDone(), 6000),
    ];
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function Pause({ ms = 1200 }: { ms?: number }) {
  useEffect(() => {
    const id = setTimeout(() => useFlow.getState().consequenceDone(), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return null;
}

export function Consequence() {
  const phase = useFlow((s) => s.phase);
  const last = useFlow((s) => s.last());
  if (phase !== "consequence" || !last) return null;
  switch (`${last.event}:${last.choice}`) {
    case "crack:run":
      return <DataStolen />;
    case "crack:scan":
      return <ScanFile />;
    case "photo:open":
      return <WebcamOn />;
    case "photo:reply":
      return <ScammerReplies />;
    case "phish:login":
      return <PhishLogin />;
    case "phish:official":
      return <BankFine />;
    case "update:install":
      return <Adware />;
    case "update:settings":
      // let the About page finish checking ("up to date")
      return <Pause ms={3500} />;
    case "invoice:enable":
      return <Ransomware />;
    case "invoice:forward":
      return <FriendReplies />;
    // these play out on the phone (call scripts in events.ts move the game on)
    case "scam:call":
    case "vishing:read":
    case "vishing:askName":
    case "vishing:hangup":
      return null;
    default:
      return <Pause />;
  }
}
