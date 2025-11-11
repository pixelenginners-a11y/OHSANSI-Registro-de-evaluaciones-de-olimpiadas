import Icon from "../../../components/Icon";

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "warning" | "info";
}

export function InfoModal({
  isOpen,
  title,
  message,
  onClose,
  type = "info",
}: InfoModalProps) {
  if (!isOpen) return null;

  const colorClasses = {
    success: "bg-green-500 hover:bg-green-600",
    error: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <Icon name="x" />
        </button>

        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end">
          <button
            className={`px-4 py-2 rounded-md text-white ${colorClasses[type]}`}
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
