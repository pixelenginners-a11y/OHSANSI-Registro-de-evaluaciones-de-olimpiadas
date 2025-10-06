import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8200/api',
  headers: { Accept: "application/json" },
  withCredentials: false,
});

export default api;