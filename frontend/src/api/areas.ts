import { useQuery } from "@tanstack/react-query";
import api from "./axios";

export type Area = {
  id: number
  name: string
}

export const useGetAreas = () => {
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/areas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });
};
