const TABLE_HEADERS = ["#", "Nombre completo", "Documento", "Unidad educativa", "Departamento", "Tutor académico", "Área", "Grado", "Estado", "Acciones"];

export default function TableHeader() {
  return (
    <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-800">
      <tr>
        {TABLE_HEADERS.map((h) => (
          <th key={h} className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}
