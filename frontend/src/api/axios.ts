import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8200/api',
  headers: { Accept: "application/json" },
  timeout: 20000, // 10 segundos
});

export default api;