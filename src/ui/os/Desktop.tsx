// The whole computer screen: wallpaper, desktop icons, windows, Start menu,
// notifications and taskbar. Laid out at DESKTOP_W x DESKTOP_H.
import { useState } from "react";
import {
	useOs,
	activeWindowId,
	type AppId,
	DESKTOP_W,
	DESKTOP_H,
} from "./osStore";
import { APP_ICONS, CloseGlyph } from "./icons";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { MailApp } from "./apps/MailApp";
import { BrowserApp } from "./apps/BrowserApp";
import { FilesApp } from "./apps/FilesApp";
import { useT } from "../../i18n/strings";
import { Wallpaper } from "./Wallpaper";
import { Consequence } from "./Consequence";

const DESKTOP_ICONS: AppId[] = ["bin", "files", "browser", "mail"];

function AppContent({ app }: { app: AppId }) {
	switch (app) {
		case "mail":
			return <MailApp />;
		case "browser":
			return <BrowserApp />;
		case "files":
			return <FilesApp />;
		case "bin":
			return <FilesApp mode="bin" />;
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
					<AppContent app={w.app} />
				</Window>
			))}

			<StartMenu />
			<Notifications />
			<Consequence />
			<WebcamLight />
			<Taskbar />
		</div>
	);
}
