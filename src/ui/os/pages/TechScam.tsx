// pc-security-alert.live: event 6's fake "virus detected" page. In the tab it's just a page;
// once it "goes full screen" (ScamScreen) it covers the desktop and ignores Esc.
import { useEffect, useState } from "react";
import { SCAM_NUMBER, SCAM_URL } from "../../../game/events";
import { useOs } from "../osStore";
import { ShieldGlyph } from "../icons";
import { useT } from "../../../i18n/strings";

const THREATS = ["Trojan.Spyware.Banker", "Worm.Keylogger.Win32", "Adware.Hijack.Search", "Ransom.Crypt.Gen", "Backdoor.RemoteSpy"];

export function TechScam({ fullscreen = false }: { fullscreen?: boolean }) {
  const t = useT();
  const s = t.scamSite;
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBlocked((n) => n + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  return (
    <div className={`scam ${fullscreen ? "scam--full" : ""}`} role="alertdialog">
      <header className="scam__top">
        <ShieldGlyph size={18} /> {s.brand}
      </header>
      <div className="scam__body">
        <h1>⚠ {s.title}</h1>
        <p>{s.body}</p>
        <ul className="scam__list" dir="ltr">
          {THREATS.map((th) => <li key={th}>{th}</li>)}
        </ul>
        <div className="scam__call">
          <span>{s.callNow}</span>
          <b dir="ltr">{SCAM_NUMBER}</b>
          <small>{s.free}</small>
        </div>
        <p className="scam__warn">{s.dont}</p>
      </div>
      <div key={blocked} className={`scam__dialog ${blocked ? "scam__dialog--shake" : ""}`}>
        <header>{s.dialogTitle}</header>
        <p>{blocked ? s.noExit : s.dialog}</p>
        <div>
          <button onClick={() => setBlocked((n) => n + 1)}>{s.ok}</button>
          <button onClick={() => setBlocked((n) => n + 1)}>{s.close}</button>
        </div>
      </div>
    </div>
  );
}

/** The scam page over the whole desktop (but under the taskbar and Task Manager). */
export function ScamScreen() {
  const url = useOs((s) => s.browserUrl);
  const open = useOs((s) => s.windows.some((w) => w.app === "browser"));
  return url === SCAM_URL && open ? <TechScam fullscreen /> : null;
}
