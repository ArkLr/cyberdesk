// Start menu: side rail, alphabetical app list, and live tiles.
import { useOs, type AppId } from "./osStore";
import {
  BrowserIcon, CalcIcon, CalendarIcon, DocGlyph, ExplorerIcon, GearGlyph, MailIcon, MenuGlyph,
  PhotosIcon, PictureGlyph, PowerGlyph, SettingsIcon, UserGlyph, WeatherIcon, BinIcon,
} from "./icons";
import { useT } from "../../i18n/strings";

type Entry = { key: keyof ReturnType<typeof useT>["apps"]; Icon: (p: { size?: number }) => JSX.Element; app?: AppId };

export function StartMenu() {
  const open = useOs((s) => s.startOpen);
  const { openApp, notify, setStart } = useOs.getState();
  const t = useT();
  if (!open) return null;

  const entries: Entry[] = [
    { key: "browser", Icon: BrowserIcon, app: "browser" },
    { key: "calculator", Icon: CalcIcon },
    { key: "calendar", Icon: CalendarIcon },
    { key: "files", Icon: ExplorerIcon, app: "files" },
    { key: "mail", Icon: MailIcon, app: "mail" },
    { key: "photos", Icon: PhotosIcon },
    { key: "bin", Icon: BinIcon, app: "bin" },
    { key: "settings", Icon: SettingsIcon },
    { key: "weather", Icon: WeatherIcon },
  ];
  const sorted = [...entries].sort((a, b) => t.apps[a.key].localeCompare(t.apps[b.key]));

  const launch = (e: Entry) => {
    if (e.app) openApp(e.app);
    else {
      setStart(false);
      notify(t.apps[e.key], t.notYet);
    }
  };

  const tiles: { e: Entry; wide?: boolean; tone: string }[] = [
    { e: entries[4], wide: true, tone: "tile--blue" },
    { e: entries[2], tone: "tile--slate" },
    { e: entries[0], tone: "tile--teal" },
    { e: entries[3], tone: "tile--amber" },
    { e: entries[5], tone: "tile--slate" },
  ];
  const tiles2: { e: Entry; wide?: boolean; tone: string }[] = [
    { e: entries[8], wide: true, tone: "tile--sky" },
    { e: entries[7], tone: "tile--slate" },
  ];

  let lastLetter = "";
  return (
    <div className="start" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Start">
      <nav className="start__rail">
        <button className="start__rail-btn" title="Menu"><MenuGlyph /></button>
        <span className="start__spacer" />
        <button className="start__rail-btn" title={t.startUser}><UserGlyph /></button>
        <button className="start__rail-btn" title={t.startDocs}><DocGlyph /></button>
        <button className="start__rail-btn" title={t.startPics}><PictureGlyph /></button>
        <button className="start__rail-btn" title={t.startSettings}><GearGlyph /></button>
        <button className="start__rail-btn" title={t.startPower}><PowerGlyph /></button>
      </nav>

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
                <span className="start__item-icon"><e.Icon size={24} /></span>
                {name}
              </button>
            </div>
          );
        })}
      </div>

      <div className="start__tiles">
        {[{ title: t.startTilesTitle, list: tiles }, { title: t.tilesTitle2, list: tiles2 }].map((g) => (
          <section key={g.title}>
            <h3 className="start__group">{g.title}</h3>
            <div className="start__grid">
              {g.list.map(({ e, wide, tone }) => (
                <button key={e.key} className={`tile ${tone} ${wide ? "tile--wide" : ""}`} onClick={() => launch(e)}>
                  <e.Icon size={wide ? 40 : 34} />
                  <span className="tile__label">{t.apps[e.key]}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
