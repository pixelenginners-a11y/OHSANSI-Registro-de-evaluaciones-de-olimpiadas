import FileDropZone from "./FileDropZone";
import { useState } from "react";
import { parseCSVText } from "../logic/validarCSVInscritos";
import { InfoModal } from "./InfoModal";

type Props = { onParse: (rows: Record<string, string>[], fileName: string) => void };

export default function CSVDropZone({ onParse }: Props) {
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCSVText(text);
    if (rows.length === 0) {
      setShowEmptyModal(true);
    }else{
      try {
        onParse(rows, file.name);
      } catch (error) {
        setShowErrorModal(true);
      }
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
        isOpen={showEmptyModal}
        title="Archivo vacío"
        message="El archivo CSV que has subido no contiene datos."
        type="warning"
        onClose={() => setShowEmptyModal(false)}
      />

      <InfoModal
        isOpen={showErrorModal}
        title="Formato incorrecto"
        message="El archivo CSV tiene un formato incorrecto o contiene datos inválidos."
        type="error"
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
}
