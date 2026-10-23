// The computer's desktop background: an animated ASCII gradient (React Bits GradientASCII).
// Tweak the look here. All props are listed in the component's docs (see README).
import GradientASCII from "./GradientASCII";

export function Wallpaper() {
	return (
		<div className="os__wallpaper" aria-hidden="true">
			<GradientASCII
				colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
				shape="horizon"
				gradientOpacity={0.53}
				characters=" =+xX0S8#@"
				cellSize={11}
				density={0.8}
				fontFamily='"IBM Plex Mono", ui-monospace, Consolas, monospace'
			/>
		</div>
	);
}
