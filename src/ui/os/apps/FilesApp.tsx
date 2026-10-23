// File Explorer: address bar, command bar, navigation pane and folder view.
// Also used for the Recycle Bin (mode="bin").
import { useState } from "react";
import {
  BackGlyph, BinIcon, ChevronRightGlyph, CopyGlyph, CutGlyph, DriveIcon, FOLDER_ICONS, ForwardGlyph,
  HomeGlyph, MoreGlyph, PasteGlyph, PcGlyph, PlusGlyph, ReloadGlyph, RenameGlyph, RestoreItemsGlyph,
  SearchGlyph, ShareGlyph, SortGlyph, TrashGlyph, UpGlyph, ViewGlyph,
} from "../icons";
import { useOs } from "../osStore";
import { useT } from "../../../i18n/strings";

type FolderKey = keyof typeof FOLDER_ICONS;
const FOLDERS: FolderKey[] = ["desktop", "downloads", "documents", "pictures", "music", "videos"];

/** What's inside each folder. Empty for now; the download events will add files here. */
const CONTENTS: Record<FolderKey, string[]> = {
  desktop: [],
  documents: [],
  downloads: [],
  music: [],
  pictures: [],
  videos: [],
};

export function FilesApp({ mode = "files" }: { mode?: "files" | "bin" }) {
  const t = useT();
  const openApp = useOs((s) => s.openApp);
  const [path, setPath] = useState<FolderKey | null>(null); // null = This PC
  const [history, setHistory] = useState<(FolderKey | null)[]>([]);
  const open = (p: FolderKey | null) => {
    if (p === path) return;
    setHistory((h) => [...h, path]);
    setPath(p);
  };
  const back = () => {
    if (!history.length) return;
    setPath(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const bin = mode === "bin";
  const here = bin ? t.apps.bin : path ? t.folders[path] : t.thisPc;
  const count = bin ? 0 : path ? CONTENTS[path].length : FOLDERS.length + 1;
  const HereIcon = path ? FOLDER_ICONS[path] : null;

  // the command bar: the usual commands, greyed out because nothing is selected
  const commands = bin
    ? [{ label: t.cmd.emptyBin, Glyph: TrashGlyph }, { label: t.cmd.restoreAll, Glyph: RestoreItemsGlyph }]
    : null;

  return (
    <div className="files">
      <div className="files__bar">
        <button className="files__nav" onClick={back} disabled={!history.length} aria-label="Back"><BackGlyph /></button>
        <button className="files__nav" disabled aria-label="Forward"><ForwardGlyph /></button>
        <button className="files__nav" onClick={() => path && open(null)} disabled={bin || !path} aria-label="Up"><UpGlyph /></button>
        <button className="files__nav" aria-label="Refresh"><ReloadGlyph /></button>
        <div className="files__crumbs">
          {bin ? <BinIcon size={18} /> : HereIcon ? <HereIcon size={18} /> : <PcGlyph />}
          <ChevronRightGlyph size={12} className="files__chev" />
          {bin ? <span>{t.apps.bin}</span> : (
            <>
              <button onClick={() => path && open(null)}>{t.thisPc}</button>
              {path && (<><ChevronRightGlyph size={12} className="files__chev" /><span>{t.folders[path]}</span></>)}
            </>
          )}
        </div>
        <label className="files__search">
          <SearchGlyph size={14} />
          <input placeholder={t.searchIn(here)} aria-label={t.searchIn(here)} />
        </label>
      </div>

      <div className="files__cmds">
        {commands ? (
          commands.map((c) => (
            <button key={c.label} className="files__cmd" disabled><c.Glyph /> {c.label}</button>
          ))
        ) : (
          <>
            <button className="files__cmd files__cmd--new"><PlusGlyph /> {t.cmd.new}</button>
            <span className="files__sep" />
            {[
              { label: t.cmd.cut, Glyph: CutGlyph },
              { label: t.cmd.copy, Glyph: CopyGlyph },
              { label: t.cmd.paste, Glyph: PasteGlyph },
              { label: t.cmd.rename, Glyph: RenameGlyph },
              { label: t.cmd.share, Glyph: ShareGlyph },
              { label: t.cmd.delete, Glyph: TrashGlyph },
            ].map((c) => (
              <button key={c.label} className="files__cmd files__cmd--icon" disabled title={c.label} aria-label={c.label}><c.Glyph /></button>
            ))}
            <span className="files__sep" />
            <button className="files__cmd"><SortGlyph /> {t.cmd.sort}</button>
            <button className="files__cmd"><ViewGlyph /> {t.cmd.view}</button>
          </>
        )}
        <button className="files__cmd files__cmd--icon" aria-label="More"><MoreGlyph /></button>
      </div>

      <div className="files__main">
        <nav className="files__tree">
          <button className={`files__tree-item ${!bin && !path ? "on" : ""}`} onClick={() => (bin ? openApp("files") : open(null))}>
            <HomeGlyph size={15} /> {t.home}
          </button>
          <span className="files__tree-sep" />
          {FOLDERS.map((f) => {
            const Icon = FOLDER_ICONS[f];
            return (
              <button key={f} className={`files__tree-item ${!bin && path === f ? "on" : ""}`} onClick={() => !bin && open(f)}>
                <Icon size={18} /> {t.folders[f]}
              </button>
            );
          })}
          <span className="files__tree-sep" />
          <button className="files__tree-item" onClick={() => !bin && open(null)}><PcGlyph size={15} /> {t.thisPc}</button>
          <button className={`files__tree-item ${bin ? "on" : ""}`} onClick={() => openApp("bin")}><BinIcon size={18} /> {t.apps.bin}</button>
        </nav>

        <section className="files__view">
          {bin ? (
            <div className="files__empty">
              <BinIcon size={96} />
              <span>{t.binEmpty}</span>
            </div>
          ) : !path ? (
            <>
              <h3 className="files__group">{t.foldersTitle}</h3>
              <div className="files__grid">
                {FOLDERS.map((f) => {
                  const Icon = FOLDER_ICONS[f];
                  return (
                    <button key={f} className="files__item" onDoubleClick={() => open(f)} onKeyDown={(e) => e.key === "Enter" && open(f)}>
                      <Icon size={64} />
                      <span>{t.folders[f]}</span>
                    </button>
                  );
                })}
              </div>
              <h3 className="files__group">{t.drivesTitle}</h3>
              <button className="files__drive">
                <DriveIcon size={52} />
                <span className="files__drive-info">
                  <strong>{t.localDisk}</strong>
                  <span className="files__meter"><i style={{ width: "53%" }} /></span>
                  <small>{t.diskFree}</small>
                </span>
              </button>
            </>
          ) : CONTENTS[path].length ? null : (
            <div className="files__empty">
              {HereIcon && <HereIcon size={96} />}
              <span>{t.emptyFolder}</span>
            </div>
          )}
        </section>
      </div>
      <div className="files__status">{t.items(count)}</div>
    </div>
  );
}
