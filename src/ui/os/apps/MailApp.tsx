// Mail: navigation pane, message list and reading pane.
// Empty for now; the email events in the next step fill the inbox.
import { useState } from "react";
import {
  ArchiveGlyph, DocGlyph, FilterGlyph, FlagGlyph, InboxGlyph, JunkGlyph, MailIcon, MenuGlyph,
  PencilGlyph, ReplyGlyph, SearchGlyph, SendGlyph, TrashGlyph,
} from "../icons";
import { useT } from "../../../i18n/strings";

export function MailApp() {
  const t = useT();
  const [folder, setFolder] = useState("inbox");
  const [tab, setTab] = useState<"focused" | "other">("focused");
  const folders = [
    { id: "inbox", label: t.inbox, Icon: InboxGlyph },
    { id: "sent", label: t.sent, Icon: SendGlyph },
    { id: "drafts", label: t.drafts, Icon: DocGlyph },
    { id: "junk", label: t.junk, Icon: JunkGlyph },
  ];
  const current = folders.find((f) => f.id === folder)!;

  return (
    <div className="mail">
      <aside className="mail__nav">
        <button className="mail__burger" aria-label="Menu"><MenuGlyph /></button>
        <button className="mail__new"><PencilGlyph /> {t.newMail}</button>

        <div className="mail__account">
          <span className="mail__avatar">A</span>
          <span>
            <strong>Arc Mail</strong>
            <small>you@arcmail.example</small>
          </span>
        </div>

        <div className="mail__section">{t.mailFolders}</div>
        {folders.map((f) => (
          <button key={f.id} className={`mail__folder ${folder === f.id ? "mail__folder--on" : ""}`} onClick={() => setFolder(f.id)}>
            <f.Icon /> <span>{f.label}</span>
          </button>
        ))}
      </aside>

      <section className="mail__list">
        <div className="mail__list-top">
          <label className="mail__search">
            <SearchGlyph size={14} />
            <input placeholder={t.searchMail} aria-label={t.searchMail} />
          </label>
        </div>
        <div className="mail__list-head">
          <h2 className="mail__heading">{current.label}</h2>
          <button className="mail__icon-btn" title={t.mailFilter} aria-label={t.mailFilter}><FilterGlyph /></button>
        </div>
        <div className="mail__tabs" role="tablist">
          <button role="tab" aria-selected={tab === "focused"} className={tab === "focused" ? "on" : ""} onClick={() => setTab("focused")}>{t.focused}</button>
          <button role="tab" aria-selected={tab === "other"} className={tab === "other" ? "on" : ""} onClick={() => setTab("other")}>{t.other}</button>
        </div>
        <div className="mail__empty">
          <MailIcon size={72} />
          <strong>{t.caughtUp}</strong>
          <span>{t.caughtUpSub}</span>
        </div>
      </section>

      <section className="mail__read">
        <div className="mail__toolbar" aria-hidden="true">
          <span><ReplyGlyph /></span>
          <span><ArchiveGlyph /></span>
          <span><FlagGlyph /></span>
          <span><TrashGlyph /></span>
        </div>
        <div className="mail__read-empty">
          <MailIcon size={96} className="mail__read-icon" />
          <strong>{t.readingEmpty}</strong>
          <span>{t.readingEmptySub}</span>
        </div>
      </section>
    </div>
  );
}
