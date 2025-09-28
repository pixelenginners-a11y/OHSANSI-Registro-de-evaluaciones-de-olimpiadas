import { useEffect, useMemo, useState } from 'react'
import { useAreas } from '../services/responsables.service'
import type { ResponsableInput, Area } from '../types'
import umssLogo from '../../../assets/umss.jpg'


type Props = {
  initial?: Partial<ResponsableInput>
  loading?: boolean
  submitLabel?: string
  onSubmit: (values: ResponsableInput) => void | Promise<void>
  apiError?: string | null
}

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ResponsibleForm({
  initial, loading, submitLabel = 'Registrar Responsable', onSubmit, apiError,
}: Props) {
  const { data: areas } = useAreas()
  const [values, setValues] = useState<ResponsableInput>({
    nombreCompleto: initial?.nombreCompleto ?? '',
    nombreUsuario: initial?.nombreUsuario ?? '',
    email: initial?.email ?? '',
    password: initial?.password ?? '',
    ci: initial?.ci ?? '',
    areaId: initial?.areaId ?? '',
    telefono: initial?.telefono ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!initial) return
    setValues(v => ({
      ...v,
      nombreCompleto: initial.nombreCompleto ?? v.nombreCompleto,
      nombreUsuario: initial.nombreUsuario ?? v.nombreUsuario,
      email: initial.email ?? v.email,
      password: initial.password ?? v.password,
      ci: initial.ci ?? v.ci,
      areaId: initial.areaId ?? v.areaId,
      telefono: initial.telefono ?? v.telefono,
    }))
  }, [initial])

  function validate(v: ResponsableInput) {
    const e: Record<string, string> = {}
    if (!v.nombreCompleto.trim()) e.nombreCompleto = 'Nombre completo es obligatorio'
    if (!v.ci.trim()) e.ci = 'Documento de identidad (CI) es obligatorio'
    if (!emailRx.test(v.email)) e.email = 'Formato de correo inválido'
    if (!v.areaId) e.areaId = 'Seleccione un área'
    setErrors(e)
    return e
  }

  const canSubmit = useMemo(
    () =>
      values.nombreCompleto.trim() &&
      values.ci.trim() &&
      emailRx.test(values.email) &&
      values.areaId &&
      Object.keys(errors).length === 0,
    [values, errors],
  ) as unknown as boolean

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate(values)
    if (Object.keys(e).length) return
    await onSubmit(values)
  }

  return (
    <div className="flex gap-6">
      <aside className="hidden w-56 shrink-0 rounded-xl border bg-white p-4 shadow-sm md:block">
        <div className="mb-6 grid place-items-center h-24 rounded-lg border bg-gray-50">
  <img src={umssLogo} alt="Logo UMSS" className="max-h-16 object-contain" />
</div>
        <nav className="space-y-1">
          <div className="text-sm font-semibold">Responsables Académicos ▾</div>
          <div className="pl-3 text-sm text-gray-700">Registro</div>
        </nav>
      </aside>

      <section className="flex-1 rounded-xl border bg-white p-6 shadow-sm">

        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Nombre completo*</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                value={values.nombreCompleto}
                onChange={(e) => setValues({ ...values, nombreCompleto: e.target.value })}
              />
              {errors.nombreCompleto && <p className="mt-1 text-xs text-red-600">{errors.nombreCompleto}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Nombre de Usuario</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                value={values.nombreUsuario ?? ''}
                onChange={(e) => setValues({ ...values, nombreUsuario: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Correo Electrónico</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                value={values.password ?? ''}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Área de Evaluación*</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring bg-white"
                value={values.areaId}
                onChange={(e) => setValues({ ...values, areaId: e.target.value })}
              >
                <option value="">Selecciona un área…</option>
                {areas?.map((a: Area) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              {errors.areaId && <p className="mt-1 text-xs text-red-600">{errors.areaId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Teléfono</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                value={values.telefono ?? ''}
                onChange={(e) => setValues({ ...values, telefono: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={!canSubmit || !!loading}
              className="rounded-xl px-5 py-2 font-medium shadow-sm border bg-gray-700 text-white disabled:opacity-50"
            >
              {loading ? 'Guardando…' : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
