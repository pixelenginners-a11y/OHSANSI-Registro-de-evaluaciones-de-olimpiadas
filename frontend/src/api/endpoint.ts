import api from "./axios";

export const getOlympians = () => {
  const token = localStorage.getItem("token");
  return api.get("/inscriptions/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const importOlympians = (data: any) => {
  const token = localStorage.getItem("token");
  return api.post("/inscriptions/import", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

