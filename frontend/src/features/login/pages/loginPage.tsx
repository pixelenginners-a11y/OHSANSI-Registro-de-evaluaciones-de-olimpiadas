// src/features/login/pages/loginPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import umssLogo from "../../../assets/umss-logo.png";

export type Rol = "Administrador" | "Responsable" | "Evaluador";
const ROLES: Rol[] = ["Administrador", "Responsable", "Evaluador"];

type Props = {
  onSubmit?: (
    email: string,
    password: string,
    rol: Rol,
    remember: boolean
  ) => Promise<void> | void;
};

export default function LoginPage({ onSubmit }: Props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [rol, setRol] = useState<Rol>("Administrador");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Permisivo para pruebas: email > 3, password > 0
  const canSubmit = email.trim().length > 3 && pwd.trim().length > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    try {
      setErr(null);
      setLoading(true);

      if (onSubmit) {
        await onSubmit(email, pwd, rol, remember);
      } else {
        // Fallback de demo si no te pasan onSubmit desde la ruta
        await new Promise((r) => setTimeout(r, 600));
        navigate({ to: "/app", replace: true });
      }
    } catch (error: any) {
      setErr(error?.message ?? "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg bg-white border-2 border-[var(--color-secondary-gray)] " +
    "px-3 py-2 placeholder:text-black/40 outline-none transition " +
    "focus:border-[var(--color-secondary-1)] focus:ring-0";

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark)] text-[var(--color-primary-light)]">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-[var(--color-primary-light)] grid place-items-center">
          <span className="font-semibold text-[var(--color-primary-light)]">O</span>
        </div>
        <span className="font-semibold tracking-wide text-[var(--color-primary-light)]">
          OHSANSI
        </span>
      </header>

      {/* Título */}
      <div className="text-center px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary-light)]">
          OHSANSI – Registro de Evaluaciones
        </h1>
        <p className="text-sm text-[var(--color-accent-gray)]">
          Ingrese sus credenciales para acceder al sistema
        </p>
      </div>

      {/* Panel */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[var(--color-primary-light)]"
          style={{
            boxShadow: "0 16px 40px -20px rgba(0,0,0,.35)",
            border: "1px solid var(--color-secondary-gray)",
          }}
        >
          <div className="grid md:grid-cols-2">
            {/* Columna izquierda con logo UMSS */}
            <div
              className="relative p-8"
              style={{
                background:
                  "color-mix(in srgb, var(--color-secondary-2) 16%, var(--color-primary-light))",
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_10%_0%,rgba(0,0,0,.06),transparent)]" />
              <div className="relative">
                <h2 className="text-lg font-semibold text-center mb-2 text-[var(--color-primary-dark)]">
                  Bienvenido/a
                </h2>
                <p className="text-sm text-center text-black/60 mb-6 max-w-md mx-auto">
                  Sistema oficial para gestión de áreas, responsables, evaluadores y
                  participantes de la Olimpiada UMSS.
                </p>

                <div className="mx-auto grid place-items-center">
                  <div className="w-72 h-72 bg-white border border-[var(--color-secondary-gray)] rounded-md grid place-items-center overflow-hidden">
                    <img
                      src={umssLogo}
                      alt="Logo UMSS"
                      className="w-[70%] h-[70%] object-contain"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: formulario */}
            <div className="p-8 text-[var(--color-primary-dark)]">
              <h2 className="text-lg font-semibold text-center mb-4">
                Iniciar Sesión
              </h2>

              {err && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
                  {err}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium mb-1">
                    Correo / Usuario
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="usuario@umss.edu.bo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={inputCls}
                    required
                  />
                  <p className="mt-1 text-[10px] text-black/50">
                    Use su correo institucional si cuenta con uno.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      autoComplete="current-password"
                      className={inputCls + " pr-10"}
                      required
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px]">
                    <a href="#" className="text-[var(--color-secondary-1)] hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                    <a href="#" className="text-[var(--color-secondary-1)] hover:underline">
                      No puedo iniciar sesión
                    </a>
                  </div>
                </div>

                {/* Rol */}
                <div>
                  <label htmlFor="rol" className="block text-xs font-medium mb-1">
                    Tipo de Usuario
                  </label>
                  <select
                    id="rol"
                    value={rol}
                    onChange={(e) => setRol(e.target.value as Rol)}
                    className="w-full rounded-lg bg-white border-2 border-[var(--color-secondary-gray)] px-3 py-2
                               focus:border-[var(--color-secondary-1)] focus:ring-0 outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recordarme */}
                <label className="inline-flex items-center gap-2 text-sm select-none">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-[var(--color-secondary-gray)]"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Recordarme
                </label>

                {/* Botón */}
                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  aria-busy={loading}
                  className="
                    w-full inline-flex items-center justify-center gap-2
                    rounded-2xl px-6 py-3.5 font-semibold text-white
                    ring-1 ring-[var(--color-accent-red)]/70
                    shadow-[0_18px_34px_-16px_rgba(253,63,91,.7)]
                    transition focus:outline-none focus-visible:ring-4
                    focus-visible:ring-[var(--color-accent-red)]/35
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 92%, white) 0%, var(--color-accent-red) 100%)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 85%, white) 0%, color-mix(in srgb, var(--color-accent-red) 96%, white) 100%)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-red) 92%, white) 0%, var(--color-accent-red) 100%)";
                  }}
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>

                <p className="text-[10px] text-center text-black/50">
                  Al continuar aceptas las políticas de uso del sistema.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-[11px] text-[var(--color-accent-gray)] mt-6">
          © {new Date().getFullYear()} UMSS · OHSANSI
        </footer>
      </main>
    </div>
  );
}
