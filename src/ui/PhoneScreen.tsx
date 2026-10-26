// The phone's screen as HTML, placed over the 3D phone once the camera has landed.
// Designed at 360px wide and scaled to fit, so it stays sharp at any window size.
import { useEffect, useState } from "react";
import { useGame } from "../store/gameStore";
import { useT } from "../i18n/strings";
import { useToast, Toast } from "./Toast";
import { usePhone } from "./phoneStore";
import { CallScreen } from "./CallScreen";
import { BANK_NUMBER, placeCall } from "../game/events";
import {
  BackGlyph, BatteryGlyph, BluetoothGlyph, ChevronRightGlyph, InfoGlyph, BellGlyph,
  PhoneGlyph, ShieldGlyph, WifiGlyph, SearchGlyph, PencilGlyph,
} from "./os/icons";

const DESIGN_WIDTH = 360;

type PhoneApp = "messages" | "phone" | "auth" | "settings" | "camera" | "photos" | "calendar" | "browser";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Simple white glyphs for the app icons. */
function AppGlyph({ app }: { app: PhoneApp }) {
  const s = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (app) {
    case "messages": return <svg {...s}><path d="M4 5h16v11H9l-5 4z" /></svg>;
    case "phone": return <svg {...s}><path d="M7.5 3.5 5 4c-.8.2-1.3 1-1.1 1.8 1.2 6.4 6.4 11.6 12.8 12.8.8.2 1.6-.3 1.8-1.1l.5-2.5-3.7-1.9-1.7 1.7a10 10 0 0 1-4.8-4.8l1.7-1.7z" /></svg>;
    case "auth": return <svg {...s}><path d="M12 3 19 5.5V11c0 4.2-2.9 7.5-7 9-4.1-1.5-7-4.8-7-9V5.5z" /><path d="m9 11.5 2 2 4-4" /></svg>;
    case "settings": return <svg {...s}><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" /></svg>;
    case "camera": return <svg {...s}><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>;
    case "photos": return <svg {...s}><rect x="4" y="5" width="16" height="14" rx="2" /><path d="m4 16 4.5-4.5 3.5 3.5 2.5-2.5L20 18" /><circle cx="15.5" cy="9" r="1.3" /></svg>;
    case "calendar": return <svg {...s}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8.5 3v4M15.5 3v4" /></svg>;
    case "browser": return <svg {...s}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.3 3.6 5.2 3.6 8.5s-1.1 6.2-3.6 8.5c-2.5-2.3-3.6-5.2-3.6-8.5S9.5 5.8 12 3.5" /></svg>;
  }
}

const GRID: PhoneApp[] = ["calendar", "photos", "settings", "auth"];
const DOCK: PhoneApp[] = ["phone", "messages", "browser", "camera"];
const BUILT: PhoneApp[] = ["messages", "phone", "auth", "settings"];

function StatusBar({ time }: { time: string }) {
  return (
    <div className="ph__status">
      <span>{time}</span>
      <span className="ph__status-icons">
        <span className="ph__signal" aria-hidden="true"><i /><i /><i /><i /></span>
        <WifiGlyph size={14} />
        <BatteryGlyph size={16} />
      </span>
    </div>
  );
}

/** People saved on the phone. ArcBank's number is the one printed on the bank card. */
const CONTACTS = [
  { name: "ArcBank", number: BANK_NUMBER, card: true },
  { name: "David", number: "0555 12 34 56" },
  { name: "Sara", number: "0661 98 76 54" },
];

function AppScreen({ app, onBack }: { app: PhoneApp; onBack: () => void }) {
  const t = useT();
  const sms = usePhone((s) => s.sms);
  const [number, setNumber] = useState("");
  const [tab, setTab] = useState<"keypad" | "contacts">("keypad");
  const title = t.phoneApps[app];

  let body: JSX.Element;
  if (app === "messages" && sms.length) {
    body = (
      <div className="ph__list">
        {sms.map((m) => (
          <div key={m.id} className="ph__sms">
            <span className="ph__sms-avatar" aria-hidden="true">{m.from[0]}</span>
            <span className="ph__sms-text">
              <span className="ph__sms-top">
                <strong>{m.from}</strong>
                <small>{new Date(m.time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</small>
              </span>
              <span>{t.sms[m.key as keyof typeof t.sms]}</span>
            </span>
          </div>
        ))}
      </div>
    );
  } else if (app === "messages") {
    body = (
      <div className="ph__empty">
        <span className="ph__empty-icon ph__icon--messages"><AppGlyph app="messages" /></span>
        <strong>{t.noMessages}</strong>
        <span>{t.noMessagesSub}</span>
      </div>
    );
  } else if (app === "auth") {
    body = (
      <div className="ph__empty">
        <span className="ph__empty-icon ph__icon--auth"><AppGlyph app="auth" /></span>
        <strong>{t.noAccounts}</strong>
        <span>{t.noAccountsSub}</span>
      </div>
    );
  } else if (app === "settings") {
    const icons = [WifiGlyph, BluetoothGlyph, BellGlyph, ShieldGlyph, InfoGlyph];
    body = (
      <div className="ph__list">
        {t.settingsRows.map((row, i) => {
          const Icon = icons[i];
          return (
            <div key={row} className="ph__row">
              <span className="ph__row-icon"><Icon size={16} /></span>
              <span>{row}</span>
              <ChevronRightGlyph size={14} className="ph__row-chev" />
            </div>
          );
        })}
      </div>
    );
  } else if (tab === "contacts") {
    body = (
      <div className="ph__list">
        {CONTACTS.map((c) => (
          <button key={c.name} className="ph__row ph__contact" onClick={() => placeCall(c.number)}>
            <span className="ph__sms-avatar" aria-hidden="true">{c.name[0]}</span>
            <span className="ph__sms-text">
              <strong>{c.name}</strong>
              <small dir="ltr">{c.number}</small>
              {c.card && <small>{t.contacts.card}</small>}
            </span>
            <PhoneGlyph size={16} className="ph__row-chev" />
          </button>
        ))}
      </div>
    );
  } else {
    // dial pad
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
    body = (
      <div className="ph__dialer">
        <div className="ph__number" dir="ltr">{number || " "}</div>
        <div className="ph__keys">
          {keys.map((k) => (
            <button key={k} className="ph__key" onClick={() => setNumber((n) => (n + k).slice(0, 15))}>{k}</button>
          ))}
        </div>
        <div className="ph__dial-row">
          <span />
          <button className="ph__call" aria-label={t.call} onClick={() => placeCall(number)}><PhoneGlyph size={22} /></button>
          <button className="ph__del" onClick={() => setNumber((n) => n.slice(0, -1))} aria-label="Delete">⌫</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ph__app-screen">
      <header className="ph__app-head">
        <button className="ph__back" onClick={onBack} aria-label="Back"><BackGlyph size={18} /></button>
        <h2>{title}</h2>
        {app === "messages" && (
          <span className="ph__head-actions"><SearchGlyph size={16} /><PencilGlyph size={16} /></span>
        )}
      </header>
      {body}
      {app === "phone" && (
        <nav className="ph__tabs">
          <button className={tab === "keypad" ? "on" : ""} onClick={() => setTab("keypad")}>{t.contacts.keypad}</button>
          <button className={tab === "contacts" ? "on" : ""} onClick={() => setTab("contacts")}>{t.contacts.title}</button>
        </nav>
      )}
    </div>
  );
}

/** A heads-up notification sliding in at the top; tap to dismiss. */
function Notice() {
  const t = useT();
  const notice = usePhone((s) => s.notice);
  if (!notice) return null;
  return (
    <button key={notice.id} className="ph__notice" onClick={() => usePhone.getState().dismiss()}>
      <span className="ph__notice-icon" aria-hidden="true">{notice.app[0]}</span>
      <span className="ph__notice-text">
        <span className="ph__notice-top">
          <strong>{notice.app}</strong>
          <small>{t.phoneNotice.now}</small>
        </span>
        <span>{notice.body}</span>
      </span>
    </button>
  );
}

export function PhoneScreen() {
  const view = useGame((s) => s.view);
  const rect = useGame((s) => s.screenRect);
  const lang = useGame((s) => s.lang);
  const t = useT();
  const now = useNow();
  const [toast, showToast] = useToast();
  const [app, setApp] = useState<PhoneApp | null>(null);

  if (view !== "phone" || !rect) return null;

  const locale = lang === "ar" ? "ar-DZ" : "en-GB";
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
  const scale = rect.w / DESIGN_WIDTH;

  const launch = (a: PhoneApp) => (BUILT.includes(a) ? setApp(a) : showToast(t.notYet));

  const icon = (a: PhoneApp, label = true) => (
    <button key={a} className="ph__app" onClick={() => launch(a)}>
      <span className={`ph__icon ph__icon--${a}`}><AppGlyph app={a} /></span>
      {label && <span className="ph__label">{t.phoneApps[a]}</span>}
    </button>
  );

  return (
    <div className="ph" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}>
      <div className="ph__inner" style={{ width: DESIGN_WIDTH, height: rect.h / scale, transform: `scale(${scale})` }}>
        <StatusBar time={time} />
        {app ? (
          <AppScreen app={app} onBack={() => setApp(null)} />
        ) : (
          <div className="ph__home-screen">
            <div className="ph__widget">
              <div className="ph__clock" dir="ltr">{time}</div>
              <div className="ph__date">{date}</div>
            </div>
            <div className="ph__grid">{GRID.map((a) => icon(a))}</div>
            <div className="ph__dots" aria-hidden="true"><i className="on" /><i /></div>
            <div className="ph__dock">{DOCK.map((a) => icon(a, false))}</div>
          </div>
        )}
        <CallScreen />
        <Notice />
        <Toast text={toast} />
        <button className="ph__homebar" onClick={() => setApp(null)} aria-label="Home" />
      </div>
    </div>
  );
}
