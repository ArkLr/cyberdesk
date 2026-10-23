import { useEffect, useState } from "react";

/** A short message that disappears after 1.6 s. */
export function useToast() {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    if (!text) return;
    const id = setTimeout(() => setText(null), 1600);
    return () => clearTimeout(id);
  }, [text]);
  return [text, setText] as const;
}

export function Toast({ text }: { text: string | null }) {
  return <div className={`toast ${text ? "toast--on" : ""}`}>{text}</div>;
}
