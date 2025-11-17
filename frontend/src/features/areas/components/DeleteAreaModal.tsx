import { ConfirmModal } from '../../../components/ConfirmModal';
import type { Area } from '../types/area';

interface DeleteAreaModalProps {
  isOpen: boolean;
  area: Area | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAreaModal = ({
  isOpen,
  area,
  onClose,
  onConfirm,
}: DeleteAreaModalProps) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      message={`¿Estás seguro de eliminar el área "${area?.name}"?`}
    />
  );
};
