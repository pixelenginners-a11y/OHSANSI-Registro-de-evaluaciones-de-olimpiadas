import Icon from "./Icon";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onCancel}
        >
          <Icon name="x" />
        </button>

        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{description}</p>

        <div className="flex justify-between gap-2">
          <button
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
