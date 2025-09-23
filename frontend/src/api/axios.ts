import axios from 'axios';

const api = axios.create({
  baseURL: process.env.APIURL || 'http://localhost:8200/',
});

export default api;