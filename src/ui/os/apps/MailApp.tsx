// Mail: navigation pane, message list and reading pane.
// What the player does to a message (open the attachment, reply, delete) goes to mailAction().
import { useState } from "react";
import {
  ArchiveGlyph, CloseGlyph, DocGlyph, ExeIcon, FilterGlyph, FlagGlyph, InboxGlyph, JunkGlyph, MailIcon, MenuGlyph,
  PencilGlyph, PhotosIcon, ReplyGlyph, SearchGlyph, SendGlyph, TrashGlyph,
} from "../icons";
import { useOs, shownName, type Mail, type MailFolder } from "../osStore";
import { mailAction, type MailAction } from "../../../game/events";
import { useGame } from "../../../store/gameStore";
import { useT, type Strings } from "../../../i18n/strings";

/** Subject and body of a message, in the current language. Sent replies are "re-<key>". */
function mailText(t: Strings, m: Mail) {
  if (m.key.startsWith("re-")) {
    const orig = t.mails[m.key.slice(3) as keyof Strings["mails"]];
    return { subject: t.re + orig.subject, body: t.replyBody };
  }
  return t.mails[m.key as keyof Strings["mails"]];
}

function Avatar({ name }: { name: string }) {
  return <span className="mail__avatar">{name[0].toUpperCase()}</span>;
}

export function MailApp() {
  const t = useT();
  const lang = useGame((s) => s.lang);
  const mails = useOs((s) => s.mails);
  const showExt = useOs((s) => s.showExt);
  const markRead = useOs((s) => s.markRead);
  const [folder, setFolder] = useState<MailFolder>("inbox");
  const [tab, setTab] = useState<"focused" | "other">("focused");
  const [openId, setOpenId] = useState<string | null>(null);
  const [attMenu, setAttMenu] = useState(false);
  const [props, setProps] = useState(false);
  const [replying, setReplying] = useState(false);
  /** the link under the mouse, shown at the bottom like a real mail app does */
  const [hover, setHover] = useState<string | null>(null);

  const folders = [
    { id: "inbox" as const, label: t.inbox, Icon: InboxGlyph },
    { id: "sent" as const, label: t.sent, Icon: SendGlyph },
    { id: "drafts" as const, label: t.drafts, Icon: DocGlyph },
    { id: "junk" as const, label: t.junk, Icon: JunkGlyph },
    { id: "deleted" as const, label: t.deleted, Icon: TrashGlyph },
  ];
  const current = folders.find((f) => f.id === folder)!;
  const list = tab === "focused" ? mails.filter((m) => m.folder === folder) : [];
  const open = mails.find((m) => m.id === openId && m.folder === folder);
  const unread = (f: MailFolder) => mails.filter((m) => m.folder === f && !m.read).length;

  const locale = lang === "ar" ? "ar-DZ" : "en-GB";
  const when = (ms: number) => {
    const d = new Date(ms);
    return d.toDateString() === new Date().toDateString()
      ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString(locale, { day: "numeric", month: "short" });
  };

  const select = (m: Mail) => {
    setOpenId(m.id);
    setAttMenu(false);
    setProps(false);
    setReplying(false);
    setHover(null);
    markRead(m.id);
  };
  const act = (m: Mail, action: MailAction) => {
    setAttMenu(false);
    setReplying(false);
    setHover(null);
    if (action === "delete") setOpenId(null);
    mailAction(m, action);
  };

  return (
    <div className="mail" onClick={() => setAttMenu(false)}>
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
            {unread(f.id) > 0 && <b className="mail__count">{unread(f.id)}</b>}
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
        {list.length ? (
          <div className="mail__items">
            {list.map((m) => {
              const text = mailText(t, m);
              return (
                <button
                  key={m.id}
                  className={`mail__item ${m.read ? "" : "mail__item--unread"} ${open?.id === m.id ? "mail__item--on" : ""}`}
                  onClick={() => select(m)}
                  onKeyDown={(e) => e.key === "Delete" && act(m, "delete")}
                >
                  <Avatar name={m.from} />
                  <span className="mail__item-text">
                    <span className="mail__item-top">
                      <strong>{m.from}</strong>
                      <small>{when(m.time)}</small>
                    </span>
                    <span className="mail__item-subject">{text.subject}</span>
                    <span className="mail__item-preview">{text.body.split("\n").find((l) => l.trim() && l.length > 12)}</span>
                    {m.attachment && <span className="mail__item-att"><PhotosIcon size={14} /> <span dir="ltr">{shownName(m.attachment.name, showExt)}</span></span>}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mail__empty">
            <MailIcon size={72} />
            <strong>{t.caughtUp}</strong>
            <span>{t.caughtUpSub}</span>
          </div>
        )}
      </section>

      <section className="mail__read">
        <div className="mail__toolbar">
          <button disabled={!open || folder === "sent"} onClick={() => setReplying(true)} title={t.reply} aria-label={t.reply}><ReplyGlyph /> {t.reply}</button>
          <button disabled={!open} onClick={() => open && act(open, "delete")} title={t.cmd.delete} aria-label={t.cmd.delete}><TrashGlyph /> {t.cmd.delete}</button>
          <span aria-hidden="true"><ArchiveGlyph /></span>
          <span aria-hidden="true"><FlagGlyph /></span>
        </div>
        {open ? (
          <article className="mail__msg">
            <h2>{mailText(t, open).subject}</h2>
            <div className="mail__from">
              <Avatar name={open.from} />
              <span>
                <strong>{open.from}</strong> <span className="mail__addr" dir="ltr">&lt;{open.address}&gt;</span>
                <small>{t.to}: you@arcmail.example · {when(open.time)}</small>
              </span>
            </div>

            {open.attachment && (
              <div className="mail__att-wrap">
                <button
                  className="mail__att"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAttMenu((v) => !v);
                  }}
                  onDoubleClick={() => act(open, "openAttachment")}
                >
                  <PhotosIcon size={32} />
                  <span>
                    <strong dir="ltr">{shownName(open.attachment.name, showExt)}</strong>
                    <small>{open.attachment.size}</small>
                  </span>
                </button>
                {attMenu && (
                  <div className="ctx mail__att-menu" role="menu" onClick={(e) => e.stopPropagation()}>
                    <button role="menuitem" className="ctx__item ctx__item--bold" onClick={() => act(open, "openAttachment")}>{t.attOpen}</button>
                    <button role="menuitem" className="ctx__item" onClick={() => { setAttMenu(false); setProps(true); }}>{t.attProps}</button>
                  </div>
                )}
              </div>
            )}

            <div className="mail__body">
              {mailText(t, open).body.split("\n").map((line, i) =>
                line === "{link}" && open.link ? (
                  <p key={i}>
                    <a
                      className="mail__link"
                      href={`http://${open.link}`}
                      onMouseEnter={() => setHover(`http://${open.link}?ref=acc-88213`)}
                      onMouseLeave={() => setHover(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        act(open, "openLink");
                      }}
                    >
                      {t.bankLink}
                    </a>
                  </p>
                ) : line ? (
                  <p key={i}>{line}</p>
                ) : (
                  <br key={i} />
                ),
              )}
            </div>

            {replying && <Reply mail={open} onSend={() => act(open, "reply")} onDiscard={() => setReplying(false)} />}
          </article>
        ) : (
          <div className="mail__read-empty">
            <MailIcon size={96} className="mail__read-icon" />
            <strong>{t.readingEmpty}</strong>
            <span>{t.readingEmptySub}</span>
          </div>
        )}

        {hover && <div className="mail__status"><span dir="ltr">{hover}</span></div>}

        {props && open?.attachment && (
          <div className="props" role="dialog" aria-label={t.props(open.attachment.name)}>
            <header>
              <span dir="ltr">{t.props(open.attachment.name)}</span>
              <button onClick={() => setProps(false)} aria-label={t.close}><CloseGlyph /></button>
            </header>
            <div className="props__name">
              <ExeIcon size={40} />
              <strong dir="ltr">{open.attachment.name}</strong>
            </div>
            <dl>
              <dt>{t.propType}</dt>
              <dd className="props__warn">{t.propApp}</dd>
              <dt>{t.propOpensWith}</dt>
              <dd>{t.propItself}</dd>
              <dt>{t.propSize}</dt>
              <dd>{open.attachment.size}</dd>
            </dl>
            <button className="props__ok" onClick={() => setProps(false)}>{t.ok}</button>
          </div>
        )}
      </section>
    </div>
  );
}

function Reply({ mail, onSend, onDiscard }: { mail: Mail; onSend: () => void; onDiscard: () => void }) {
  const t = useT();
  const [text, setText] = useState(t.replyBody);
  return (
    <div className="mail__reply">
      <div className="mail__reply-to">{t.to}: <span dir="ltr">{mail.address}</span></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} aria-label={t.reply} />
      <div className="mail__reply-actions">
        <button className="mail__send" onClick={onSend}><SendGlyph /> {t.send}</button>
        <button className="mail__discard" onClick={onDiscard}>{t.discard}</button>
      </div>
    </div>
  );
}
