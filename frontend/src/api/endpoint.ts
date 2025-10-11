import api from "./axios";

export const getOlympians = () => {
  const token = localStorage.getItem("token");
  return api.get("/olympians", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const importOlympians = (data: any) => {
  const token = localStorage.getItem("token");
  return api.post("/olympians/import", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

