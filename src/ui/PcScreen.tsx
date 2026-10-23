// Places the computer desktop exactly over the 3D monitor once the camera has landed.
// The desktop is laid out at a fixed size (like a real screen resolution) and scaled to fit.
import { useEffect } from "react";
import { useGame } from "../store/gameStore";
import { Desktop } from "./os/Desktop";
import { DESKTOP_W, useOs } from "./os/osStore";
import { ScaleContext } from "./os/scale";

export function PcScreen() {
  const view = useGame((s) => s.view);
  const rect = useGame((s) => s.screenRect);

  // close the Start menu when the player looks away from the computer
  useEffect(() => {
    if (view !== "pc") useOs.getState().setStart(false);
  }, [view]);

  if (view !== "pc" || !rect) return null;

  const scale = rect.w / DESKTOP_W;
  return (
    <div className="screen screen--crt" style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}>
      <div className="screen__scaler" style={{ transform: `scale(${scale})` }}>
        <ScaleContext.Provider value={scale}>
          <Desktop />
        </ScaleContext.Provider>
      </div>
      {/* old-CRT look on top (click-through); the 3D screen draws the same in screenTextures.ts */}
      <div className="crt" aria-hidden="true" />
    </div>
  );
}
