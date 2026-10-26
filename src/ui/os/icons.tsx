// Icons for the computer and phone.
// App and folder icons are the Windows icons from src/assets/Icons, converted to PNG
// by tools/icons/convert_icons.py. Small UI glyphs are inline SVG (16x16, take the text color).
import type { SVGProps } from "react";
import mailPng from "../../assets/os-icons/mail.png";
import browserPng from "../../assets/os-icons/browser.png";
import explorerPng from "../../assets/os-icons/explorer.png";
import binEmptyPng from "../../assets/os-icons/bin-empty.png";
import binFullPng from "../../assets/os-icons/bin-full.png";
import settingsPng from "../../assets/os-icons/settings.png";
import photosPng from "../../assets/os-icons/photos.png";
import weatherPng from "../../assets/os-icons/weather.png";
import clockPng from "../../assets/os-icons/clock.png";
import securityPng from "../../assets/os-icons/security.png";
import folderPng from "../../assets/os-icons/folder.png";
import folderDocumentsPng from "../../assets/os-icons/folder-documents.png";
import folderDownloadsPng from "../../assets/os-icons/folder-downloads.png";
import folderMusicPng from "../../assets/os-icons/folder-music.png";
import folderPicturesPng from "../../assets/os-icons/folder-pictures.png";
import folderVideosPng from "../../assets/os-icons/folder-videos.png";
import folderZipPng from "../../assets/os-icons/folder-zip.png";

type P = SVGProps<SVGSVGElement> & { size?: number };
export type IconProps = { size?: number; className?: string };
export type IconComponent = (p: IconProps) => JSX.Element;

const app = ({ size = 48, ...p }: P) => ({ width: size, height: size, viewBox: "0 0 48 48", ...p });
const ui = ({ size = 16, ...p }: P) => ({
  width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor",
  strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, ...p,
});

/** An icon component that shows one of the PNG icons at `size` px. */
const png = (src: string): IconComponent => ({ size = 48, className }) => (
  <img src={src} width={size} height={size} className={`os-img ${className ?? ""}`} alt="" draggable={false} />
);

/* ---------------- app icons ---------------- */

export const MailIcon = png(mailPng);
export const BrowserIcon = png(browserPng);
export const ExplorerIcon = png(explorerPng);
export const BinIcon = png(binEmptyPng);
export const BinFullIcon = png(binFullPng);
export const SettingsIcon = png(settingsPng);
export const PhotosIcon = png(photosPng);
export const WeatherIcon = png(weatherPng);
export const ClockIcon = png(clockPng);
export const SecurityIcon = png(securityPng);

/* folder icons, by folder */
export const FolderIcon = png(folderPng);
export const FOLDER_ICONS = {
  desktop: png(folderPng),
  documents: png(folderDocumentsPng),
  downloads: png(folderDownloadsPng),
  music: png(folderMusicPng),
  pictures: png(folderPicturesPng),
  videos: png(folderVideosPng),
} as const;
export const ZipIcon = png(folderZipPng);

/** Hard drive (no icon for it in the set, so drawn in the same style). */
export const DriveIcon = (p: P) => (
  <svg {...app(p)}>
    <defs>
      <linearGradient id="drv-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9edf2" />
        <stop offset="1" stopColor="#b9c2cc" />
      </linearGradient>
    </defs>
    <rect x="5" y="16" width="38" height="18" rx="3" fill="url(#drv-g)" stroke="#8d98a5" />
    <rect x="9" y="27" width="20" height="3" rx="1.5" fill="#6b7682" />
    <circle cx="37" cy="28.5" r="2" fill="#3fb950" />
  </svg>
);

export const CalcIcon = (p: P) => (
  <svg {...app(p)}>
    <rect x="10" y="5" width="28" height="38" rx="3" fill="#3a3f47" />
    <rect x="14" y="9" width="20" height="8" rx="1" fill="#9fd3a4" />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={14 + c * 7} y={21 + r * 7} width="5" height="5" rx="1" fill="#d6dbe1" />))}
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...app(p)}>
    <rect x="6" y="9" width="36" height="32" rx="3" fill="#fff" />
    <rect x="6" y="9" width="36" height="9" rx="3" fill="#d6453d" />
    <text x="24" y="35" textAnchor="middle" fontSize="15" fontWeight="600" fill="#333" fontFamily="Segoe UI, sans-serif">
      {new Date().getDate()}
    </text>
  </svg>
);

/** A program (.exe): a small app window with a gear, like the Windows default program icon. */
export const ExeIcon = (p: P) => (
  <svg {...app(p)}>
    <rect x="5" y="9" width="38" height="30" rx="2.5" fill="#fff" stroke="#8d98a5" />
    <path d="M5 11.5A2.5 2.5 0 0 1 7.5 9h33a2.5 2.5 0 0 1 2.5 2.5V16H5z" fill="#2b6fc4" />
    <circle cx="24" cy="27.5" r="5.5" fill="none" stroke="#5b6575" strokeWidth="3" strokeDasharray="3 2.2" />
    <circle cx="24" cy="27.5" r="2.2" fill="#5b6575" />
  </svg>
);


/* ---------------- UI glyphs ---------------- */

export const SearchGlyph = (p: P) => (
  <svg {...ui(p)}><circle cx="9.5" cy="6.5" r="4.5" /><path d="M6.3 9.7 2 14" /></svg>
);
export const WifiGlyph = (p: P) => (
  <svg {...ui(p)}><path d="M1.5 6a9.5 9.5 0 0 1 13 0M3.8 8.6a6.2 6.2 0 0 1 8.4 0M6.1 11.1a2.9 2.9 0 0 1 3.8 0" /><circle cx="8" cy="13.4" r=".6" fill="currentColor" /></svg>
);
export const VolumeGlyph = (p: P) => (
  <svg {...ui(p)}><path d="M2 6h2.5L8 3v10l-3.5-3H2z" /><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9" /></svg>
);
export const BatteryGlyph = (p: P) => (
  <svg {...ui(p)}><rect x="1.5" y="4.5" width="11.5" height="7" rx="1.2" /><path d="M14.5 7v2" /><rect x="3" y="6" width="7" height="4" fill="currentColor" stroke="none" /></svg>
);
export const BellGlyph = (p: P) => (
  <svg {...ui(p)}><path d="M3.5 11.5h9l-1.2-1.6V7a3.3 3.3 0 0 0-6.6 0v2.9z" /><path d="M6.6 13.3a1.5 1.5 0 0 0 2.8 0" /></svg>
);
export const ChevronUpGlyph = (p: P) => <svg {...ui(p)}><path d="m4 10 4-4 4 4" /></svg>;
export const ChevronRightGlyph = (p: P) => <svg {...ui(p)}><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>;
export const BackGlyph = (p: P) => <svg {...ui(p)}><path d="M10 3 5 8l5 5" /></svg>;
export const ForwardGlyph = (p: P) => <svg {...ui(p)}><path d="m6 3 5 5-5 5" /></svg>;
export const ReloadGlyph = (p: P) => <svg {...ui(p)}><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.8h-2.8" /></svg>;
export const UpGlyph = (p: P) => <svg {...ui(p)}><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>;
export const LockGlyph = (p: P) => <svg {...ui(p)}><rect x="3.5" y="7" width="9" height="6.5" rx="1" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>;
export const StarGlyph = (p: P) => <svg {...ui(p)}><path d="m8 2 1.8 3.8 4.1.5-3 2.8.8 4.1L8 11.2l-3.7 2 .8-4.1-3-2.8 4.1-.5z" /></svg>;
export const PlusGlyph = (p: P) => <svg {...ui(p)}><path d="M8 3v10M3 8h10" /></svg>;
export const UserGlyph = (p: P) => <svg {...ui(p)}><circle cx="8" cy="5.5" r="2.8" /><path d="M2.8 14a5.2 5.2 0 0 1 10.4 0" /></svg>;
export const DocGlyph = (p: P) => <svg {...ui(p)}><path d="M4 1.5h5.5L12.5 4.5v10h-8.5z" /><path d="M9.5 1.5v3h3" /></svg>;
export const PictureGlyph = (p: P) => <svg {...ui(p)}><rect x="2" y="3" width="12" height="10" rx="1" /><path d="m2.5 11.5 3.5-3.5 2.5 2.5 2-2 3 3" /></svg>;
export const GearGlyph = (p: P) => (
  <svg {...ui(p)}><circle cx="8" cy="8" r="2.2" /><path d="M8 1.5v1.8M8 12.7v1.8M14.5 8h-1.8M3.3 8H1.5M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3M12.6 12.6l-1.3-1.3M4.7 4.7 3.4 3.4" /></svg>
);
export const PowerGlyph = (p: P) => <svg {...ui(p)}><path d="M8 1.8v6" /><path d="M4.6 4a5.3 5.3 0 1 0 6.8 0" /></svg>;
export const MenuGlyph = (p: P) => <svg {...ui(p)}><path d="M2.5 4h11M2.5 8h11M2.5 12h11" /></svg>;
export const PencilGlyph = (p: P) => <svg {...ui(p)}><path d="m3 13 .6-2.6 7.6-7.6 2 2-7.6 7.6zM9.8 4.2l2 2" /></svg>;
export const InboxGlyph = (p: P) => <svg {...ui(p)}><path d="M2 9.5 4 3h8l2 6.5V13H2z" /><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14" /></svg>;
export const SendGlyph = (p: P) => <svg {...ui(p)}><path d="m2 8 12-5.5L9.5 14l-2-4.5z" /><path d="M7.5 9.5 14 2.5" /></svg>;
export const JunkGlyph = (p: P) => <svg {...ui(p)}><circle cx="8" cy="8" r="6" /><path d="m3.8 3.8 8.4 8.4" /></svg>;
export const PcGlyph = (p: P) => <svg {...ui(p)}><rect x="1.5" y="2.5" width="13" height="8.5" rx="1" /><path d="M5.5 14h5M8 11v3" /></svg>;
export const DownloadGlyph = (p: P) => <svg {...ui(p)}><path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" /></svg>;
export const MusicGlyph = (p: P) => <svg {...ui(p)}><path d="M6 12V3.5l7-1.5V10" /><circle cx="4.5" cy="12" r="1.8" /><circle cx="11.5" cy="10" r="1.8" /></svg>;
export const VideoGlyph = (p: P) => <svg {...ui(p)}><rect x="1.5" y="3.5" width="9.5" height="9" rx="1" /><path d="m11 7 3.5-2v6L11 9" /></svg>;
export const PhoneGlyph = (p: P) => (
  <svg {...ui(p)}><path d="M5.2 2.2 3.3 2.6c-.6.1-1 .7-.9 1.3.9 4.8 4.8 8.7 9.6 9.6.6.1 1.2-.3 1.3-.9l.4-1.9-2.8-1.4-1.3 1.3a7.4 7.4 0 0 1-3.6-3.6l1.3-1.3z" /></svg>
);
export const ShieldGlyph = (p: P) => <svg {...ui(p)}><path d="M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6z" /></svg>;
export const BluetoothGlyph = (p: P) => <svg {...ui(p)}><path d="m4.5 5 7 6-3.5 3V2l3.5 3-7 6" /></svg>;
export const InfoGlyph = (p: P) => <svg {...ui(p)}><circle cx="8" cy="8" r="6" /><path d="M8 7.2v4M8 4.8v.1" /></svg>;

export const CutGlyph = (p: P) => <svg {...ui(p)}><circle cx="4.5" cy="12" r="2" /><circle cx="11.5" cy="12" r="2" /><path d="M6 10.6 11.5 2M10 10.6 4.5 2" /></svg>;
export const CopyGlyph = (p: P) => <svg {...ui(p)}><rect x="5" y="5" width="8.5" height="9" rx="1.2" /><path d="M3 11V3.2C3 2.5 3.5 2 4.2 2H10" /></svg>;
export const PasteGlyph = (p: P) => <svg {...ui(p)}><path d="M5.5 3H4a1 1 0 0 0-1 1v9.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-1.5" /><rect x="5.5" y="1.8" width="5" height="2.6" rx=".8" /></svg>;
export const RenameGlyph = (p: P) => <svg {...ui(p)}><rect x="1.5" y="5" width="13" height="6" rx="1" /><path d="M5 7v2" /></svg>;
export const ShareGlyph = (p: P) => <svg {...ui(p)}><path d="M9.5 2.5H13.5V6.5M13.5 2.5 7 9M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" /></svg>;
export const TrashGlyph = (p: P) => <svg {...ui(p)}><path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4M6.8 6.5v4.5M9.2 6.5v4.5" /></svg>;
export const SortGlyph = (p: P) => <svg {...ui(p)}><path d="M4.5 2.5v11M2 11l2.5 2.5L7 11M11.5 13.5v-11M9 5l2.5-2.5L14 5" /></svg>;
export const ViewGlyph = (p: P) => <svg {...ui(p)}><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>;
export const MoreGlyph = (p: P) => <svg {...ui(p)}><circle cx="3.5" cy="8" r=".9" fill="currentColor" /><circle cx="8" cy="8" r=".9" fill="currentColor" /><circle cx="12.5" cy="8" r=".9" fill="currentColor" /></svg>;
export const HomeGlyph = (p: P) => <svg {...ui(p)}><path d="M2.5 7.5 8 2.5l5.5 5M4 6.5v7h3v-4h2v4h3v-7" /></svg>;
export const RestoreItemsGlyph = (p: P) => <svg {...ui(p)}><path d="M3 8a5 5 0 1 0 1.5-3.6M3 2.5v2.8h2.8" /></svg>;
export const FilterGlyph = (p: P) => <svg {...ui(p)}><path d="M2 3.5h12M4.5 8h7M7 12.5h2" /></svg>;
export const FlagGlyph = (p: P) => <svg {...ui(p)}><path d="M3.5 14V2.5M3.5 3h8l-1.8 3 1.8 3h-8" /></svg>;
export const ArchiveGlyph = (p: P) => <svg {...ui(p)}><rect x="1.8" y="2.5" width="12.4" height="3" rx=".8" /><path d="M2.8 5.5v7a1 1 0 0 0 1 1h8.4a1 1 0 0 0 1-1v-7M6.3 8.5h3.4" /></svg>;
export const ReplyGlyph = (p: P) => <svg {...ui(p)}><path d="M6.5 3.5 2.5 7.5l4 4M2.5 7.5h7a4 4 0 0 1 4 4v1" /></svg>;

// Window caption buttons (thin, like the Windows title bar)
export const MinGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0 5.5h10" stroke="currentColor" /></svg>;
export const MaxGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9" fill="none" stroke="currentColor" /></svg>;
export const RestoreGlyph = () => (
  <svg width="10" height="10" viewBox="0 0 10 10"><rect x=".5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" /><path d="M2.5 2.5v-2h7v7h-2" fill="none" stroke="currentColor" /></svg>
);
export const CloseGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10"><path d="m.5.5 9 9m0-9-9 9" stroke="currentColor" /></svg>;

/** App id -> icon, used by the desktop, taskbar and Start menu. */
export const APP_ICONS: Record<"mail" | "browser" | "files" | "bin", IconComponent> = {
  mail: MailIcon,
  browser: BrowserIcon,
  files: ExplorerIcon,
  bin: BinIcon,
};
