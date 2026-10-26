// The phone's call screen: incoming (answer / decline), in a call (what is said, answers to pick, hang up), ended.
import { useEffect, useState } from "react";
import { usePhone } from "./phoneStore";
import { answerCall, hangUp, pickOption } from "../game/events";
import { PhoneGlyph, UserGlyph } from "./os/icons";
import { useT } from "../i18n/strings";

function useTimer(since: number, on: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [on]);
  const s = Math.max(0, Math.floor((now - since) / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function CallScreen() {
  const t = useT();
  const c = t.calls;
  const call = usePhone((s) => s.call);
  const timer = useTimer(call?.since ?? 0, call?.state === "active" && !call.status);

  // an ended call closes by itself after a moment
  useEffect(() => {
    if (call?.state !== "ended") return;
    const id = setTimeout(() => usePhone.getState().call?.id === call.id && usePhone.getState().clearCall(), 3000);
    return () => clearTimeout(id);
  }, [call?.state, call?.id]);

  if (!call) return null;
  const known = call.who !== call.number;
  const line = (k: string) => c[k as keyof typeof c] as string;
  const status =
    call.state === "ringing" ? c.incoming
    : call.state === "ended" ? (call.status ? line(call.status) : c.ended)
    : call.status ? line(call.status)
    : timer;

  return (
    <div className={`call call--${call.state}`}>
      <div className="call__head">
        {/* a number that isn't a contact shows once, with a generic avatar */}
        <span className="call__avatar" aria-hidden="true">{known ? call.who[0] : <UserGlyph size={36} />}</span>
        <strong dir={known ? "auto" : "ltr"}>{call.who}</strong>
        {known && <span className="call__number" dir="ltr">{call.number}</span>}
        <small dir={status === timer ? "ltr" : undefined}>{status}</small>
      </div>

      <div className="call__lines">
        {call.lines.map((l, i) => (
          <p key={i} className={l.me ? "call__me" : "call__them"}>{line(l.key)}</p>
        ))}
      </div>

      {call.options.length > 0 && (
        <div className="call__options">
          {call.options.map((o) => (
            <button key={o} onClick={() => pickOption(o)}>{line(o)}</button>
          ))}
        </div>
      )}

      <div className="call__actions">
        {call.state === "ringing" && (
          <>
            <button className="call__btn call__btn--end" onClick={hangUp} aria-label={c.decline}><PhoneGlyph size={24} /></button>
            <button className="call__btn call__btn--answer" onClick={answerCall} aria-label={c.answer}><PhoneGlyph size={24} /></button>
          </>
        )}
        {call.state === "active" && (
          <button className="call__btn call__btn--end" onClick={hangUp} aria-label={c.hangUp}><PhoneGlyph size={24} /></button>
        )}
      </div>
    </div>
  );
}
