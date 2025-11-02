import { useState, useEffect, useMemo } from 'react';
import type { FilaCSVParseada } from '../types/inscritos';

/**
 * Hook para controlar la paginación de datos
 * @param validas - Array de datos a paginar
 * @param pageSize - Cantidad de elementos por página
 * @returns Objeto con página actual, funciones de control y datos paginados
 */
export const usePageController = (validas: FilaCSVParseada[], pageSize: number) => {
  // Página actual (inicia en 1)
  const [page, setPage] = useState(1);

  // Total de elementos y páginas
  const total = validas.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  // Auto-ajustar página si queda fuera de rango cuando cambian los datos
  useEffect(() => {
    if (page > pages && pages > 0) {
      setPage(pages);
    }
  }, [page, pages]);

  // Calcular slice de datos para la página actual
  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return validas.slice(start, start + pageSize);
  }, [page, pageSize, validas]);

  return {
    page,      // Página actual
    setPage,   // Cambiar de página
    pages,     // Total de páginas
    slice,     // Datos de la página actual
  };
};
