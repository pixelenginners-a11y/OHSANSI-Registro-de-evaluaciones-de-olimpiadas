// src/api/axios.ts
import axios from 'axios'

// Creamos la instancia de axios con la URL base desde .env
const api = axios.create({
  baseURL: import.meta.env.VITE_APIURL || 'http://localhost:8200/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
