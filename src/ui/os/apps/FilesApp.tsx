// File Explorer: address bar, command bar, navigation pane and folder view.
// Also used for the Recycle Bin (mode="bin").
import { useContext, useEffect, useRef, useState } from "react";
import {
  BackGlyph, BinIcon, ChevronRightGlyph, CopyGlyph, CutGlyph, DocGlyph, DriveIcon, ExeIcon, FOLDER_ICONS, ForwardGlyph,
  HomeGlyph, MoreGlyph, PasteGlyph, PcGlyph, PlusGlyph, ReloadGlyph, RenameGlyph, RestoreItemsGlyph,
  PictureGlyph, SearchGlyph, ShareGlyph, ShieldGlyph, SortGlyph, TrashGlyph, UpGlyph, ViewGlyph,
} from "../icons";
import { useOs, shownName, type FolderKey, type OsFile } from "../osStore";
import { ScaleContext } from "../scale";
import { fileAction, type FileAction } from "../../../game/events";
import { useT } from "../../../i18n/strings";

const FOLDERS: FolderKey[] = ["desktop", "downloads", "documents", "pictures", "music", "videos"];

function FileIcon({ file, size }: { file: OsFile; size: number }) {
  if (file.kind === "exe") return <ExeIcon size={size} />;
  const Glyph = file.kind === "image" ? PictureGlyph : DocGlyph;
  return <Glyph size={size} />;
}

export function FilesApp({ mode = "files" }: { mode?: "files" | "bin" }) {
  const t = useT();
  const openApp = useOs((s) => s.openApp);
  const allFiles = useOs((s) => s.files);
  const folderRequest = useOs((s) => s.folderRequest);
  const scale = useContext(ScaleContext);
  const root = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<FolderKey | null>(mode === "files" ? folderRequest?.folder ?? null : null); // null = This PC
  const [history, setHistory] = useState<(FolderKey | null)[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; file: OsFile } | null>(null);
  const [viewMenu, setViewMenu] = useState(false);
  const showExt = useOs((s) => s.showExt);
  const open = (p: FolderKey | null) => {
    setSelected(null);
    if (p === path) return;
    setHistory((h) => [...h, path]);
    setPath(p);
  };

  // "Show in folder" from the browser
  useEffect(() => {
    if (mode === "files" && folderRequest) open(folderRequest.folder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderRequest?.n]);
  const back = () => {
    if (!history.length) return;
    setPath(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const bin = mode === "bin";
  const here = bin ? t.apps.bin : path ? t.folders[path] : t.thisPc;
  const files = bin ? allFiles.filter((f) => f.deleted) : allFiles.filter((f) => !f.deleted && f.folder === path);
  const count = bin || path ? files.length : FOLDERS.length + 1;
  const selectedFile = files.find((f) => f.id === selected);

  const act = (file: OsFile, action: FileAction) => {
    setMenu(null);
    setSelected(null);
    fileAction(file, action);
  };
  const openMenu = (e: React.MouseEvent, file: OsFile) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(file.id);
    // the desktop is scaled, so convert screen pixels back to desktop pixels
    const r = root.current!.getBoundingClientRect();
    setMenu({ x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale, file });
  };
  const HereIcon = path ? FOLDER_ICONS[path] : null;

  // the command bar: the usual commands, greyed out because nothing is selected
  const commands = bin
    ? [{ label: t.cmd.emptyBin, Glyph: TrashGlyph }, { label: t.cmd.restoreAll, Glyph: RestoreItemsGlyph }]
    : null;

  return (
    <div className="files" ref={root} onClick={() => { setMenu(null); setViewMenu(false); }} onContextMenu={(e) => e.preventDefault()}>
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
            ].map((c) => (
              <button key={c.label} className="files__cmd files__cmd--icon" disabled title={c.label} aria-label={c.label}><c.Glyph /></button>
            ))}
            <button
              className="files__cmd files__cmd--icon"
              disabled={!selectedFile}
              onClick={() => selectedFile && act(selectedFile, "delete")}
              title={t.cmd.delete}
              aria-label={t.cmd.delete}
            >
              <TrashGlyph />
            </button>
            <span className="files__sep" />
            <button className="files__cmd"><SortGlyph /> {t.cmd.sort}</button>
            <span className="files__view-wrap">
              <button
                className="files__cmd"
                aria-expanded={viewMenu}
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMenu((v) => !v);
                }}
              >
                <ViewGlyph /> {t.cmd.view}
              </button>
              {viewMenu && (
                <div className="ctx files__view-menu" role="menu" onClick={(e) => e.stopPropagation()}>
                  <div className="ctx__label">{t.viewMenu.show}</div>
                  <button role="menuitemcheckbox" aria-checked={showExt} className="ctx__item" onClick={() => useOs.getState().setShowExt(!showExt)}>
                    <span className="ctx__check">{showExt ? "✓" : ""}</span> {t.viewMenu.ext}
                  </button>
                </div>
              )}
            </span>
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
          {(bin || path) && files.length ? (
            <div className="files__grid">
              {files.map((f) => (
                <button
                  key={f.id}
                  className={`files__item files__file ${selected === f.id ? "files__item--on" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenu(null);
                    setSelected(f.id);
                  }}
                  onDoubleClick={() => !bin && act(f, "open")}
                  onContextMenu={(e) => !bin && openMenu(e, f)}
                  onKeyDown={(e) => {
                    if (bin) return;
                    if (e.key === "Enter") act(f, "open");
                    if (e.key === "Delete") act(f, "delete");
                  }}
                  title={`${shownName(f.name, showExt)}\n${f.size}`}
                >
                  <FileIcon file={f} size={56} />
                  <span dir="ltr">{shownName(f.name, showExt)}</span>
                </button>
              ))}
            </div>
          ) : bin ? (
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
          ) : (
            <div className="files__empty">
              {HereIcon && <HereIcon size={96} />}
              <span>{t.emptyFolder}</span>
            </div>
          )}
        </section>
      </div>
      {menu && (
        <div className="ctx" style={{ left: menu.x, top: menu.y }} role="menu" onClick={(e) => e.stopPropagation()}>
          <button role="menuitem" className="ctx__item ctx__item--bold" onClick={() => act(menu.file, "open")}>{t.fileMenu.open}</button>
          <button role="menuitem" className="ctx__item" onClick={() => act(menu.file, "scan")}><ShieldGlyph /> {t.fileMenu.scan}</button>
          <span className="ctx__sep" />
          <button role="menuitem" className="ctx__item" onClick={() => act(menu.file, "delete")}><TrashGlyph /> {t.fileMenu.delete}</button>
        </div>
      )}
      <div className="files__status">{t.items(count)}</div>
    </div>
  );
}
