const AreasTableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Área</th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Responsable</th>
        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Oro</th>
        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Plata</th>
        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Bronce</th>
        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Menciones</th>
        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
      </tr>
    </thead>
  );
};

export default AreasTableHeader;
