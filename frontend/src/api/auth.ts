import api from "./axios";

export const login = (email: string, password: string) => {
  return api.post("/login", { email, password });
};
