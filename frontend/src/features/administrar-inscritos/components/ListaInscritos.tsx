import type { Inscrito } from '../types'
import FilaInscrito from './FilaInscrito'

type Props = {
  inscritos: Inscrito[]
  onEditar: (inscrito: Inscrito) => void
  onEliminar: (id: number) => void
}

export default function ListaInscritos({ inscritos, onEditar, onEliminar }: Props) {
  if (inscritos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay concursantes inscritos
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Lista de Concursantes</h2>
      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Nombre completo
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                CI
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Unidad educativa
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Departamento
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Área
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                Curso
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {inscritos.map((inscrito) => (
              <FilaInscrito
                key={inscrito.id}
                inscrito={inscrito}
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
