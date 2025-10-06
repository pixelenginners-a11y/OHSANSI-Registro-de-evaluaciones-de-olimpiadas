import api from "./axios";
import type { NivelCreate, NivelUpdate } from "../features/administrar-niveles/types";

export const getGrades = () => {
  const token = localStorage.getItem("token");
  return api.get("/grades", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getGradeById = (id: number) => {
  const token = localStorage.getItem("token");
  return api.get(`/grades/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createGrade = (data: NivelCreate) => {
  const token = localStorage.getItem("token");
  return api.post("/grades", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateGrade = (id: number, data: NivelUpdate) => {
  const token = localStorage.getItem("token");
  return api.put(`/grades/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteGrade = (id: number) => {
  const token = localStorage.getItem("token");
  return api.delete(`/grades/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
