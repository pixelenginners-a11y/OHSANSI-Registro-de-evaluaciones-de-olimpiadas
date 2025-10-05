// src/features/login/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../../api/auth";
import type { LoginCredentials } from "../types";

export function useLogin() {
  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      loginApi(email, password),
    onSuccess: (response) => {
      // Guardar token en localStorage
      localStorage.setItem("token", response.data.access_token);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data?.data,
  };
}
