// Bottom taskbar (Windows 11 style): centered Start, search and apps; system tray and clock at the end.
import { useEffect, useState } from "react";
import { useOs, activeWindowId, type AppId } from "./osStore";
import {
	APP_ICONS,
	BatteryGlyph,
	BellGlyph,
	ChevronUpGlyph,
	SearchGlyph,
	VolumeGlyph,
	WifiGlyph,
} from "./icons";
import { ArcMark } from "./ArcLogo";
import { useGame } from "../../store/gameStore";
import { useT } from "../../i18n/strings";

const PINNED: AppId[] = ["files", "browser", "mail"];

function useNow() {
	const [now, setNow] = useState(new Date());
	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 10_000);
		return () => clearInterval(id);
	}, []);
	return now;
}

export function Taskbar() {
	const windows = useOs((s) => s.windows);
	const startOpen = useOs((s) => s.startOpen);
	const { setStart, taskbarClick, showDesktop } = useOs.getState();
	const lang = useGame((s) => s.lang);
	const t = useT();
	const now = useNow();
	const active = activeWindowId(windows);
	const locale = lang === "ar" ? "ar-DZ" : "en-GB";

	// pinned apps first, then any other open app
	const apps = [
		...PINNED,
		...windows.map((w) => w.app).filter((a) => !PINNED.includes(a)),
	];

	return (
		<footer className="taskbar">
			<div className="tb__center">
				<button
					className={`tb__btn tb__start ${startOpen ? "tb__btn--on" : ""}`}
					onClick={(e) => {
						e.stopPropagation();
						setStart(!startOpen);
					}}
					aria-label="Start"
				>
					<ArcMark size={26} />
				</button>

				<label className="tb__search" onClick={(e) => e.stopPropagation()}>
					<SearchGlyph size={15} />
					<input placeholder={t.search} aria-label={t.search} />
				</label>

				{apps.map((a) => {
					const win = windows.find((w) => w.app === a);
					const Icon = APP_ICONS[a];
					const state = !win
						? ""
						: win.id === active
							? "tb__app--active"
							: "tb__app--open";
					return (
						<button
							key={a}
							className={`tb__btn tb__app ${state}`}
							onClick={(e) => {
								e.stopPropagation();
								taskbarClick(a);
							}}
							title={t.apps[a]}
							aria-label={t.apps[a]}
						>
							<Icon size={26} />
						</button>
					);
				})}
			</div>

			<div className="tb__tray">
				<button className="tb__btn tb__tray-btn" aria-label="Hidden icons">
					<ChevronUpGlyph />
				</button>
				<button className="tb__btn tb__tray-btn tb__lang">{t.langShort}</button>
				<button
					className="tb__btn tb__tray-btn tb__status"
					aria-label="Network, volume, battery"
				>
					<WifiGlyph />
					<VolumeGlyph />
				</button>
				<button className="tb__btn tb__tray-btn tb__clock">
					<span>
						{now.toLocaleTimeString(locale, {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
					<span>
						{now.toLocaleDateString(locale, {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})}
					</span>
				</button>
				<button className="tb__btn tb__tray-btn" aria-label="Notifications">
					<BellGlyph />
				</button>
				<button
					className="tb__peek"
					onClick={showDesktop}
					title={t.showDesktop}
					aria-label={t.showDesktop}
				/>
			</div>
		</footer>
	);
}
