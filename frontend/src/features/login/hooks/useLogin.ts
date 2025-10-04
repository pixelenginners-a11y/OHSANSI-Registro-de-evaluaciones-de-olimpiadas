// src/features/login/hooks/useLogin.ts
import { useState } from "react";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setError(null);
    setLoading(true);

    try {
      // TODO: Reemplazar con llamada real al backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock response
      const mockResponse: LoginResponse = {
        token: "mock-jwt-token-123",
        user: {
          id: "1",
          email: credentials.email,
          role: "Administrador",
        },
      };

      // TODO: Guardar token en localStorage o contexto
      // localStorage.setItem("token", mockResponse.token);

      return mockResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo iniciar sesión";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}
