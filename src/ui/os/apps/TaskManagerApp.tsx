// Task Manager: the running apps, and "End task". The way out of event 6's full-screen scam page.
import { useState } from "react";
import { useOs, type AppId } from "../osStore";
import { APP_ICONS } from "../icons";
import { SCAM_URL, endTask } from "../../../game/events";
import { useT } from "../../../i18n/strings";

export function TaskManagerApp() {
  const t = useT();
  const s = t.taskmgr;
  const windows = useOs((st) => st.windows);
  const url = useOs((st) => st.browserUrl);
  const [sel, setSel] = useState<AppId | null>(null);
  const apps: AppId[] = [...new Set(windows.map((w) => w.app))].filter((a) => a !== "taskmgr");
  // the scam page keeps the browser busy
  const stuck = (a: AppId) => a === "browser" && url === SCAM_URL;

  return (
    <div className="tm">
      <div className="tm__head">
        <span>{s.name}</span>
        <span>{s.status}</span>
        <span>{s.cpu}</span>
        <span>{s.memory}</span>
      </div>
      <div className="tm__rows" role="listbox" aria-label={t.apps.taskmgr}>
        {apps.length === 0 && <p className="tm__empty">{s.empty}</p>}
        {apps.map((a, i) => {
          const Icon = APP_ICONS[a];
          return (
            <button
              key={a}
              role="option"
              aria-selected={sel === a}
              className={`tm__row ${sel === a ? "tm__row--on" : ""}`}
              onClick={() => setSel(a)}
              onDoubleClick={() => endTask(a)}
            >
              <span className="tm__name"><Icon size={18} /> {t.apps[a]}</span>
              <span className={stuck(a) ? "tm__bad" : ""}>{stuck(a) ? s.notResponding : s.running}</span>
              <span dir="ltr" className={stuck(a) ? "tm__bad" : ""}>{stuck(a) ? "97%" : `${(i * 3 + 1) % 7}%`}</span>
              <span dir="ltr">{stuck(a) ? "1,812 MB" : `${120 + i * 85} MB`}</span>
            </button>
          );
        })}
      </div>
      <div className="tm__foot">
        <button
          disabled={!sel || !apps.includes(sel)}
          onClick={() => {
            if (sel) endTask(sel);
            setSel(null);
          }}
        >
          {s.endTask}
        </button>
      </div>
    </div>
  );
}
