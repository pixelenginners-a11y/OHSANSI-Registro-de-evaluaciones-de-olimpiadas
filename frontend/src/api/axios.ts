import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ohsansi-registro-de-evaluaciones-de.onrender.com/api',
  headers: { Accept: "application/json" },
});

export default api;