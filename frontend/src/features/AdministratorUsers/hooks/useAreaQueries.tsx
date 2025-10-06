import { useQuery } from "@tanstack/react-query";
import apiInterceptor from "../../../api/axiosInterceptor";
import type { } from "../types";

export const useGetAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await apiInterceptor.get("/areas")
      return res.data;
    }
  })
}

export const useGetAreaById = (id: number) => {

  return useQuery({
    queryKey: ["Area", id],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/areas/${id}`);
      return res.data;
    }
  })
}