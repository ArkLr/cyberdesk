// Browser: tabs, navigation bar, and a new-tab page.
// Next step: a small "router" that maps fake addresses to fake pages.
import { useState } from "react";
import { BackGlyph, ForwardGlyph, LockGlyph, MoreGlyph, PlusGlyph, ReloadGlyph, SearchGlyph, StarGlyph, CloseGlyph, BrowserIcon, UserGlyph } from "../icons";
import { useOs } from "../osStore";
import { ArcLogo } from "../ArcLogo";
import { useT } from "../../../i18n/strings";

const QUICK = [
  { key: "news", color: "#d64541", letter: "N" },
  { key: "weather", color: "#2e86de", letter: "W" },
  { key: "mail", color: "#1d6fd8", letter: "M" },
  { key: "maps", color: "#1e9e5a", letter: "M" },
  { key: "shop", color: "#e67e22", letter: "S" },
  { key: "video", color: "#8e44ad", letter: "V" },
] as const;

export function BrowserApp() {
  const t = useT();
  const [address, setAddress] = useState("");
  const notify = useOs((s) => s.notify);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) notify(t.apps.browser, t.comingSoon);
  };

  return (
    <div className="browser">
      <div className="browser__tabs">
        <div className="browser__tab browser__tab--on">
          <BrowserIcon size={16} />
          <span>{t.newTab}</span>
          <span className="browser__tab-x" aria-hidden="true"><CloseGlyph /></span>
        </div>
        <button className="browser__newtab" aria-label={t.newTab}><PlusGlyph size={14} /></button>
      </div>
      <form className="browser__bar" onSubmit={go}>
        <button type="button" className="browser__nav" aria-label="Back" disabled><BackGlyph /></button>
        <button type="button" className="browser__nav" aria-label="Forward" disabled><ForwardGlyph /></button>
        <button type="button" className="browser__nav" aria-label="Reload"><ReloadGlyph /></button>
        <label className="browser__address">
          <LockGlyph size={14} />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.addressPh} aria-label={t.addressPh} dir="ltr" />
          <StarGlyph size={14} />
        </label>
        <span className="browser__profile" aria-hidden="true"><UserGlyph size={14} /></span>
        <button type="button" className="browser__nav" aria-label="Menu"><MoreGlyph /></button>
      </form>
      <div className="browser__page browser__newpage">
        <p className="browser__greeting">{t.greeting(new Date().getHours())}</p>
        <div className="browser__brand">
          <ArcLogo height={78} />
        </div>
        <form className="browser__search" onSubmit={go}>
          <SearchGlyph size={18} />
          <input placeholder={t.searchWeb} aria-label={t.searchWeb} onChange={(e) => setAddress(e.target.value)} />
        </form>
        <section className="browser__sites">
          <h3>{t.topSites}</h3>
          <div className="browser__quick">
            {QUICK.map((q) => (
              <button key={q.key} className="browser__q" onClick={() => notify(t.quick[q.key], t.comingSoon)}>
                <span className="browser__q-icon" style={{ background: q.color }}>{q.letter}</span>
                <span>{t.quick[q.key]}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
