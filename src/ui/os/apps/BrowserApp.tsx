// Browser: tabs, navigation bar, and either the new-tab page or one of the
// fake websites in PAGES (chosen by useOs().browserUrl).
import { useEffect, useState } from "react";
import { BackGlyph, ForwardGlyph, LockGlyph, MoreGlyph, PlusGlyph, ReloadGlyph, SearchGlyph, StarGlyph, CloseGlyph, BrowserIcon, UserGlyph, ExeIcon, InfoGlyph } from "../icons";
import { useOs } from "../osStore";
import { ArcLogo } from "../ArcLogo";
import { CrackSite } from "../pages/CrackSite";
import { CRACK_FILE, CRACK_URL, fileAction } from "../../../game/events";
import { useT } from "../../../i18n/strings";

/** The fake websites, by address. `secure: false` shows "Not secure" in the address bar. */
const PAGES: Record<string, { title: string; secure: boolean; Page: () => JSX.Element }> = {
  [CRACK_URL]: { title: "FREE GAMEZ - Download Full Cracked Games", secure: false, Page: CrackSite },
};

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
  const url = useOs((s) => s.browserUrl);
  const [address, setAddress] = useState(url ?? "");
  const { notify, openUrl, openFolder } = useOs.getState();
  const page = url ? PAGES[url] : undefined;
  // the downloads bar: the cracked game, while it's still on the disk
  const download = useOs((s) => s.files.find((f) => f.id === CRACK_FILE.id && !f.deleted));

  useEffect(() => setAddress(url ?? ""), [url]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const a = address.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (PAGES[a]) openUrl(a);
    else if (a) notify(t.apps.browser, t.comingSoon);
  };

  return (
    <div className="browser">
      <div className="browser__tabs">
        <div className="browser__tab browser__tab--on">
          <BrowserIcon size={16} />
          <span>{page ? page.title : t.newTab}</span>
          <button className="browser__tab-x" onClick={() => openUrl(null)} aria-label={t.closeTab} title={t.closeTab}><CloseGlyph /></button>
        </div>
        <button className="browser__newtab" aria-label={t.newTab}><PlusGlyph size={14} /></button>
      </div>
      <form className="browser__bar" onSubmit={go}>
        <button type="button" className="browser__nav" aria-label="Back" disabled><BackGlyph /></button>
        <button type="button" className="browser__nav" aria-label="Forward" disabled><ForwardGlyph /></button>
        <button type="button" className="browser__nav" aria-label="Reload"><ReloadGlyph /></button>
        <label className="browser__address">
          {page && !page.secure ? (
            <span className="browser__insecure"><InfoGlyph size={14} /> {t.notSecure}</span>
          ) : (
            <LockGlyph size={14} />
          )}
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.addressPh} aria-label={t.addressPh} dir="ltr" />
          <StarGlyph size={14} />
        </label>
        <span className="browser__profile" aria-hidden="true"><UserGlyph size={14} /></span>
        <button type="button" className="browser__nav" aria-label="Menu"><MoreGlyph /></button>
      </form>
      {page ? (
        <div className="browser__page"><page.Page /></div>
      ) : (
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
      )}
      {download && (
        <div className="browser__dl">
          <ExeIcon size={28} />
          <span className="browser__dl-info">
            <strong dir="ltr">{download.name}</strong>
            <small>{t.downloadSize(download.size)}</small>
          </span>
          <button className="browser__dl-btn" onClick={() => fileAction(download, "open")}>{t.openFile}</button>
          <button className="browser__dl-btn" onClick={() => openFolder(download.folder)}>{t.showInFolder}</button>
        </div>
      )}
    </div>
  );
}
