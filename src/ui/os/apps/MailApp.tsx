// Mail: folders, message list and reading pane.
// Empty for now; the email events in the next step fill the inbox.
import { useState } from "react";
import { InboxGlyph, JunkGlyph, PencilGlyph, SearchGlyph, SendGlyph, DocGlyph, UserGlyph, MailIcon } from "../icons";
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
        <button className="mail__new"><PencilGlyph /> {t.newMail}</button>
        <div className="mail__section">{t.mailAccounts}</div>
        <div className="mail__account">
          <span className="mail__avatar"><UserGlyph /></span>
          <span>
            <strong>Nova Mail</strong>
            <small>you@novamail.example</small>
          </span>
        </div>
        <div className="mail__section">{t.mailFolders}</div>
        {folders.map((f) => (
          <button key={f.id} className={`mail__folder ${folder === f.id ? "mail__folder--on" : ""}`} onClick={() => setFolder(f.id)}>
            <f.Icon /> {f.label}
          </button>
        ))}
      </aside>

      <section className="mail__list">
        <div className="mail__search">
          <SearchGlyph size={14} />
          <input placeholder={t.searchMail} aria-label={t.searchMail} />
        </div>
        <h2 className="mail__heading">{current.label}</h2>
        <div className="mail__tabs" role="tablist">
          <button role="tab" aria-selected={tab === "focused"} className={tab === "focused" ? "on" : ""} onClick={() => setTab("focused")}>{t.focused}</button>
          <button role="tab" aria-selected={tab === "other"} className={tab === "other" ? "on" : ""} onClick={() => setTab("other")}>{t.other}</button>
        </div>
        <div className="mail__empty">
          <MailIcon size={56} />
          <strong>{t.caughtUp}</strong>
          <span>{t.caughtUpSub}</span>
        </div>
      </section>

      <section className="mail__read">
        <span>{t.readingEmpty}</span>
      </section>
    </div>
  );
}
