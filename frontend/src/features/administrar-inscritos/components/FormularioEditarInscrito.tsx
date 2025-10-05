import { useState, useEffect } from 'react'
import type { Inscrito, InscritoUpdate, Area, Grade } from '../types'

type Props = {
  inscrito: Inscrito
  onEditar: (id: number, data: InscritoUpdate) => void
  onClose: () => void
  areas: Area[]
  grades: Grade[]
}

export default function FormularioEditarInscrito({ inscrito, onEditar, onClose, areas, grades }: Props) {
  const [fullName, setFullName] = useState(inscrito.olympian.full_name)
  const [identityDocument, setIdentityDocument] = useState(inscrito.olympian.identity_document)
  const [educationalInstitution, setEducationalInstitution] = useState(inscrito.olympian.educational_institution)
  const [department, setDepartment] = useState(inscrito.olympian.department)
  const [academicTutor, setAcademicTutor] = useState(inscrito.olympian.academic_tutor || '')
  const [areaId, setAreaId] = useState<number>(inscrito.area_id)
  const [gradeId, setGradeId] = useState<number>(inscrito.grade_id)

  useEffect(() => {
    setFullName(inscrito.olympian.full_name)
    setIdentityDocument(inscrito.olympian.identity_document)
    setEducationalInstitution(inscrito.olympian.educational_institution)
    setDepartment(inscrito.olympian.department)
    setAcademicTutor(inscrito.olympian.academic_tutor || '')
    setAreaId(inscrito.area_id)
    setGradeId(inscrito.grade_id)
  }, [inscrito])

  const handleSubmit = () => {
    if (fullName.trim() && identityDocument.trim() && educationalInstitution.trim() && department.trim() && areaId > 0 && gradeId > 0) {
      onEditar(inscrito.id, {
        olympian: {
          full_name: fullName,
          identity_document: identityDocument,
          educational_institution: educationalInstitution,
          department: department,
          academic_tutor: academicTutor || undefined
        },
        area_id: areaId,
        grade_id: gradeId
      })
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
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Área
        </label>
        <select
          value={areaId}
          onChange={(e) => setAreaId(Number(e.target.value))}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={0}>Seleccione un área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nivel
        </label>
        <select
          value={gradeId}
          onChange={(e) => setGradeId(Number(e.target.value))}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={0}>Seleccione un nivel</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>{grade.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Guardar Cambios
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
