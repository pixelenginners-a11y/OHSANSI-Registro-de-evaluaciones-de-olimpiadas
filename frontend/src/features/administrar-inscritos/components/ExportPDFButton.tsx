import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Olympian } from '../types';

interface ExportPDFButtonProps {
  data: Olympian[];
}

export function ExportPDFButton({ data }: ExportPDFButtonProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(16);
    doc.text('Lista de Inscritos', 14, 15);

    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 22);

    // Generar tabla
    autoTable(doc, {
      startY: 28,
      head: [['ID', 'Nombre Completo', 'Documento', 'Contacto', 'Institución', 'Departamento', 'Grado']],
      body: data.map(item => [
        item.id,
        item.full_name,
        item.identity_document,
        item.legal_guardian_contact,
        item.educational_institution,
        item.department,
        item.school_grade
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
