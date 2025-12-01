import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Olympian } from '../types';

interface ExportPDFButtonProps {
  data: Olympian[];
}

export function ExportPDFButton({ data }: ExportPDFButtonProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      startY: 28,
      head: [['ID', 'Nombre Completo', 'Documento', 'Institución', 'Departamento']],
      body: data.map(item => [
        item.id,
        item.full_name,
        item.identity_document,
        item.educational_institution,
        item.department,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 28 }
    });

    // Guardar el PDF
    doc.save(`inscritos-${Date.now()}.pdf`);
  };

  return (
    <button
      onClick={handleExportPDF}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
    >
      Exportar PDF
    </button>
  );
}
