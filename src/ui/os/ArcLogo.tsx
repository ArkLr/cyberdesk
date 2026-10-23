// The Arc brand (see inspo/): rainbow speed stripes, a bold italic "Arc" with an underline,
// and an optional "YEAR 2026" caption. The wordmark takes the text color. ArcMark is the stripes alone (used for the Start button).
import { useId } from "react";

const STRIPES = ["#e5483b", "#f08a2c", "#f4c63d", "#9fcf4a", "#3fb27f", "#38a6d9", "#3b6fd6"];

/** Horizontal colored bands clipped to a slanted parallelogram. */
function Stripes({ id, x, y, w, h, slant }: { id: string; x: number; y: number; w: number; h: number; slant: number }) {
  const band = h / STRIPES.length;
  return (
    <>
      <defs>
        <clipPath id={id}>
          <polygon points={`${x + slant},${y} ${x + w},${y} ${x + w - slant},${y + h} ${x},${y + h}`} />
        </clipPath>
        <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g clipPath={`url(#${id})`} mask={`url(#${id}-mask)`}>
        {STRIPES.map((c, i) => (
          // a hairline gap between bands, like the printed original
          <rect key={c} x={x} y={y + i * band} width={w} height={band * 0.82} fill={c} />
        ))}
      </g>
    </>
  );
}

/** A stable id that is safe inside url(#...) (React's ids contain colons). */
const useSvgId = () => `arc${useId().replace(/:/g, "")}`;

export function ArcLogo({ height = 40, year = true, className }: { height?: number; year?: boolean; className?: string }) {
  const id = useSvgId();
  const vbH = year ? 46 : 34;
  return (
    <svg className={className} height={height} viewBox={`0 0 118 ${vbH}`} role="img" aria-label="Arc" style={{ direction: "ltr" }}>
      <Stripes id={id} x={2} y={6} w={60} h={22} slant={9} />
      <text
        x="50" y="27.5"
        fill="currentColor"
        fontFamily='"Arial Black", "Helvetica Neue", Arial, sans-serif'
        fontWeight="900" fontStyle="italic" fontSize="27" letterSpacing="-2.2"
        stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round"
      >Arc</text>
      <rect x="2" y="30.5" width="110" height="1.6" fill="currentColor" />
      {year && (
        <g fill="#9a9a9a" fontFamily='"Helvetica Neue", Arial, sans-serif' fontSize="7.2" fontWeight="500" letterSpacing="0.3">
          <text x="2" y="42">YEAR</text>
          <text x="112" y="42" textAnchor="end">2026</text>
        </g>
      )}
    </svg>
  );
}

/** Just the stripes, square-ish, for small places like the Start button. */
export function ArcMark({ size = 20 }: { size?: number }) {
  const id = useSvgId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <Stripes id={id} x={1} y={3} w={22} h={18} slant={5} />
    </svg>
  );
}
