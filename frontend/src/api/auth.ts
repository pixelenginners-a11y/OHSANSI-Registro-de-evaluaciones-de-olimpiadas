import api from "./axios";
import type { LoginResponse, User } from "../features/login/types";

export const login = (email: string, password: string) => {
  return api.post<LoginResponse>("/login", { email, password });
};

export const getMe = () => {
  return api.get<User>("/me");
};

export const refreshToken = () => {
  return api.post<LoginResponse>("/refresh");
}

export const logout = () => {
  return api.post("/logout");
}
