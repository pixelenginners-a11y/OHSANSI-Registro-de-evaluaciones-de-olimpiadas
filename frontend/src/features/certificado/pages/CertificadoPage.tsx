import { useState, useMemo, useRef } from 'react';
import { useGetAreas } from '../../areas/hooks';
import { useGetAwardedByArea } from '../hooks';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificadoPage = () => {
  const [olimpistaId, setOlimpistaId] = useState('');
  const [areaIndividual, setAreaIndividual] = useState('');
  const [areaMasiva, setAreaMasiva] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isAccordionMasivaOpen, setIsAccordionMasivaOpen] = useState(true);
  const certificadoRef = useRef<HTMLDivElement>(null);

  // TODO: Obtener olimpiadaId de la olimpiada vigente actual
  const olimpiadaId = 1;

  const { data: areasData } = useGetAreas();
  const { data: awardedData } = useGetAwardedByArea(olimpiadaId, areaIndividual ? parseInt(areaIndividual) : undefined);

  const areas = areasData || [];
  const awarded = awardedData || [];

  // Extraer olimpistas premiados únicos del área seleccionada
  const olympians = useMemo(() => {
    console.log('useMemo awarded:', awarded);
    console.log('awarded length:', awarded?.length);

    if (!awarded || awarded.length === 0) {
      console.log('No hay awarded data');
      return [];
    }

    const result = awarded.map((item: any) => {
      console.log('Processing item:', item);
      const olympian = item.ranked?.inscription?.olympian;
      console.log('Extracted olympian:', olympian);
      if (olympian) {
        return {
          id: olympian.id,
          full_name: olympian.full_name,
          identity_document: olympian.identity_document,
          award_type: item.award_type,
        };
      }
      return null;
    }).filter(Boolean);

    console.log('Final olympians result:', result);
    return result;
  }, [awarded]);

  const descargarPDF = async () => {
    if (!olimpistaId || !areaIndividual) {
      alert('Selecciona olimpista y área primero');
      return;
    }

    if (!certificadoRef.current) {
      alert('Error: No se pudo obtener la referencia del certificado');
      return;
    }

    try {
      console.log('Iniciando captura del certificado...');

      const element = certificadoRef.current;

      // Guardar estilos originales
      const originalMaxWidth = element.style.maxWidth;
      const originalPadding = element.style.padding;
      const originalBorder = element.style.border;

      // Aplicar estilos para PDF (optimizado para A4 landscape)
      element.style.maxWidth = '1200px';
      element.style.padding = '40px';
      element.style.border = '8px solid #1e3a8a';

      // Esperar a que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capturar el certificado como imagen con alta calidad
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      console.log('Canvas creado:', canvas.width, 'x', canvas.height);

      // Restaurar estilos originales
      element.style.maxWidth = originalMaxWidth;
      element.style.padding = originalPadding;
      element.style.border = originalBorder;

      // Crear PDF en orientación horizontal (landscape)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      console.log('PDF creado');

      // Dimensiones de A4 landscape con margen de seguridad
      const pdfWidth = 297; // mm
      const pdfHeight = 210; // mm
      const margin = 10; // mm - margen de seguridad aumentado

      const maxWidth = pdfWidth - (margin * 2);
      const maxHeight = pdfHeight - (margin * 2);

      // Calcular dimensiones de la imagen manteniendo aspecto
      const canvasAspect = canvas.width / canvas.height;
      const maxAspect = maxWidth / maxHeight;

      let imgWidth;
      let imgHeight;
      let offsetX;
      let offsetY;

      // Ajustar para que la imagen se ajuste completamente dentro del PDF con márgenes
      if (canvasAspect > maxAspect) {
        // Canvas más ancho que el área disponible - ajustar por ancho
        imgWidth = maxWidth;
        imgHeight = maxWidth / canvasAspect;
        offsetX = margin;
        offsetY = margin + (maxHeight - imgHeight) / 2;
      } else {
        // Canvas más alto que el área disponible - ajustar por alto
        imgHeight = maxHeight;
        imgWidth = maxHeight * canvasAspect;
        offsetX = margin + (maxWidth - imgWidth) / 2;
        offsetY = margin;
      }

      console.log('Dimensiones calculadas:', imgWidth, 'x', imgHeight);
      console.log('Offset:', offsetX, offsetY);

      // Agregar imagen al PDF centrada
      const imgData = canvas.toDataURL('image/png', 1.0); // Calidad máxima
      console.log('Imagen convertida a base64');

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');
      console.log('Imagen agregada al PDF');

      // Obtener nombre del olimpista para el archivo
      const olimpista = olympians.find((o: any) => o.id.toString() === olimpistaId);
      const nombreArchivo = olimpista
        ? `Certificado_${olimpista.full_name.replace(/\s+/g, '_')}.pdf`
        : 'Certificado.pdf';

      console.log('Guardando PDF como:', nombreArchivo);

      // Descargar PDF
      pdf.save(nombreArchivo);

      console.log('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error detallado al generar PDF:', error);
      if (error instanceof Error) {
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        alert(`Error al generar el PDF: ${error.message}`);
      } else {
        alert('Error desconocido al generar el PDF. Revisa la consola.');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-black mb-6 tracking-tight">Generador de Certificados</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Panel de Control */}
          <div className="space-y-4">

            {/* Selección - Accordion */}
            <div className="relative bg-white rounded-lg shadow-lg border-2 border-black hover:shadow-2xl transition-shadow duration-300">

              <div className="relative rounded-lg overflow-hidden">
                {/* Header Accordion */}
                <button
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  className="w-full p-2.5 sm:p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="font-bold text-black text-xs sm:text-sm tracking-tight truncate">Certificado por olimpista</h3>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-black transition-transform duration-300 flex-shrink-0 ${isAccordionOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Content Accordion */}
                <div className={`overflow-hidden transition-all duration-300 ${isAccordionOpen ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="mb-2.5 sm:mb-3">
                      <div className="h-0.5 bg-black"></div>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">Área</label>
                        <select
                          value={areaIndividual}
                          onChange={(e) => {
                            setAreaIndividual(e.target.value);
                            setOlimpistaId(''); // Reset olimpista cuando cambia el área
                          }}
                          className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-black focus:ring-2 focus:ring-gray-300 transition-all outline-none bg-white hover:border-gray-600"
                        >
                          <option value="">Seleccionar área</option>
                          {areas.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">Olimpista Premiado</label>
                        <select
                          value={olimpistaId}
                          onChange={(e) => setOlimpistaId(e.target.value)}
                          disabled={!areaIndividual}
                          className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-black focus:ring-2 focus:ring-gray-300 transition-all outline-none bg-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">{areaIndividual ? 'Seleccionar olimpista' : 'Primero selecciona un área'}</option>
                          {olympians.map((o: any) => <option key={o.id} value={o.id}>{o.identity_document} - {o.full_name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generar Todos - Accordion */}
            <div className="relative bg-white rounded-lg shadow-lg border-2 border-black hover:shadow-2xl transition-shadow duration-300">

              <div className="relative rounded-lg overflow-hidden">
                {/* Header Accordion */}
                <button
                  onClick={() => setIsAccordionMasivaOpen(!isAccordionMasivaOpen)}
                  className="w-full p-2.5 sm:p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="font-bold text-black text-xs sm:text-sm tracking-tight truncate">Generación Masiva</h3>
                      <p className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">Procesamiento automático</p>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-black transition-transform duration-300 flex-shrink-0 ${isAccordionMasivaOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Content Accordion */}
                <div className={`overflow-hidden transition-all duration-300 ${isAccordionMasivaOpen ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="mb-2.5 sm:mb-3">
                      <div className="h-0.5 bg-black"></div>
                    </div>

                    <div className="space-y-2.5 mb-3 sm:mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">Área</label>
                        <select
                          value={areaMasiva}
                          onChange={(e) => setAreaMasiva(e.target.value)}
                          className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-black focus:ring-2 focus:ring-gray-300 transition-all outline-none bg-white hover:border-gray-600"
                        >
                          <option value="">Todas las áreas</option>
                          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-800 mb-3 sm:mb-4 leading-relaxed font-medium">
                      Genera certificados para todos los premiados del area
                    </p>

                    <button
                      onClick={() => alert('Generando todos')}
                      className="relative w-full bg-black hover:bg-gray-900 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 overflow-hidden group/btn border-2 border-black hover:border-gray-900"
                    >
                      <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></div>
                      <div className="relative flex items-center justify-center gap-2 sm:gap-3 group-hover/btn:text-black transition-colors duration-500">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs sm:text-sm tracking-wide">Generar certificados</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-2">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-semibold text-xs sm:text-sm text-gray-900">Vista Previa</h3>
                <button
                  onClick={descargarPDF}
                  disabled={!olimpistaId || !areaIndividual}
                  className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 bg-blue-900 text-white rounded hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descargar PDF
                </button>
              </div>

              {/* Certificado */}
              <div
                ref={certificadoRef}
                className="relative bg-white text-center shadow-xl mx-auto"
                style={{
                  border: '8px solid #1e3a8a',
                  width: '100%',
                  maxWidth: '900px',
                  aspectRatio: '297 / 210',
                  padding: '32px'
                }}>
                {/* Borde interior dorado */}
                <div className="absolute border pointer-events-none" style={{
                  borderColor: 'rgba(202, 138, 4, 0.3)',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  bottom: '12px',
                  borderWidth: '2px'
                }}></div>

                <div className="relative h-full flex flex-col justify-between">
                  {/* Encabezado institucional */}
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="h-px w-12" style={{ backgroundColor: '#1e3a8a' }}></div>
                      <svg className="w-7 h-7" fill="#1e3a8a" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      <div className="h-px w-12" style={{ backgroundColor: '#1e3a8a' }}></div>
                    </div>
                    <p className="text-xs font-bold tracking-wide" style={{ color: '#1e3a8a' }}>UNIVERSIDAD MAYOR DE SAN SIMÓN</p>
                    <p className="text-[10px] tracking-wide" style={{ color: '#4b5563' }}>FACULTAD DE CIENCIAS Y TECNOLOGÍA</p>
                  </div>

                  {/* Título */}
                  <div className="mb-3">
                    <h2 className="text-2xl font-black tracking-wide mb-1.5" style={{ color: '#1e3a8a' }}>
                      Olimpiada en Ciencias y Tecnología San Simón - Oh! SanSi
                    </h2>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="max-w-3xl mx-auto space-y-2.5">
                      <p className="text-xs font-serif italic" style={{ color: '#374151' }}>
                        Se otorga el presente certificado a:
                      </p>

                      {/* Nombre */}
                      <div className="py-2">
                        <h3 className="text-xl font-bold mb-1.5" style={{ color: '#1e3a8a' }}>
                          {olimpistaId && areaIndividual ? olympians.find((o: any) => o.id.toString() === olimpistaId)?.full_name || '[Nombre del Participante]' : '[Nombre del Participante]'}
                        </h3>
                        <div className="h-0.5 w-40 mx-auto" style={{ backgroundColor: '#1e3a8a' }}></div>
                      </div>

                      {/* Descripción */}
                      <p className="text-xs leading-relaxed px-3" style={{ color: '#374151' }}>
                        Por su destacada participación en la Olimpiada en Ciencias y Tecnología San Simón - Oh! SanSi
                        {areaIndividual && `, en el área de ${areas.find((a: any) => a.id.toString() === areaIndividual)?.name}`}, demostrando compromiso académico y excelencia.
                      </p>
                    </div>
                  </div>

                  {/* Firmas y Pie de página */}
                  <div className="mt-auto">
                    {/* Firmas */}
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div className="text-center">
                        <div className="h-12 mb-1.5"></div>
                        <div className="border-t-2 w-28 mx-auto mb-1" style={{ borderColor: '#1e3a8a' }}></div>
                        <p className="text-[10px] font-bold" style={{ color: '#1f2937' }}>Director General</p>
                        <p className="text-[9px]" style={{ color: '#4b5563' }}>FCyT - UMSS</p>
                      </div>
                      <div className="text-center">
                        <div className="h-12 mb-1.5"></div>
                        <div className="border-t-2 w-28 mx-auto mb-1" style={{ borderColor: '#1e3a8a' }}></div>
                        <p className="text-[10px] font-bold" style={{ color: '#1f2937' }}>Coordinador</p>
                        <p className="text-[9px]" style={{ color: '#4b5563' }}>Olimpiadas Científicas</p>
                      </div>
                    </div>

                    {/* Pie de página */}
                    <div className="text-center">
                      <p className="text-[10px] mb-1.5" style={{ color: '#6b7280' }}>
                        Cochabamba, {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-10" style={{ backgroundColor: 'rgba(202, 138, 4, 0.5)' }}></div>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#ca8a04' }}></div>
                        <div className="h-px w-10" style={{ backgroundColor: 'rgba(202, 138, 4, 0.5)' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificadoPage;