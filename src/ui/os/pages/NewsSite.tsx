// dailynova-news.com: an ordinary news site for event 4. A moment after it loads, a
// full-page "your browser is out of date" banner covers it, offering Update.exe from another domain.
import { useEffect, useState } from "react";
import { UPDATE_FILE, UPDATE_HOST, download } from "../../../game/events";
import { BrowserIcon } from "../icons";
import { useT } from "../../../i18n/strings";

export function NewsSite() {
  const t = useT();
  const s = t.newsSite;
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setBanner(true), 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="news">
      <header className="news__top">
        <span className="news__logo">{s.name}</span>
        <nav className="news__nav">
          {s.nav.map((n) => <span key={n}>{n}</span>)}
        </nav>
      </header>
      <main className="news__main">
        <article className="news__article">
          <small className="news__tag">{s.tag}</small>
          <h1>{s.headline}</h1>
          <p className="news__lead">{s.lead}</p>
          <div className="news__img" aria-hidden="true" />
          {s.body.map((p) => <p key={p}>{p}</p>)}
        </article>
        <aside className="news__side">
          <h2>{s.mostRead}</h2>
          <ol>
            {s.more.map((m) => <li key={m}>{m}</li>)}
          </ol>
        </aside>
      </main>

      {banner && (
        <div className="news__update" role="alertdialog">
          <div className="news__update-box">
            <BrowserIcon size={72} />
            <h2>{s.updTitle}</h2>
            <p>{s.updBody}</p>
            <button className="news__update-btn" onClick={() => download(UPDATE_FILE)}>
              {s.updBtn}
            </button>
            <small dir="ltr">{s.updFrom(UPDATE_HOST)}</small>
          </div>
        </div>
      )}
    </div>
  );
}
