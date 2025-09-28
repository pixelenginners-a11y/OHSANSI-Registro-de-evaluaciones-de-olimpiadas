import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useDeleteResponsable, useResponsables } from '../services/responsables.service'
import type { Responsable } from '../types'

export default function ResponsablesPage() {
  const [q, setQ] = useState('')
  const { data, isLoading } = useResponsables(q)
  const del = useDeleteResponsable()
  const rows = data ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Responsables por área</h1>
        <div className="flex gap-2">
          <input
            placeholder="Buscar por nombre, área o CI…"
            className="w-64 rounded-lg border px-3 py-2 outline-none focus:ring"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Link
            to="/responsables/nuevo"
            className="rounded-xl px-4 py-2 font-medium shadow-sm border bg-[#F77F00] text-white"
          >
            Registrar nuevo
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">CI</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Área</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={5}>Cargando…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td className="p-3" colSpan={5}>Sin registros</td></tr>}
            {rows.map((r: Responsable) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.nombreCompleto}</td>
                <td className="p-3">{r.ci}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.areaNombre ?? r.areaId}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link to="/responsables/$id" params={{ id: r.id }} className="rounded-lg border px-3 py-1">
                      Editar
                    </Link>
                    <button
                      className="rounded-lg border px-3 py-1 text-red-700"
                      onClick={() => { if (confirm('¿Eliminar este responsable?')) del.mutate(r.id) }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
