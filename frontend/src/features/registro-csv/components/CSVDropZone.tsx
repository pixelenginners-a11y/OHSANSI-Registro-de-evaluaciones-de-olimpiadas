import FileDropZone from "./FileDropZone";
import { useState } from "react";
import { parseCSVText } from "../logic/validarCSVInscritos";
import { InfoModal } from "./InfoModal";

type Props = { onParse: (rows: Record<string, string>[], fileName: string) => void };

export default function CSVDropZone({ onParse }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCSVText(text);
    if (rows.length === 0) {
      setShowModal(true);
      onParse(rows, file.name);
    }
  };

  return (
    <>
      <FileDropZone
        accept=".csv,text/csv"
        onFile={handleFile}
        title="Soltar archivo CSV aquí"
        buttonText="Escoger archivo"
      />

      <InfoModal
        isOpen={showModal}
        title="Archivo vacío"
        message="El archivo CSV que has subido no contiene datos."
        type="warning"
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
