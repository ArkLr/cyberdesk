// The game's cards on top of the 3D view: intro, feedback after each event, final results.
// Also starts each event (GameDirector), so the OS and phone stay free of game logic.
import { useEffect } from "react";
import { useFlow, type Result } from "../game/flow";
import { EVENTS, EVENT_COUNT, MAX_SCORE, grade } from "../game/events";
import { useGame } from "../store/gameStore";
import { useT } from "../i18n/strings";

/** Starts the current event a moment after it becomes current, on the right device. */
export function GameDirector() {
  const phase = useFlow((s) => s.phase);
  const index = useFlow((s) => s.index);
  useEffect(() => {
    if (phase !== "event") return;
    const ev = EVENTS[index];
    useGame.getState().goTo(ev.device);
    const id = setTimeout(ev.start, 1500);
    return () => clearTimeout(id);
  }, [phase, index]);
  return null;
}

const verdictOf = (r: Result) => (r.points >= 10 ? "safe" : r.points > 0 ? "partly" : "risky");

function Intro() {
  const t = useT().game;
  return (
    <div className="card card--intro" role="dialog" aria-labelledby="intro-title">
      <h1 id="intro-title">{t.introTitle}</h1>
      <p className="card__lead">{t.introLead}</p>
      <p>{t.introBody}</p>
      <p className="card__hint">{t.introHint}</p>
      <button className="card__btn" onClick={() => useFlow.getState().start()} autoFocus>{t.start}</button>
    </div>
  );
}

function Feedback({ result }: { result: Result }) {
  const t = useT();
  const index = useFlow((s) => s.index);
  const ev = t.events[result.event];
  const verdict = verdictOf(result);
  const isLast = index === EVENTS.length - 1;
  return (
    <div className="card" role="dialog" aria-labelledby="fb-title">
      <div className="card__kicker">{t.game.eventOf(index + 1, EVENT_COUNT)}</div>
      <h2 id="fb-title">{ev.title}</h2>
      <div className={`card__verdict card__verdict--${verdict}`}>
        <span>{t.game.verdict[verdict]}</span>
        <b>{t.game.points(result.points)}</b>
      </div>
      <h3>{t.game.youDid}</h3>
      <p>
        {ev.did[result.choice as keyof typeof ev.did]} {ev.outcome[result.choice as keyof typeof ev.outcome]}
      </p>
      <h3>{t.game.redFlags}</h3>
      <ul className="card__flags">
        {ev.flags.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <h3>{t.game.habit}</h3>
      <p className="card__habit">{ev.habit}</p>
      <button className="card__btn" onClick={() => useFlow.getState().next()} autoFocus>
        {isLast ? t.game.seeResults : t.game.next}
      </button>
    </div>
  );
}

function Results({ results }: { results: Result[] }) {
  const t = useT();
  const score = results.reduce((s, r) => s + r.points, 0);
  const g = grade(score);
  return (
    <div className="card card--results" role="dialog" aria-labelledby="res-title">
      <h2 id="res-title">{t.game.resultsTitle}</h2>
      <div className="card__grade">
        <span className={`card__letter card__letter--${g}`}>{g}</span>
        <span>
          <strong>{t.game.score(score, MAX_SCORE)}</strong>
          <small>{t.game.gradeLines[g]}</small>
        </span>
      </div>
      <h3>{t.game.review}</h3>
      <ol className="card__review">
        {results.map((r) => {
          const ev = t.events[r.event];
          const verdict = verdictOf(r);
          return (
            <li key={r.event} className={`card__row card__row--${verdict}`}>
              <span className="card__mark" aria-label={t.game.verdict[verdict]}>{r.points >= 10 ? "✓" : "✗"}</span>
              <span>
                <strong>{ev.title}</strong>
                <small>{ev.did[r.choice as keyof typeof ev.did]}</small>
                <small className="card__row-habit">{ev.habit}</small>
              </span>
              <b dir="ltr">{r.points}</b>
            </li>
          );
        })}
      </ol>
      <h3>{t.game.rulesTitle}</h3>
      <ol className="card__rules">
        {t.game.rules.map((rule) => <li key={rule}>{rule}</li>)}
      </ol>
      <button className="card__btn" onClick={() => location.reload()}>{t.game.playAgain}</button>
    </div>
  );
}

/** "Event 2 / 7" at the top of the page while playing, one segment per event. */
export function Progress() {
  const t = useT();
  const phase = useFlow((s) => s.phase);
  const index = useFlow((s) => s.index);
  const results = useFlow((s) => s.results);
  if (phase === "intro" || phase === "end") return null;
  return (
    <div className="progress" aria-label={t.game.eventOf(index + 1, EVENT_COUNT)}>
      <span className="progress__label">
        {t.game.progress} <b>{index + 1} / {EVENT_COUNT}</b>
      </span>
      <span className="progress__bar" aria-hidden="true">
        {Array.from({ length: EVENT_COUNT }, (_, i) => (
          <i key={i} className={results[i] ? `progress__seg--${verdictOf(results[i])}` : i === index ? "progress__seg--now" : ""} />
        ))}
      </span>
    </div>
  );
}

export function GameOverlay() {
  const phase = useFlow((s) => s.phase);
  const results = useFlow((s) => s.results);
  const last = useFlow((s) => s.last());
  const loaded = useGame((s) => s.loaded);

  let card: JSX.Element | null = null;
  if (phase === "intro" && loaded) card = <Intro />;
  else if (phase === "feedback" && last) card = <Feedback result={last} />;
  else if (phase === "end") card = <Results results={results} />;
  if (!card) return null;

  return <div className="overlay">{card}</div>;
}
