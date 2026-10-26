// ArcBank's sign-in page for event 3, in two versions that look almost the same:
// the real arcbank.dz, and the look-alike on arcbank-verify-account.com the email links to.
import { useState } from "react";
import { phishLogin } from "../../../game/events";
import { LockGlyph } from "../icons";
import { useT } from "../../../i18n/strings";

function BankPage({ fake }: { fake: boolean }) {
  const t = useT();
  const s = t.bankSite;
  const [checked, setChecked] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fake) phishLogin();
    else setChecked(true);
  };

  return (
    <div className="bank">
      <header className="bank__top">
        <span className="bank__logo" dir="ltr"><i>A</i>ArcBank</span>
        <nav className="bank__nav">
          {s.nav.map((n) => <span key={n}>{n}</span>)}
        </nav>
      </header>
      {fake && <div className="bank__warn">⚠ {s.suspended}</div>}
      <main className="bank__main">
        <form className="bank__card" onSubmit={submit}>
          <h1>{fake ? s.verifyTitle : s.loginTitle}</h1>
          {checked ? (
            <p className="bank__ok">✓ {s.fine}</p>
          ) : (
            <>
              <label>
                {s.id}
                <input defaultValue="0457 8812" dir="ltr" />
              </label>
              <label>
                {s.password}
                <input type="password" defaultValue="arcuser2026" dir="ltr" />
              </label>
              <button className="bank__btn" type="submit">{fake ? s.verify : s.signIn}</button>
              <span className="bank__forgot">{s.forgot}</span>
            </>
          )}
        </form>
        <aside className="bank__side">
          <LockGlyph size={22} />
          <p>{fake ? s.fakeSide : s.never}</p>
        </aside>
      </main>
      <footer className="bank__foot">{s.footer}</footer>
    </div>
  );
}

export const BankSite = () => <BankPage fake={false} />;
export const PhishSite = () => <BankPage fake />;
