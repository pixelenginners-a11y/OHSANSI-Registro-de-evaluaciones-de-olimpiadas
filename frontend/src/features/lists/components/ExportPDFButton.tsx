import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ListItem } from '../types/listItem';

interface ExportPDFButtonProps {
  data: ListItem[];
  listName: string;
}

export function ExportPDFButton({ data, listName }: ExportPDFButtonProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(listName, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableData = data.map((item, index) => {
      if (item.inscription) {
        return [
          index + 1,
          item.inscription.olympian?.full_name || 'N/A',
          item.inscription.olympian?.identity_document || 'N/A',
          item.inscription.olympian?.educational_institution || 'N/A',
          item.inscription.olympian?.department || 'N/A',
          'Individual'
        ];
      }

      if (item.group) {
        return [
          index + 1,
          item.group.name,
          `Miembros: ${item.group.members?.length || 0}`,
          'Grupo',
          'N/A',
          'Grupal'
        ];
      }

      return [
        index + 1,
        'Sin información',
        'N/A',
        'N/A',
        'N/A',
        'Desconocido'
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Nombre', 'Documento/Miembros', 'Institución', 'Departamento', 'Tipo']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 28 }
    });

    const fileName = `lista-${listName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={handleExportPDF}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Exportar PDF
    </button>
  );
}