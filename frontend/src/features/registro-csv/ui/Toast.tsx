import { useEffect, useState } from "react";

export default function Toast({
  open, text, onClose, duration = 2800,
}: { open: boolean; text: string; duration?: number; onClose: () => void; }) {
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    setVisible(open);
    if (open) {
      const t = setTimeout(() => { setVisible(false); onClose(); }, duration);
      return () => clearTimeout(t);
    }
  }, [open, duration, onClose]);
  if (!visible) return null;

  return (
    <div className="fixed right-4 top-4 z-[70]">
      <div className="rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-neutral-200">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">✓</span>
          <p className="text-sm font-medium text-neutral-800">{text}</p>
        </div>
      </div>
    </div>
  );
}
