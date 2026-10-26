// browser://settings/help: the browser's own Settings > About page.
// This is where real updates happen: it checks, then says it's up to date.
import { useEffect, useState } from "react";
import { ArcLogo } from "../ArcLogo";
import { useT } from "../../../i18n/strings";

export function BrowserSettings() {
  const t = useT();
  const s = t.aboutPage;
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setChecking(false), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="bset">
      <aside className="bset__side">
        <h1>{s.title}</h1>
        {s.side.map((n, i) => (
          <span key={n} className={i === s.side.length - 1 ? "bset__item bset__item--on" : "bset__item"}>{n}</span>
        ))}
      </aside>
      <main className="bset__main">
        <h2>{s.about}</h2>
        <div className="bset__card">
          <ArcLogo height={44} />
          <div className="bset__status">
            {checking ? <span className="cons__spinner" /> : <span className="bset__ok">✓</span>}
            <span>
              <strong>{checking ? s.checking : s.upToDate}</strong>
              <small dir="ltr">{s.version}</small>
            </span>
          </div>
          <p>{s.note}</p>
        </div>
      </main>
    </div>
  );
}
