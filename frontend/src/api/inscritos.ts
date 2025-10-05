import api from "./axios";
import type { InscritoCreate, InscritoUpdate } from "../features/administrar-inscritos/types";

export const getInscritos = () => {
  const token = localStorage.getItem("token");
  return api.get("/inscriptions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getInscritoById = (id: number) => {
  const token = localStorage.getItem("token");
  return api.get(`/inscriptions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createInscrito = (data: InscritoCreate) => {
  const token = localStorage.getItem("token");
  return api.post("/inscriptions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateInscrito = (id: number, data: InscritoUpdate) => {
  const token = localStorage.getItem("token");
  return api.put(`/inscriptions/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteInscrito = (id: number) => {
  const token = localStorage.getItem("token");
  return api.delete(`/inscriptions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
