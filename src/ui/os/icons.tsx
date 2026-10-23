// Icons for the computer and phone, drawn as inline SVG (no image files).
// App icons use a 48x48 grid; small UI glyphs use 16x16 and take the text color.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const app = ({ size = 48, ...p }: P) => ({ width: size, height: size, viewBox: "0 0 48 48", ...p });
const ui = ({ size = 16, ...p }: P) => ({
  width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor",
  strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, ...p,
});

/* ---------------- app icons ---------------- */

export const MailIcon = (p: P) => (
  <svg {...app(p)}>
    <rect x="4" y="10" width="40" height="28" rx="3" fill="#1d6fd8" />
    <path d="M4.8 11.5 24 26.5l19.2-15" fill="none" stroke="#bfe0ff" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M5 37 19 23M43 37 29 23" stroke="#5aa2f0" strokeWidth="1.6" />
  </svg>
);

export const BrowserIcon = (p: P) => (
  <svg {...app(p)}>
    <defs>
      <linearGradient id="br-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#35d0c0" />
        <stop offset="1" stopColor="#0f6fb8" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="19" fill="url(#br-g)" />
    <ellipse cx="24" cy="24" rx="8" ry="19" fill="none" stroke="#e8fbff" strokeWidth="1.8" opacity=".85" />
    <path d="M5.5 19h37M5.5 29h37" stroke="#e8fbff" strokeWidth="1.8" opacity=".85" />
    <circle cx="24" cy="24" r="19" fill="none" stroke="#0a4f86" strokeWidth="1" />
  </svg>
);

export const FolderIcon = (p: P) => (
  <svg {...app(p)}>
    <path d="M4 12a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v3H4z" fill="#d9a520" />
    <rect x="4" y="16" width="40" height="24" rx="3" fill="#f7c948" />
    <rect x="4" y="16" width="40" height="3" fill="#ffe08a" opacity=".7" />
  </svg>
);

export const ExplorerIcon = (p: P) => (
  <svg {...app(p)}>
    <path d="M4 12a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v3H4z" fill="#d9a520" />
    <rect x="4" y="16" width="40" height="24" rx="3" fill="#f7c948" />
    <rect x="10" y="26" width="28" height="8" rx="1.5" fill="#2b79d6" />
  </svg>
);

export const BinIcon = (p: P) => (
  <svg {...app(p)}>
    <path d="M12 14h24l-2.5 27a3 3 0 0 1-3 2.7H17.5a3 3 0 0 1-3-2.7z" fill="#dfe6ee" stroke="#9aa8b6" strokeWidth="1.4" />
    <path d="M10 13h28" stroke="#9aa8b6" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 19v19M24 19v19M28 19v19" stroke="#b4c0cc" strokeWidth="1.4" />
  </svg>
);

export const SettingsIcon = (p: P) => (
  <svg {...app(p)}>
    <circle cx="24" cy="24" r="12" fill="none" stroke="#8a96a3" strokeWidth="5" strokeDasharray="5 4.4" />
    <circle cx="24" cy="24" r="8" fill="none" stroke="#c4ccd4" strokeWidth="3" />
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

export const PhotosIcon = (p: P) => (
  <svg {...app(p)}>
    <rect x="6" y="9" width="36" height="30" rx="3" fill="#2c7be5" />
    <circle cx="17" cy="19" r="4" fill="#ffe07a" />
    <path d="M6 34 18 24l8 7 6-5 10 8v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#7cc0ff" />
  </svg>
);

export const WeatherIcon = (p: P) => (
  <svg {...app(p)}>
    <circle cx="19" cy="19" r="8" fill="#ffc83d" />
    <path d="M16 38h20a7 7 0 0 0 0-14 9 9 0 0 0-17 3 5.5 5.5 0 0 0-3 11z" fill="#eef3f8" />
  </svg>
);

/* ---------------- UI glyphs ---------------- */

export const StartGlyph = (p: P) => (
  // Nova OS mark: a diamond split in two, not the Windows logo
  <svg {...ui({ ...p, strokeWidth: 0 })}>
    <path d="M8 1.5 14.5 8 8 14.5z" fill="currentColor" />
    <path d="M8 1.5 1.5 8 8 14.5z" fill="currentColor" opacity=".55" />
  </svg>
);
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

// Window caption buttons (thin, like the Windows 10 title bar)
export const MinGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0 5.5h10" stroke="currentColor" /></svg>;
export const MaxGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9" fill="none" stroke="currentColor" /></svg>;
export const RestoreGlyph = () => (
  <svg width="10" height="10" viewBox="0 0 10 10"><rect x=".5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" /><path d="M2.5 2.5v-2h7v7h-2" fill="none" stroke="currentColor" /></svg>
);
export const CloseGlyph = () => <svg width="10" height="10" viewBox="0 0 10 10"><path d="m.5.5 9 9m0-9-9 9" stroke="currentColor" /></svg>;

/** App id -> icon, used by the desktop, taskbar and Start menu. */
export const APP_ICONS = {
  mail: MailIcon,
  browser: BrowserIcon,
  files: ExplorerIcon,
  bin: BinIcon,
} as const;
