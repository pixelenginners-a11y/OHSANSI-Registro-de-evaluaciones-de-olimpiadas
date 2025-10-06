import { useState } from 'react'
import type { Nivel } from '../types'
import ListaNiveles from '../components/ListaNiveles'
import FormularioNivel from '../components/FormularioNivel'
import FormularioEditarNivel from '../components/FormularioEditarNivel'
import Modal from '../components/Modal'
import { useGetGrades, useCreateGrade, useUpdateGrade, useDeleteGrade } from '../hooks'

export default function NivelesPage() {
  const { data: niveles, isLoading } = useGetGrades()
  const createGrade = useCreateGrade()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [nivelSeleccionado, setNivelSeleccionado] = useState<Nivel | null>(null)
  const [idToDelete, setIdToDelete] = useState<number>(0)

  const updateGrade = useUpdateGrade(nivelSeleccionado?.id || 0)
  const deleteGrade = useDeleteGrade(idToDelete)

  const handleEditar = (nivel: Nivel) => {
    setNivelSeleccionado(nivel)
    setIsEditModalOpen(true)
  }

  const handleAgregarNivel = (name: string, active: boolean, description?: string) => {
    createGrade.mutate({ name, active, description }, {
      onSuccess: () => {
        setIsModalOpen(false)
      }
    })
  }

  const handleEditarNivel = (_id: number, name: string, active: boolean, description?: string) => {
    updateGrade.mutate({ name, active, description }, {
      onSuccess: () => {
        setIsEditModalOpen(false)
      }
    })
  }

  const handleEliminarNivel = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este nivel?')) {
      setIdToDelete(id)
      deleteGrade.mutate()
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando niveles...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Niveles</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Nuevo Nivel
        </button>
      </div>

      <ListaNiveles
        niveles={niveles || []}
        onEditar={handleEditar}
        onEliminar={handleEliminarNivel}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Nivel"
      >
        <FormularioNivel
          onAgregar={handleAgregarNivel}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {nivelSeleccionado && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Nivel"
        >
          <FormularioEditarNivel
            nivel={nivelSeleccionado}
            onEditar={handleEditarNivel}
            onClose={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
