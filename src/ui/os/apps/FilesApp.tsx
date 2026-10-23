// File Explorer: ribbon, address bar, navigation pane and folder view.
// Also used for the Recycle Bin (mode="bin").
import { useState } from "react";
import { BackGlyph, ChevronRightGlyph, DocGlyph, DownloadGlyph, FolderIcon, ForwardGlyph, MusicGlyph, PcGlyph, PictureGlyph, SearchGlyph, StarGlyph, UpGlyph, VideoGlyph, BinIcon } from "../icons";
import { useT } from "../../../i18n/strings";

type FolderKey = "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
const FOLDERS: { key: FolderKey; Glyph: (p: { size?: number }) => JSX.Element }[] = [
  { key: "desktop", Glyph: PcGlyph },
  { key: "documents", Glyph: DocGlyph },
  { key: "downloads", Glyph: DownloadGlyph },
  { key: "music", Glyph: MusicGlyph },
  { key: "pictures", Glyph: PictureGlyph },
  { key: "videos", Glyph: VideoGlyph },
];

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
  const [path, setPath] = useState<FolderKey | null>(null); // null = This PC
  const [history, setHistory] = useState<(FolderKey | null)[]>([]);
  const open = (p: FolderKey | null) => {
    setHistory((h) => [...h, path]);
    setPath(p);
  };
  const back = () => {
    if (!history.length) return;
    setPath(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const here = mode === "bin" ? t.apps.bin : path ? t.folders[path] : t.thisPc;
  const items = mode === "bin" ? [] : path ? CONTENTS[path] : FOLDERS;

  return (
    <div className="files">
      <div className="files__ribbon">
        <button className="files__file">{t.ribbon.file}</button>
        <button>{t.ribbon.home}</button>
        <button>{t.ribbon.share}</button>
        <button>{t.ribbon.view}</button>
      </div>
      <div className="files__bar">
        <button className="files__nav" onClick={back} disabled={!history.length} aria-label="Back"><BackGlyph /></button>
        <button className="files__nav" disabled aria-label="Forward"><ForwardGlyph /></button>
        <button className="files__nav" onClick={() => path && open(null)} disabled={!path} aria-label="Up"><UpGlyph /></button>
        <div className="files__crumbs">
          {mode === "bin" ? <BinIcon size={16} /> : <PcGlyph />}
          <ChevronRightGlyph size={12} />
          {mode === "bin" ? <span>{t.apps.bin}</span> : (
            <>
              <button onClick={() => path && open(null)}>{t.thisPc}</button>
              {path && (<><ChevronRightGlyph size={12} /><span>{t.folders[path]}</span></>)}
            </>
          )}
        </div>
        <label className="files__search">
          <input placeholder={t.searchIn(here)} aria-label={t.searchIn(here)} />
          <SearchGlyph size={14} />
        </label>
      </div>

      <div className="files__main">
        <nav className="files__tree">
          <div className="files__tree-head"><StarGlyph size={14} /> {t.quickAccess}</div>
          {FOLDERS.slice(0, 3).concat(FOLDERS[4]).map((f) => (
            <button key={f.key} className={`files__tree-item ${path === f.key && mode === "files" ? "on" : ""}`} onClick={() => mode === "files" && open(f.key)}>
              <f.Glyph size={14} /> {t.folders[f.key]}
            </button>
          ))}
          <div className="files__tree-head"><PcGlyph size={14} /> {t.thisPc}</div>
          {FOLDERS.map((f) => (
            <button key={`pc-${f.key}`} className="files__tree-item files__tree-item--sub" onClick={() => mode === "files" && open(f.key)}>
              <f.Glyph size={14} /> {t.folders[f.key]}
            </button>
          ))}
        </nav>

        <section className="files__view">
          {items.length ? (
            <div className="files__grid">
              {(items as typeof FOLDERS).map((f) => (
                <button key={f.key} className="files__item" onDoubleClick={() => open(f.key)}>
                  <FolderIcon size={56} />
                  <span>{t.folders[f.key]}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="files__empty">{mode === "bin" ? t.binEmpty : t.emptyFolder}</p>
          )}
        </section>
      </div>
      <div className="files__status">{t.items(items.length)}</div>
    </div>
  );
}
