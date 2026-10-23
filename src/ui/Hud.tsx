// Everything drawn on top of the 3D view that isn't a device screen.
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGame } from "../store/gameStore";
import { useT } from "../i18n/strings";

export function Loader() {
  const loaded = useGame((s) => s.loaded);
  const { progress } = useProgress();
  const t = useT();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => setGone(true), 700);
    return () => clearTimeout(id);
  }, [loaded]);
  if (gone) return null;
  return (
    <div className={`loader ${loaded ? "loader--out" : ""}`}>
      <div className="loader__bar"><span style={{ width: `${Math.max(6, progress)}%` }} /></div>
      <div className="loader__label">{t.loading}</div>
    </div>
  );
}

export function LanguageSwitch() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  return (
    <div className="lang" role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
      <button className={lang === "ar" ? "on" : ""} onClick={() => setLang("ar")} lang="ar">عربي</button>
    </div>
  );
}

/**
 * Arrow buttons to switch device. The phone sits to the LEFT of the keyboard,
 * so "left" always means phone and "right" always means computer, in both languages.
 */
export function ViewArrows() {
  const view = useGame((s) => s.view);
  const moving = useGame((s) => s.moving);
  const t = useT();
  return (
    <>
      <button
        className={`arrow arrow--left ${view === "pc" && !moving ? "" : "arrow--hidden"}`}
        onClick={() => useGame.getState().goTo("phone")}
        aria-label={t.toPhone}
      >
        <span className="arrow__key" aria-hidden="true">←</span>
        <span>{t.toPhone}</span>
      </button>
      <button
        className={`arrow arrow--right ${view === "phone" && !moving ? "" : "arrow--hidden"}`}
        onClick={() => useGame.getState().goTo("pc")}
        aria-label={t.toPc}
      >
        <span className="arrow__key" aria-hidden="true">→</span>
        <span>{t.toPc}</span>
      </button>
    </>
  );
}
