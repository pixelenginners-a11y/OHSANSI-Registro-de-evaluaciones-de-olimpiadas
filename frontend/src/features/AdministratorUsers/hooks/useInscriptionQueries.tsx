import { useQuery } from "@tanstack/react-query";

import apiInterceptor from "../../../api/axiosInterceptor";

export const useGetInscriptions = () => {

  return useQuery({
    queryKey: ["inscriptions"],
    queryFn: async () => {
      const res = await apiInterceptor.get("/inscriptions");
      return res.data;
    }
  })
}

export const useGetInscriptionsById = (id: number) => {

  return useQuery({
    queryKey: ["inscriptions", id],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/inscriptions/${id}`);
      return res.data;
    }
  })
}