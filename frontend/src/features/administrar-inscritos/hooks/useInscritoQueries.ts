import { useQuery } from "@tanstack/react-query";
import { getInscritos, getInscritoById } from "../../../api/inscritos";
import type { Inscrito } from "../types";

export const useGetInscritos = () => {
  return useQuery<Inscrito[]>({
    queryKey: ["inscritos"],
    queryFn: async () => {
      const res = await getInscritos();
      return res.data;
    },
  });
};

export const useGetInscritoById = (id: number) => {
  return useQuery<Inscrito>({
    queryKey: ["inscrito", id],
    queryFn: async () => {
      const res = await getInscritoById(id);
      return res.data;
    },
    enabled: !!id,
  });
};
