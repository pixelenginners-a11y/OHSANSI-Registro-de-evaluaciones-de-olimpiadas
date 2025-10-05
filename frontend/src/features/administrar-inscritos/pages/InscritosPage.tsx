import { useState } from 'react'
import type { Inscrito, InscritoCreate, InscritoUpdate } from '../types'
import ListaInscritos from '../components/ListaInscritos'
import FormularioInscrito from '../components/FormularioInscrito'
import FormularioEditarInscrito from '../components/FormularioEditarInscrito'
import Modal from '../components/Modal'
import { useGetInscritos, useCreateInscrito, useUpdateInscrito, useDeleteInscrito } from '../hooks'
import { useGetAreas } from '../../../api/areas'
import { useGetGrades } from '../../administrar-niveles/hooks'

export default function InscritosPage() {
  const { data: inscritos, isLoading } = useGetInscritos()
  const { data: areas = [] } = useGetAreas()
  const { data: grades = [] } = useGetGrades()
  const createInscrito = useCreateInscrito()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [inscritoSeleccionado, setInscritoSeleccionado] = useState<Inscrito | null>(null)
  const [idToDelete, setIdToDelete] = useState<number>(0)

  const updateInscrito = useUpdateInscrito(inscritoSeleccionado?.id || 0)
  const deleteInscrito = useDeleteInscrito(idToDelete)

  const handleEditar = (inscrito: Inscrito) => {
    setInscritoSeleccionado(inscrito)
    setIsEditModalOpen(true)
  }

  const handleAgregarInscrito = (data: InscritoCreate) => {
    createInscrito.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false)
      }
    })
  }

  const handleEditarInscrito = (_id: number, data: InscritoUpdate) => {
    updateInscrito.mutate(data, {
      onSuccess: () => {
        setIsEditModalOpen(false)
      }
    })
  }

  const handleEliminarInscrito = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este concursante?')) {
      setIdToDelete(id)
      deleteInscrito.mutate()
    }
  }

  if (isLoading) {
    return <div className="p-6">Cargando concursantes...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Concursantes</h1>
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
          Nuevo Concursante
        </button>
      </div>

      <ListaInscritos
        inscritos={inscritos || []}
        onEditar={handleEditar}
        onEliminar={handleEliminarInscrito}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Concursante"
      >
        <FormularioInscrito
          onAgregar={handleAgregarInscrito}
          onClose={() => setIsModalOpen(false)}
          areas={areas}
          grades={grades}
        />
      </Modal>

      {inscritoSeleccionado && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Concursante"
        >
          <FormularioEditarInscrito
            inscrito={inscritoSeleccionado}
            onEditar={handleEditarInscrito}
            onClose={() => setIsEditModalOpen(false)}
            areas={areas}
            grades={grades}
          />
        </Modal>
      )}
    </div>
  )
}
