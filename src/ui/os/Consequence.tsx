// What happens on the computer right after the player's choice, before the feedback card.
// Picked by "<event>:<choice>"; choices without an animation just pause for a moment.
import { useEffect, useState } from "react";
import { useFlow } from "../../game/flow";
import { BANK_URL, CRACK_FILE, PHOTO_MAIL, stealMoney } from "../../game/events";
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

function Pause() {
  useEffect(() => {
    const id = setTimeout(() => useFlow.getState().consequenceDone(), 1200);
    return () => clearTimeout(id);
  }, []);
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
    default:
      return <Pause />;
  }
}
