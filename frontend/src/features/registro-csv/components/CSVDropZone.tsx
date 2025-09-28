import { useRef, useState } from "react";
import { parseCSVText } from "../logic/validarCSVInscritos";

type Props = { onParse: (rows: Record<string,string>[], fileName:string)=>void };

export default function CSVDropZone({ onParse }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  const leerArchivo = async (file: File) => {
    const text = await file.text();
    const rows = parseCSVText(text);
    onParse(rows, file.name);
  };

  return (
        <div
      className={`card flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-12 transition
        ${hover ? "border-gray-400 bg-gray-50" : "border-gray-300 bg-white"}`}
      onDragOver={(e)=>{e.preventDefault(); setHover(true);}}
      onDragLeave={()=>setHover(false)}
      onDrop={(e)=>{e.preventDefault(); setHover(false); const f = e.dataTransfer.files?.[0]; if(f) leerArchivo(f);}}
      onClick={()=>inputRef.current?.click()}
      title="Soltar o hacer clic para escoger archivo CSV"
    >
      <div className="text-center">
        <div className="text-4xl">⬆️</div>
        <div className="mt-2">
          <button className="btn btn-sec">Escoger archivo</button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={(e)=>{ const f = e.target.files?.[0]; if(f) leerArchivo(f); }}
        />
      </div>
    </div>
  );
  
}
