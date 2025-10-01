// src/routes/login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import LoginPage from "../features/login/pages/loginPage";
import type { Rol } from "../features/login/pages/loginPage";

// Credenciales DEMO por rol
const USERS: Record<Rol, { email: string; pwd: string; home: string }> = {
  Administrador: {
    email: "admin@umss.edu.bo",
    pwd: "admin123",
    home: "/Admin/evaluador",
  },
  Responsable: {
    email: "resp@umss.edu.bo",
    pwd: "resp123",
    home: "/Admin/evaluador",
  },
  Evaluador: {
    email: "eval@umss.edu.bo",
    pwd: "eval123",
    home: "/Admin/evaluador",
  },
};

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  const navigate = useNavigate();

  const handleSubmit = async (
    email: string,
    pwd: string,
    rol: Rol,
    remember: boolean
  ) => {
    const user = USERS[rol];
    if (!user) {
      alert("Rol inválido.");
      return;
    }

    if (email.trim() === user.email && pwd === user.pwd) {
      // Usa remember para persistir la sesión si quieres
      if (remember) {
        localStorage.setItem(
          "session",
          JSON.stringify({ email, rol, home: user.home })
        );
      } else {
        localStorage.removeItem("session");
      }

      navigate({ to: user.home, replace: true });
    } else {
      alert("Credenciales incorrectas. Verifique su correo y contraseña.");
    }
  };

  return <LoginPage onSubmit={handleSubmit} />;
}
