import FileDropZone from "./FileDropZone";
import { parseCSVText } from "../logic/validarCSVInscritos";

type Props = { onParse: (rows: Record<string,string>[], fileName:string)=>void };

export default function CSVDropZone({ onParse }: Props) {
  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCSVText(text);
    onParse(rows, file.name);
  };

  return (
    <FileDropZone
      accept=".csv,text/csv"
      onFile={handleFile}
      title="Soltar archivo CSV aquí"
      buttonText="Escoger archivo"
    />
  );
}
