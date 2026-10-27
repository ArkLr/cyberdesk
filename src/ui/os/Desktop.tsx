// The whole computer screen: wallpaper, desktop icons, windows, Start menu,
// notifications and taskbar. Laid out at DESKTOP_W x DESKTOP_H.
import { useEffect, useState } from "react";
import {
	useOs,
	activeWindowId,
	type AppId,
	DESKTOP_W,
	DESKTOP_H,
	type Win,
} from "./osStore";
import { APP_ICONS, CloseGlyph } from "./icons";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { MailApp } from "./apps/MailApp";
import { BrowserApp } from "./apps/BrowserApp";
import { FilesApp } from "./apps/FilesApp";
import { WriterApp } from "./apps/WriterApp";
import { TaskManagerApp } from "./apps/TaskManagerApp";
import { ScamScreen } from "./pages/TechScam";
import { useT } from "../../i18n/strings";
import { Wallpaper } from "./Wallpaper";
import { Consequence } from "./Consequence";

const DESKTOP_ICONS: AppId[] = ["bin", "files", "browser", "mail"];

function AppContent({ win }: { win: Win }) {
	switch (win.app) {
		case "mail":
			return <MailApp />;
		case "browser":
			return <BrowserApp win={win} />;
		case "files":
			return <FilesApp />;
		case "bin":
			return <FilesApp mode="bin" />;
		case "writer":
			return <WriterApp />;
		case "taskmgr":
			return <TaskManagerApp />;
	}
}

function Notifications() {
	const notes = useOs((s) => s.notes);
	const dismiss = useOs((s) => s.dismiss);
	return (
		<div className="notes" aria-live="polite">
			{notes.map((n) => (
				<div key={n.id} className="note">
					<div className="note__head">
						<strong>{n.title}</strong>
						<button onClick={() => dismiss(n.id)} aria-label="Dismiss">
							<CloseGlyph />
						</button>
					</div>
					<p>{n.body}</p>
				</div>
			))}
		</div>
	);
}

/** The camera's "in use" light, at the top of the screen. */
function WebcamLight() {
	const on = useOs((s) => s.webcamOn);
	return on ? <span className="os__cam" aria-hidden="true" /> : null;
}

export function Desktop() {
	const windows = useOs((s) => s.windows);
	const { openApp, setStart } = useOs.getState();
	const [selected, setSelected] = useState<AppId | null>(null);
	const t = useT();
	const active = activeWindowId(windows);

	// Ctrl+Shift+Esc opens Task Manager, like on Windows
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === "Escape") openApp("taskmgr");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [openApp]);

	return (
		<div
			className="os"
			style={{ width: DESKTOP_W, height: DESKTOP_H }}
			onClick={() => {
				setStart(false);
				setSelected(null);
			}}
		>
			<Wallpaper />

			<div className="os__icons">
				{DESKTOP_ICONS.map((a) => {
					const Icon = APP_ICONS[a];
					return (
						<button
							key={a}
							className={`os__icon ${selected === a ? "os__icon--on" : ""}`}
							onClick={(e) => {
								e.stopPropagation();
								setStart(false);
								setSelected(a);
							}}
							onDoubleClick={() => {
								setSelected(null);
								openApp(a);
							}}
							onKeyDown={(e) => e.key === "Enter" && openApp(a)}
						>
							<Icon size={48} />
							<span>{t.apps[a]}</span>
						</button>
					);
				})}
			</div>

			{windows.map((w) => (
				<Window key={w.id} win={w} active={w.id === active}>
					<AppContent win={w} />
				</Window>
			))}

			<ScamScreen />
			<StartMenu />
			<Notifications />
			<Consequence />
			<WebcamLight />
			<Taskbar />
		</div>
	);
}
