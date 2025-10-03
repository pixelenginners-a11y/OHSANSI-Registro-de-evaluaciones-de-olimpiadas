import { useQuery } from "@tanstack/react-query";
import areasEndpoints, { type Area } from "../../../api/endpointAreas";

export const useGetAreas = () => {
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await areasEndpoints.getAll();
      if (!res) throw new Error("Error al obtener las áreas");
      return res.data;
    }
  });
};

export const useGetAreaById = (id: number) => {
  return useQuery<Area>({
    queryKey: ["area", id],
    queryFn: async () => {
      const res = await areasEndpoints.getById(id);
      if (!res) throw new Error("Error al obtener el área");
      return res.data;
    },
    enabled: !!id
  });
};
