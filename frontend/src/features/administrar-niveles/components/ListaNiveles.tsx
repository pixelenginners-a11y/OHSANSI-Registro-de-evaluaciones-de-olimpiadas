import type { Nivel } from '../types'
import FilaNivel from './FilaNivel'

type Props = {
  niveles: Nivel[]
  onEditar: (nivel: Nivel) => void
  onEliminar: (id: number) => void
}

export default function ListaNiveles({ niveles, onEditar, onEliminar }: Props) {
  if (niveles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay niveles registrados
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Lista de Niveles</h2>
      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Nombre del Nivel
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Estado
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {niveles.map((nivel) => (
              <FilaNivel
                key={nivel.id}
                nivel={nivel}
                onEditar={onEditar}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
