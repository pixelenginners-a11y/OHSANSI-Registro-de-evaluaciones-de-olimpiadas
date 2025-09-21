import { useState, type ChangeEvent, type FormEvent } from 'react';
import '../style/global.css'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/RegistroEvaluador')({
  component: RegistroEvaluador,
})

function RegistroEvaluador() {
    const [form, setForm] = useState({
    nombreCompleto: "",
    nombreUsuario: "",
    correo: "",
    contrasena: "",
    area: "Historia",
    telefono: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos del evaluador:", form);
    alert("Evaluador registrado (demo)");
  };
  return <div className="min-h-screen bg-[var(--color-crema)] flex flex-col">
      {/* Top bar */}
      <div className="h-10 bg-[var(--color-azul-umss)] border-b border-[var(--color-azul-umss)]" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-[var(--color-blanco)] border-r border-[var(--color-azul-umss)]/20 p-4 hidden sm:block">
          <div className="border border-[var(--color-azul-umss)] rounded-lg h-24 flex items-center justify-center text-[color:var(--color-azul-umss)] mb-6">
            LOGO
          </div>

          <div className="text-[color:var(--color-azul-umss)] font-semibold">Evaluadores ▾</div>
          <div className="mt-1 text-sm text-[color:var(--color-azul-umss)]/80">Registro</div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-[color:var(--color-azul-umss)]">Registro de Evaluadores</h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 max-w-4xl bg-[var(--color-blanco)] border border-[var(--color-azul-umss)] rounded-xl p-4 md:p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre completo" htmlFor="nombreCompleto">
                <input
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Ej. María Pérez"
                  className="w-full rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-3 py-2 text-sm text-[color:var(--color-azul-umss)] placeholder:text-[color:var(--color-azul-umss)]/60 outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)] focus:border-[var(--color-azul-umss)]"
                />
              </Field>

              <Field label="Nombre de Usuario" htmlFor="nombreUsuario">
                <input
                  id="nombreUsuario"
                  name="nombreUsuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  placeholder="Ej. mperez"
                  className="w-full rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-3 py-2 text-sm text-[color:var(--color-azul-umss)] placeholder:text-[color:var(--color-azul-umss)]/60 outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)] focus:border-[var(--color-azul-umss)]"
                />
              </Field>

              <Field label="Correo Electrónico" htmlFor="correo">
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-3 py-2 text-sm text-[color:var(--color-azul-umss)] placeholder:text-[color:var(--color-azul-umss)]/60 outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)] focus:border-[var(--color-azul-umss)]"
                />
              </Field>

              <Field label="Contraseña" htmlFor="contrasena">
                <input
                  id="contrasena"
                  type="password"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-3 py-2 text-sm text-[color:var(--color-azul-umss)] placeholder:text-[color:var(--color-azul-umss)]/60 outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)] focus:border-[var(--color-azul-umss)]"
                />
              </Field>

              <Field label="Área de Evaluación" htmlFor="area">
                <select
                  id="area"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-3 py-2 text-sm text-[color:var(--color-azul-umss)] outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)] focus:border-[var(--color-azul-umss)]"
                >
                  <option>Historia</option>
                  <option>Matemática</option>
                  <option>Ciencias</option>
                  <option>Lenguaje</option>
                </select>
              </Field>

              <Field label="Teléfono" htmlFor="telefono">
                <input
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ej. 76543210"
                  className="w-full rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-3 py-2 text-sm text-[color:var(--color-azul-umss)] placeholder:text-[color:var(--color-azul-umss)]/60 outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)] focus:border-[var(--color-azul-umss)]"
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-[var(--color-rojo-umss)] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)]"
              >
                Registrar Evaluador
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    nombreCompleto: "",
                    nombreUsuario: "",
                    correo: "",
                    contrasena: "",
                    area: "Historia",
                    telefono: "",
                  })
                }
                className="inline-flex items-center rounded-lg border border-[var(--color-azul-umss)] bg-[var(--color-blanco)] px-4 py-2 text-sm font-medium text-[color:var(--color-azul-umss)] hover:bg-[var(--color-crema)] focus:outline-none focus:ring-2 focus:ring-[var(--color-azul-umss)]"
              >
                Limpiar
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
}
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[color:var(--color-azul-umss)]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}