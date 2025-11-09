// src/features/login/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../../api/auth";
import type { LoginCredentials, LoginResponse, User } from "../types";
import type { AxiosError, AxiosResponse } from "axios";

export function useLogin() {
  const mutation = useMutation<AxiosResponse<LoginResponse>, AxiosError, LoginCredentials>({
    mutationFn: ({ email, password }: LoginCredentials) =>
      loginApi(email, password),

    onSuccess: (response) => {
      const accessToken = response.data.access_token;
      const user = response.data.user;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
  });

  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  const loginData = mutation.data?.data ?? null;

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    loginData,
    user: currentUser,
  };
}
