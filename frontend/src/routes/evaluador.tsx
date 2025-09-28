import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/evaluador")({
  component: EvaluadorPage,
});

function EvaluadorPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 Limpia la sesión
    localStorage.removeItem("session");

    // 🚪 Redirige al login
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--color-primary-dark)] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel del Evaluador</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 font-semibold shadow text-white transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="flex-grow p-6">
        <p>Bienvenido/a Evaluador.</p>
      </main>
    </div>
  );
}
