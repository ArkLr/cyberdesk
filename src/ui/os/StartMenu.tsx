// Start menu (Windows 11 style): search, pinned apps, recommended, and the user / power row.
// "All apps" switches the pinned grid to an alphabetical list.
import { useState } from "react";
import { useOs, type AppId } from "./osStore";
import {
  BinIcon, BrowserIcon, CalcIcon, CalendarIcon, ChevronRightGlyph, BackGlyph, ClockIcon, ExplorerIcon,
  MailIcon, PhotosIcon, PowerGlyph, SearchGlyph, SecurityIcon, SettingsIcon, UserGlyph, WeatherIcon,
  type IconComponent,
} from "./icons";
import { useT } from "../../i18n/strings";

type Entry = { key: keyof ReturnType<typeof useT>["apps"]; Icon: IconComponent; app?: AppId };

const ENTRIES: Entry[] = [
  { key: "mail", Icon: MailIcon, app: "mail" },
  { key: "browser", Icon: BrowserIcon, app: "browser" },
  { key: "files", Icon: ExplorerIcon, app: "files" },
  { key: "security", Icon: SecurityIcon },
  { key: "settings", Icon: SettingsIcon },
  { key: "photos", Icon: PhotosIcon },
  { key: "calendar", Icon: CalendarIcon },
  { key: "weather", Icon: WeatherIcon },
  { key: "clock", Icon: ClockIcon },
  { key: "calculator", Icon: CalcIcon },
  { key: "bin", Icon: BinIcon, app: "bin" },
];

export function StartMenu() {
  const open = useOs((s) => s.startOpen);
  const { openApp, notify, setStart } = useOs.getState();
  const t = useT();
  const [all, setAll] = useState(false);
  const [query, setQuery] = useState("");
  if (!open) return null;

  const launch = (e: Entry) => {
    setQuery("");
    setAll(false);
    if (e.app) openApp(e.app);
    else {
      setStart(false);
      notify(t.apps[e.key], t.notYet);
    }
  };

  const q = query.trim().toLowerCase();
  const sorted = [...ENTRIES].sort((a, b) => t.apps[a.key].localeCompare(t.apps[b.key]));
  const results = q ? sorted.filter((e) => t.apps[e.key].toLowerCase().includes(q)) : null;

  let lastLetter = "";
  return (
    <div className="start" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Start">
      <label className="start__search">
        <SearchGlyph size={15} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.startSearch} aria-label={t.startSearch} />
      </label>

      <div className="start__body">
        {results ? (
          <div className="start__list">
            {results.map((e) => (
              <button key={e.key} className="start__item" onClick={() => launch(e)}>
                <e.Icon size={28} />
                {t.apps[e.key]}
              </button>
            ))}
          </div>
        ) : all ? (
          <>
            <div className="start__head">
              <h3>{t.allApps}</h3>
              <button className="start__pill" onClick={() => setAll(false)}>
                <BackGlyph size={12} className="start__flip" /> {t.pinned}
              </button>
            </div>
            <div className="start__list">
              {sorted.map((e) => {
                const name = t.apps[e.key];
                const letter = name[0].toUpperCase();
                const header = letter !== lastLetter;
                lastLetter = letter;
                return (
                  <div key={e.key}>
                    {header && <div className="start__letter">{letter}</div>}
                    <button className="start__item" onClick={() => launch(e)}>
                      <e.Icon size={28} />
                      {name}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="start__head">
              <h3>{t.pinned}</h3>
              <button className="start__pill" onClick={() => setAll(true)}>
                {t.allApps} <ChevronRightGlyph size={12} className="start__flip" />
              </button>
            </div>
            <div className="start__pinned">
              {ENTRIES.map((e) => (
                <button key={e.key} className="start__app" onClick={() => launch(e)}>
                  <e.Icon size={36} />
                  <span>{t.apps[e.key]}</span>
                </button>
              ))}
            </div>
            <div className="start__head">
              <h3>{t.recommended}</h3>
            </div>
            <p className="start__empty">{t.recommendedEmpty}</p>
          </>
        )}
      </div>

      <footer className="start__foot">
        <button className="start__user">
          <span className="start__avatar"><UserGlyph size={18} /></span>
          {t.userName}
        </button>
        <button className="start__power" title={t.startPower} aria-label={t.startPower}><PowerGlyph size={18} /></button>
      </footer>
    </div>
  );
}
