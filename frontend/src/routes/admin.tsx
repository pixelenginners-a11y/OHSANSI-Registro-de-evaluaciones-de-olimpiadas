import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 Limpia cualquier sesión almacenada
    localStorage.removeItem("session");

    // 🚪 Redirige al login (o a la página principal "/")
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--color-primary-dark)] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel del Administrador</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 font-semibold shadow text-white transition"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="flex-grow p-6">
        <p>Bienvenido/a.</p>
      </main>
    </div>
  );
}
