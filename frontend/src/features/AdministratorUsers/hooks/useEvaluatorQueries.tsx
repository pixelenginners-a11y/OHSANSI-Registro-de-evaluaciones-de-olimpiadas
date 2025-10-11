import { useQuery } from "@tanstack/react-query";
import apiInterceptor from "../../../api/axiosInterceptor";

export const useGetEvaluators = (page: number = 1) => {
  return useQuery({
    queryKey: ["getEvaluators", page],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/evaluators?page=${page}`);
      return res.data;
    },
  });
};

export const useGetEvaluatorById = (id: number) => {
  return useQuery({
    queryKey: ["evaluator", id],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/evaluators/${id}`);
      return res.data;
    },
  });
};

export const useSearchEvaluators = (query: string, areaId: string) => {
  return useQuery({
    queryKey: ["searchEvaluators", query, areaId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (areaId) params.areaId = areaId;
      const res = await apiInterceptor.get("/evaluators/search", { params });
      return res.data;
    },
    enabled: !!query || !!areaId,
  });
};
