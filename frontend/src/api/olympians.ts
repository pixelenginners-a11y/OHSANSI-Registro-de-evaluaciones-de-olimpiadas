import api from "./axios";

export const getOlympians = () => {
  const token = localStorage.getItem("token");
  return api.get("/inscriptions/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOlympianById = (id: number) => {
  const token = localStorage.getItem("token");
  return api.get(`/olympians/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOlympian = (data: any) => {
  const token = localStorage.getItem("token");
  return api.post("/olympians", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOlympian = (id: number, data: any) => {
  const token = localStorage.getItem("token");
  return api.put(`/olympians/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteOlympian = (id: number) => {
  const token = localStorage.getItem("token");
  return api.delete(`/olympians/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
