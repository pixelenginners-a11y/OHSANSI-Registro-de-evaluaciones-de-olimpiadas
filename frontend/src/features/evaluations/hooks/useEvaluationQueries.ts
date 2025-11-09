import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

interface EvaluationFilters {
  phase?: string;
  status?: string;
  grade?: string;
  area?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const useGetEvaluations = (filters: EvaluationFilters = {}) => {
  return useQuery({
    queryKey: ["getEvaluations", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};

      if (filters.phase) params.phase = filters.phase;
      if (filters.status) params.status = filters.status;
      if (filters.grade) params.grade = filters.grade;
      if (filters.area) params.area = filters.area;
      if (filters.search) params.search = filters.search;
      params.page = filters.page || 1;
      params.per_page = filters.per_page || 9;

      console.log("Fetching evaluations with params:", params);

      const res = await api.get("/evaluations", { params });
      return res.data.data;
    },
  });
};
