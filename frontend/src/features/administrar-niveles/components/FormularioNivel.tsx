import { useState } from 'react'

type Props = {
  onAgregar: (name: string, active: boolean, description?: string) => void
  onClose: () => void
}

export default function FormularioNivel({ onAgregar, onClose }: Props) {
  const [name, setName] = useState('')
  const [active, setActive] = useState(true)
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (name.trim()) {
      onAgregar(name, active, description || undefined)
      setName('')
      setActive(true)
      setDescription('')
      onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nombre de Nivel
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese el nombre del nivel"
          autoFocus
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Descripción (opcional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese una descripción"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          value={active ? 'Activo' : 'Inactivo'}
          onChange={(e) => setActive(e.target.value === 'Activo')}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Agregar Nivel
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
