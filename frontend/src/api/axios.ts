import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8200/api',
  headers: { Accept: "application/json" },
});

export default api;