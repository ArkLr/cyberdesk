// A desktop window: title bar (drag to move, double-click to maximize),
// minimize / maximize / close buttons, and the app inside.
import { useContext, useRef, type ReactNode } from "react";
import { useOs, type Win, DESKTOP_W, DESKTOP_H, TASKBAR_H } from "./osStore";
import { APP_ICONS, CloseGlyph, MaxGlyph, MinGlyph, RestoreGlyph } from "./icons";
import { ScaleContext } from "./scale";
import { useT } from "../../i18n/strings";

const TASKMGR_Z = 8995;

export function Window({ win, active, children }: { win: Win; active: boolean; children: ReactNode }) {
  const { focus, close, minimize, toggleMaximize, move } = useOs.getState();
  const scale = useContext(ScaleContext);
  const t = useT();
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const Icon = APP_ICONS[win.app];

  const onPointerDown = (e: React.PointerEvent) => {
    if (win.maximized || (e.target as HTMLElement).closest("button")) return;
    drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // the desktop is scaled, so convert screen pixels back to desktop pixels
    const x = d.x + (e.clientX - d.px) / scale;
    const y = d.y + (e.clientY - d.py) / scale;
    // keep the title bar reachable
    move(win.id, Math.min(Math.max(x, 80 - win.w), DESKTOP_W - 80), Math.min(Math.max(y, 0), DESKTOP_H - TASKBAR_H - 32));
  };
  const onPointerUp = () => (drag.current = null);

  const style = win.maximized
    ? { left: 0, top: 0, width: DESKTOP_W, height: DESKTOP_H - TASKBAR_H, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };
  // Task Manager stays on top, even above a full-screen page
  if (win.app === "taskmgr") style.zIndex = TASKMGR_Z;

  return (
    <section
      className={`win ${active ? "win--active" : ""} ${win.maximized ? "win--max" : ""}`}
      style={style}
      hidden={win.minimized}
      onPointerDown={() => focus(win.id)}
      aria-label={t.apps[win.app]}
    >
      <header
        className="win__bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <Icon size={16} className="win__icon" />
        <span className="win__title">{t.apps[win.app]}</span>
        <div className="win__caps">
          <button className="win__cap" onClick={() => minimize(win.id)} aria-label={t.minimize} title={t.minimize}><MinGlyph /></button>
          <button className="win__cap" onClick={() => toggleMaximize(win.id)} aria-label={win.maximized ? t.restore : t.maximize} title={win.maximized ? t.restore : t.maximize}>
            {win.maximized ? <RestoreGlyph /> : <MaxGlyph />}
          </button>
          <button className="win__cap win__cap--close" onClick={() => close(win.id)} aria-label={t.close} title={t.close}><CloseGlyph /></button>
        </div>
      </header>
      <div className="win__body">{children}</div>
    </section>
  );
}
