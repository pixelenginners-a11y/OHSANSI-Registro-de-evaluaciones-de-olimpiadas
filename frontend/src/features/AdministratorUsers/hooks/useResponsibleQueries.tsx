import { useQuery } from "@tanstack/react-query";

import apiInterceptor from "../../../api/axiosInterceptor";

export const useGetAcademics = (page: number = 1) => {

  return useQuery({
    queryKey: ["getAcademics", page],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/academics?page=${page}`);
      return res.data;
    }
  })
}

export const useGetAcademicsById = (id: number) => {

  return useQuery({
    queryKey: ["academics", id],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/academics/${id}`);
      return res.data;
    }
  })
}

export const useSearchAcademics = (query: string, areaId: string) => {

  return useQuery({
    queryKey: ["searchAcademics", query, areaId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (areaId) params.areaId = areaId
      const res = await apiInterceptor.get("academics/search", {
        params,
      });
      return res.data;
    },
    enabled: !!query || !!areaId,
  })
}