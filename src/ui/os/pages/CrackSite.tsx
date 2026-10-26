// free-gamez-crack.xyz: a shady download site for event 1.
// Loud colors, fake download buttons, pop-up ads, and "turn off your antivirus".
import { useEffect, useState } from "react";
import { downloadCrack } from "../../../game/events";
import { useOs } from "../osStore";
import { CloseGlyph } from "../icons";
import { useT } from "../../../i18n/strings";

export function CrackSite() {
  const t = useT();
  const s = t.crackSite;
  const downloaded = useOs((st) => st.files.some((f) => f.id === "crack-exe"));
  const [count, setCount] = useState(3);
  const [ads, setAds] = useState({ win: true, speed: true });

  // the countdown before the download "starts by itself" (events.ts adds the file)
  useEffect(() => {
    if (downloaded || count <= 0) return;
    const id = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count, downloaded]);

  return (
    <div className="crack">
      <header className="crack__top">
        <span className="crack__logo" dir="ltr">FREE<b>GAMEZ</b>.xyz</span>
        <span className="crack__tagline">{s.tagline}</span>
      </header>

      <div className="crack__banner crack__banner--blink">{s.adSpeed} <button>{s.adFix}</button></div>

      <main className="crack__main">
        <div className="crack__cover" aria-hidden="true">
          <span dir="ltr">SUPER<br />RACER<br /><small>2026</small></span>
        </div>
        <div className="crack__info">
          <h1 dir="ltr">{s.title}</h1>
          <p className="crack__stats">{s.stats}</p>
          <p>{s.desc}</p>
          <p className="crack__warn">⚠ {s.warn}</p>
          <button className="crack__dl" onClick={downloadCrack}>⬇ {s.download}</button>
          <div className="crack__mirrors">
            {[1, 2, 3].map((n) => (
              <button key={n} className="crack__mirror" onClick={downloadCrack}>⬇ {s.mirror(n)}</button>
            ))}
          </div>
          <p className="crack__status">{downloaded ? s.started : s.starting(Math.max(count, 1))}</p>
        </div>
      </main>

      {ads.win && (
        <div className="crack__popup" role="dialog">
          <button className="crack__popup-x" onClick={() => setAds((a) => ({ ...a, win: false }))} aria-label={t.close}><CloseGlyph /></button>
          <strong>🎁 {s.adWin}</strong>
          <button className="crack__claim">{s.adClaim}</button>
        </div>
      )}
      {ads.speed && (
        <aside className="crack__side">
          <button className="crack__popup-x" onClick={() => setAds((a) => ({ ...a, speed: false }))} aria-label={t.close}><CloseGlyph /></button>
          <strong>{s.adSpeed}</strong>
          <button className="crack__claim crack__claim--green">{s.adFix}</button>
        </aside>
      )}
    </div>
  );
}
