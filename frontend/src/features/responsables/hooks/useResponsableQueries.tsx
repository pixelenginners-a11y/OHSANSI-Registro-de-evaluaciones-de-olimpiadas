import { useQuery } from "@tanstack/react-query";
import responsablesEndpoints, { type Responsable } from "../../../api/endpointResponsable";

export const useGetResponsables = () => {
  return useQuery<Responsable[]>({
    queryKey: ["responsables"],
    queryFn: async () => {
      const res = await responsablesEndpoints.getAll();
      if (!res) throw new Error("Error al obtener los responsables");
      return res.data;
    }
  });
};

export const useGetResponsableById = (id: number) => {
  return useQuery<Responsable>({
    queryKey: ["responsable", id],
    queryFn: async () => {
      const res = await responsablesEndpoints.getById(id);
      if (!res) throw new Error("Error al obtener el responsable");
      return res.data;
    },
    enabled: !!id
  });
};
