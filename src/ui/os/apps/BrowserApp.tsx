// Browser: tabs, navigation bar, and either the new-tab page or one of the
// fake websites in PAGES (chosen by useOs().browserUrl).
import { useEffect, useState } from "react";
import {
	BackGlyph,
	ForwardGlyph,
	LockGlyph,
	MoreGlyph,
	ReloadGlyph,
	SearchGlyph,
	StarGlyph,
	CloseGlyph,
	BrowserIcon,
	UserGlyph,
	ExeIcon,
	InfoGlyph,
	MinGlyph,
	RestoreGlyph,
	MaxGlyph,
} from "../icons";
import { useOs, type Win } from "../osStore";
import { ArcLogo } from "../ArcLogo";
import { CrackSite } from "../pages/CrackSite";
import { BankSite, PhishSite } from "../pages/BankSite";
import { NewsSite } from "../pages/NewsSite";
import { BrowserSettings } from "../pages/BrowserSettings";
import { TechScam } from "../pages/TechScam";
import {
	ABOUT_URL,
	BANK_URL,
	CRACK_URL,
	NEWS_URL,
	PHISH_URL,
	SCAM_URL,
	fileAction,
	visitUrl,
} from "../../../game/events";
import { useT } from "../../../i18n/strings";

/** The fake websites, by address. `secure: false` shows "Not secure" in the address bar. */
const PAGES: Record<
	string,
	{ title: string; secure: boolean; Page: () => JSX.Element }
> = {
	[CRACK_URL]: {
		title: "FREE GAMEZ - Download Full Cracked Games",
		secure: false,
		Page: CrackSite,
	},
	[BANK_URL]: {
		title: "ArcBank - Online Banking",
		secure: true,
		Page: BankSite,
	},
	[PHISH_URL]: {
		title: "ArcBank - Account verification",
		secure: false,
		Page: PhishSite,
	},
	[NEWS_URL]: { title: "The Daily Nova - News", secure: true, Page: NewsSite },
	[SCAM_URL]: {
		title: "⚠ Security Alert",
		secure: false,
		Page: () => <TechScam />,
	},
	[ABOUT_URL]: { title: "", secure: true, Page: BrowserSettings }, // title from strings
};

const QUICK = [
	{ key: "bank", color: "#0b5e4a", letter: "A" },
	{ key: "news", color: "#d64541", letter: "N" },
	{ key: "weather", color: "#2e86de", letter: "W" },
	{ key: "mail", color: "#1d6fd8", letter: "M" },
	{ key: "maps", color: "#1e9e5a", letter: "M" },
	{ key: "shop", color: "#e67e22", letter: "S" },
] as const;

export function BrowserApp({ win }: { win: Win }) {
	const { close, minimize, toggleMaximize } = useOs.getState();

	const t = useT();
	const url = useOs((s) => s.browserUrl);
	const [address, setAddress] = useState(url ?? "");
	const [menu, setMenu] = useState(false);
	const { notify, openFolder } = useOs.getState();
	const page = url ? PAGES[url] : undefined;
	// the downloads bar: the last download, while it's still on the disk
	const download = useOs((s) =>
		s.files.find((f) => f.id === s.lastDownload && !f.deleted),
	);

	useEffect(() => setAddress(url ?? ""), [url]);

	const go = (e: React.FormEvent) => {
		e.preventDefault();
		const a = address
			.trim()
			.toLowerCase()
			.replace(/^https?:\/\//, "")
			.replace(/^www\./, "")
			.replace(/\/$/, "");
		if (PAGES[a]) visitUrl(a);
		else if (a) notify(t.apps.browser, t.comingSoon);
	};

	return (
		<div className="browser" onClick={() => setMenu(false)}>
			<div className="browser__tabs">
				<div className="browser__tab browser__tab--on">
					<BrowserIcon size={16} />
					<span dir="auto">
						{url === ABOUT_URL
							? t.aboutPage.title
							: page
								? page.title
								: t.newTab}
					</span>
					<button
						className="browser__tab-x hover:text-red"
						onClick={() => visitUrl(null)}
						aria-label={t.closeTab}
						title={t.closeTab}
					>
						<CloseGlyph />
					</button>
				</div>

				<div className="win__caps">
					<button
						className="win__cap"
						onClick={() => minimize(win.id)}
						aria-label={t.minimize}
						title={t.minimize}
					>
						<MinGlyph />
					</button>
					<button
						className="win__cap"
						onClick={() => toggleMaximize(win.id)}
						aria-label={win.maximized ? t.restore : t.maximize}
						title={win.maximized ? t.restore : t.maximize}
					>
						{win.maximized ? <RestoreGlyph /> : <MaxGlyph />}
					</button>
					<button
						className="win__cap win__cap--close"
						onClick={() => close(win.id)}
						aria-label={t.close}
						title={t.close}
					>
						<CloseGlyph />
					</button>
				</div>
			</div>
			<form className="browser__bar" onSubmit={go}>
				<button
					type="button"
					className="browser__nav"
					aria-label="Back"
					disabled
				>
					<BackGlyph />
				</button>
				<button
					type="button"
					className="browser__nav"
					aria-label="Forward"
					disabled
				>
					<ForwardGlyph />
				</button>
				<button type="button" className="browser__nav" aria-label="Reload">
					<ReloadGlyph />
				</button>
				<label className="browser__address">
					{page && !page.secure ? (
						<span className="browser__insecure">
							<InfoGlyph size={14} /> {t.notSecure}
						</span>
					) : (
						<LockGlyph size={14} />
					)}
					<input
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder={t.addressPh}
						aria-label={t.addressPh}
						dir="ltr"
					/>
					<StarGlyph size={14} />
				</label>
				<span className="browser__profile" aria-hidden="true">
					<UserGlyph size={14} />
				</span>
				<span className="browser__menu-wrap">
					<button
						type="button"
						className="browser__nav"
						aria-label={t.browserMenu.label}
						title={t.browserMenu.label}
						onClick={(e) => {
							e.stopPropagation();
							setMenu((m) => !m);
						}}
					>
						<MoreGlyph />
					</button>
					{menu && (
						<div className="ctx browser__menu" role="menu">
							<button
								type="button"
								role="menuitem"
								className="ctx__item"
								onClick={() => visitUrl(null)}
							>
								{t.browserMenu.newTab}
							</button>
							<button
								type="button"
								role="menuitem"
								className="ctx__item"
								onClick={() => openFolder("downloads")}
							>
								{t.browserMenu.downloads}
							</button>
							<button
								type="button"
								role="menuitem"
								className="ctx__item"
								onClick={() => visitUrl(ABOUT_URL)}
							>
								{t.browserMenu.settings}
							</button>
							<button
								type="button"
								role="menuitem"
								className="ctx__item"
								onClick={() => visitUrl(ABOUT_URL)}
							>
								{t.browserMenu.about}
							</button>
						</div>
					)}
				</span>
			</form>
			{page ? (
				<div className="browser__page">
					<page.Page />
				</div>
			) : (
				<div className="browser__page browser__newpage">
					<p className="browser__greeting">
						{t.greeting(new Date().getHours())}
					</p>
					<div className="browser__brand">
						<ArcLogo height={78} />
					</div>
					<form className="browser__search" onSubmit={go}>
						<SearchGlyph size={18} />
						<input
							placeholder={t.searchWeb}
							aria-label={t.searchWeb}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</form>
					<section className="browser__sites">
						<h3>{t.topSites}</h3>
						<div className="browser__quick">
							{QUICK.map((q) => (
								<button
									key={q.key}
									className="browser__q"
									onClick={() =>
										q.key === "bank"
											? visitUrl(BANK_URL)
											: notify(t.quick[q.key], t.comingSoon)
									}
								>
									<span
										className="browser__q-icon"
										style={{ background: q.color }}
									>
										{q.letter}
									</span>
									<span>{t.quick[q.key]}</span>
								</button>
							))}
						</div>
					</section>
				</div>
			)}
			{download && (
				<div className="browser__dl">
					<ExeIcon size={28} />
					<span className="browser__dl-info">
						<strong dir="ltr">{download.name}</strong>
						<small>{t.downloadSize(download.size)}</small>
					</span>
					<button
						className="browser__dl-btn"
						onClick={() => fileAction(download, "open")}
					>
						{t.openFile}
					</button>
					<button
						className="browser__dl-btn"
						onClick={() => openFolder(download.folder)}
					>
						{t.showInFolder}
					</button>
				</div>
			)}
		</div>
	);
}
