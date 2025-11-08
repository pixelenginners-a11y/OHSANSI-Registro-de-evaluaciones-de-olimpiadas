import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'https://ohsansi-registro-de-evaluaciones-de.onrender.com/api',
  headers: { Accept: "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<{ exp?: number }>(token);
      const currentTime = Date.now() / 1000; // de milisegundos a segundos

      // Verificar expiración
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token');
        window.location.href = '/public/login';
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // muy importante retornar config
  },
  (error) => {
    return Promise.reject(error);
  }
);