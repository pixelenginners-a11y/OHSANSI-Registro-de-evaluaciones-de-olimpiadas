import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: "http://localhost:8200/api",
  headers: { Accept: "application/json" },
  timeout: 20000, // 20 segundos
});

// Función util para establecer el header Authorization en runtime
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Si hay token en localStorage al arrancar, lo aplicamos
const stored = localStorage.getItem("token");
if (stored) setAuthToken(stored);

export default api;
