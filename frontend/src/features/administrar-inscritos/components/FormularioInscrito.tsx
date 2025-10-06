import { useState } from 'react'
import type { InscritoCreate } from '../types'

type Props = {
  onAgregar: (data: InscritoCreate) => void
  onClose: () => void
}

export default function FormularioInscrito({ onAgregar, onClose }: Props) {
  const [fullName, setFullName] = useState('')
  const [identityDocument, setIdentityDocument] = useState('')
  const [educationalInstitution, setEducationalInstitution] = useState('')
  const [department, setDepartment] = useState('')
  const [academicTutor, setAcademicTutor] = useState('')

  const handleSubmit = () => {
    if (fullName.trim() && identityDocument.trim() && educationalInstitution.trim() && department.trim()) {
      onAgregar({
        full_name: fullName,
        identity_document: identityDocument,
        educational_institution: educationalInstitution,
        department: department,
        academic_tutor: academicTutor || undefined
      })
      setFullName('')
      setIdentityDocument('')
      setEducationalInstitution('')
      setDepartment('')
      setAcademicTutor('')
      onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese el nombre completo"
          autoFocus
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          CI
        </label>
        <input
          type="text"
          value={identityDocument}
          onChange={(e) => setIdentityDocument(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese el CI"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Unidad educativa
        </label>
        <input
          type="text"
          value={educationalInstitution}
          onChange={(e) => setEducationalInstitution(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese la unidad educativa"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Departamento
        </label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese el departamento"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tutor académico (opcional)
        </label>
        <input
          type="text"
          value={academicTutor}
          onChange={(e) => setAcademicTutor(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese el tutor académico"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Agregar Concursante
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
