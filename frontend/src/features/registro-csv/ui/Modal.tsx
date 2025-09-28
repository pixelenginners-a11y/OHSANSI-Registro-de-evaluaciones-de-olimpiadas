
type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmDisabled?: boolean;
};

export default function Modal({
  open, title, description, confirmText="Confirmar", cancelText="Cancelar",
  onConfirm, onClose, confirmDisabled=false,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-[61] w-[92%] max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-neutral-700">{description}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="rounded-lg bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
