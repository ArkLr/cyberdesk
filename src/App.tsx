import { useEffect } from "react";
import { DeskScene } from "./scene/DeskScene";
import { LanguageSwitch, Loader, ViewArrows } from "./ui/Hud";
import { PcScreen } from "./ui/PcScreen";
import { PhoneScreen } from "./ui/PhoneScreen";
import { useGame } from "./store/gameStore";

export default function App() {
  const lang = useGame((s) => s.lang);

  // Arabic flips the interface to right-to-left
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <>
      <DeskScene />
      <PcScreen />
      <PhoneScreen />
      <ViewArrows />
      <LanguageSwitch />
      <Loader />
    </>
  );
}
