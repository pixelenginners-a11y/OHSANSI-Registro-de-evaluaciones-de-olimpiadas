import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import type { Inscription, InscriptionsResponse } from "../types/inscriptions";

export const useGetInscriptions = (page: number = 1) => {
  return useQuery<InscriptionsResponse>({
    queryKey: ["inscriptions", page],
    queryFn: async () => {
      const res = await api.get(`/inscriptions?page=${page}`);
      return res.data;
    },
  });
};

export const useGetInscriptionById = (id: number) => {
  return useQuery<Inscription>({
    queryKey: ["inscription", id],
    queryFn: async () => {
      const res = await api.get(`/inscriptions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useSearchInscriptions = (query: string, areaId: string, gradeId: string) => {
  return useQuery({
    queryKey: ["searchInscriptions", query, areaId, gradeId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (areaId) params.areaId = areaId;
      if (gradeId) params.gradeId = gradeId;

      const res = await api.get("/inscriptions/search", { params });
      return res.data;
    },
    enabled: !!query || !!areaId || !!gradeId,
  });
};