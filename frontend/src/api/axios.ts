import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ohsansi-registro-de-evaluaciones-de.onrender.com/api',
  headers: { Accept: "application/json" },
  timeout: 20000, // 10 segundos
});

export default api;