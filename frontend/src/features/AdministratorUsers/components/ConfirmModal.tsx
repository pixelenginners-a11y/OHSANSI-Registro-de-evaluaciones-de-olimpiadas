interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  confirmText?: string;
  confirmClassnames?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  confirmText,
  description,
  onConfirm,
  confirmClassnames,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-400 opacity-50"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <p className="text-gray-900 font-semibold mb-2">{title}</p>
        {description && (
          <p className="text-gray-700 mb-6">{description}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmClassnames ? confirmClassnames : "px-4 py-2 bg-red-500 text-white rounded"} `}
          >
            {confirmText || 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}