// Writer: shows the document opened from an email (event 5's invoice).
// Its content stays blurred behind a yellow "Enable Content" bar: the macro trap.
import { useOs } from "../osStore";
import { enableContent } from "../../../game/events";
import { ShieldGlyph } from "../icons";
import { useT } from "../../../i18n/strings";

export function WriterApp() {
  const t = useT();
  const s = t.writer;
  const doc = useOs((st) => st.doc);
  return (
    <div className="writer">
      <div className="writer__ribbon">
        <strong dir="ltr">{doc}</strong>
        <nav>
          {s.ribbon.map((r) => <span key={r}>{r}</span>)}
        </nav>
      </div>
      <div className="writer__bar" role="alert">
        <ShieldGlyph size={16} />
        <strong>{s.warnLabel}</strong>
        <span>{s.warn}</span>
        <button onClick={enableContent}>{s.enable}</button>
      </div>
      <div className="writer__desk">
        <div className="writer__page">
          <div className="writer__blur" aria-hidden="true">
            <div className="writer__fake-head" />
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ width: `${55 + ((i * 37) % 45)}%` }} />
            ))}
          </div>
          <div className="writer__lure">
            <strong>{s.lureTitle}</strong>
            <p>{s.lureBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
