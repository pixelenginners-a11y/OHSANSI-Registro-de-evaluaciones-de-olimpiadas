import { useRef, useState } from "react";

type Props = {
  accept?: string;
  onFile: (file: File) => void;
  title?: string;
  buttonText?: string;
};

export default function FileDropZone({
  accept, onFile, title="Soltar archivo aquí", buttonText="Escoger archivo",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  return (
    <div
      className={[
        "group relative flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-12 transition",
        hover ? "border-neutral-400 bg-neutral-50" : "border-neutral-300 bg-white",
      ].join(" ")}
      onDragOver={(e)=>{e.preventDefault(); setHover(true);}}
      onDragLeave={()=>setHover(false)}
      onDrop={(e)=>{e.preventDefault(); setHover(false); const f = e.dataTransfer.files?.[0]; if(f) onFile(f);}}
      onClick={()=>inputRef.current?.click()}
      title="Soltar o hacer clic para escoger"
    >
      <div className="text-center">
        
        <p className="text-base font-semibold text-neutral-900">{title}</p>
        <p className="mt-1 text-sm text-neutral-600">o</p>
        <button className="mt-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition">
          {buttonText}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e)=>{ const f = e.target.files?.[0]; if(f) onFile(f); }}
        />
      </div>
    </div>
  );
}
