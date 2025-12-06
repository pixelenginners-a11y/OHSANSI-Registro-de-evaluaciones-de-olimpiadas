import api from "./axios";

export const getAwarded = (olimpiadaId: number, areaId?: number) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ olimpiada_id: olimpiadaId.toString() });

  if (areaId) {
    return api.get(`/ranked/awarded/${areaId}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return api.get(`/ranked/awarded?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRanking = (olimpiadaId: number, areaId?: number, gradeId?: number) => {
  const token = localStorage.getItem("token");
  const params: any = { olimpiada_id: olimpiadaId };

  if (areaId) params.area_id = areaId;
  if (gradeId) params.grade_id = gradeId;

  const queryString = new URLSearchParams(params).toString();

  return api.get(`/ranked/ranking?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const generateRanking = (areaId?: number) => {
  const token = localStorage.getItem("token");
  return api.post("/ranked/generate", { area_id: areaId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
