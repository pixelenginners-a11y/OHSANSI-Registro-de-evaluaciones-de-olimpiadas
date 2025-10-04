import api from "./axios";

export const getOlympians = () => {
  return api.get("/olympians");
};

export const importOlympians = (data: any) => {
  return api.post("/olympians/import", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

