import { useQuery } from "@tanstack/react-query";

import api from "../../../api/axios";

export const useGetInscriptions = () => {

  return useQuery({
    queryKey: ["inscriptions"],
    queryFn: async () => {
      const res = await api.get("/inscriptions");
      return res.data;
    }
  })
}

export const useGetInscriptionsById = (id: number) => {

  return useQuery({
    queryKey: ["inscriptions", id],
    queryFn: async () => {
      const res = await api.get(`/inscriptions/${id}`);
      return res.data;
    }
  })
}