import api from "./axios";
import type { LoginResponse, User } from "../features/login/types";

export const login = (email: string, password: string) => {
  return api.post<LoginResponse>("/login", { email, password });
};

export const getMe = () => {
  const token = localStorage.getItem("token");
  return api.get<User>("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
