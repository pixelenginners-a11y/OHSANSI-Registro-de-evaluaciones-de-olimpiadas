import { useEffect, useState } from "react";

export default function Toast({
  open, text, onClose, duration = 4000,
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

  const isError = text.includes('❌');
  const isSuccess = text.includes('✅');

  return (
    <div className="fixed right-4 top-4 z-[70] max-w-md">
      <div className="rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-neutral-200">
        <div className="flex items-start gap-3">
          {isSuccess && (
            <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">✓</span>
          )}
          {isError && (
            <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-700">✕</span>
          )}
          {!isSuccess && !isError && (
            <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-700">ℹ</span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 whitespace-pre-line break-words">{text}</p>
          </div>
          <button
            onClick={() => { setVisible(false); onClose(); }}
            className="ml-2 text-neutral-400 hover:text-neutral-600 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
