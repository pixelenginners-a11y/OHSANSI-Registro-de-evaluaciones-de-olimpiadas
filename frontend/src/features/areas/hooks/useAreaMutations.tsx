import { useMutation, useQueryClient } from "@tanstack/react-query";
import areasEndpoints, { type Area } from "../../../api/endpointAreas";
import type { AxiosError } from "axios";
import type { ErrorArea } from "../../../types/Error";
import type { CreateAreaInput } from "../schemas/createAreaSchema";
import type { UpdateAreaInput } from "../schemas/updateAreaSchema";

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError<ErrorArea>, CreateAreaInput, void>({
    mutationFn: async (data: CreateAreaInput) => {
      const res = await areasEndpoints.create(data as any);
      if (!res) throw new Error("Error al crear el área");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    }
  });
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError<ErrorArea>, { id: number; data: UpdateAreaInput }, void>({
    mutationFn: async ({ id, data }) => {
      const dataToSend = {
        name: data.name,
        description: data.description,
        is_group: data.is_group,
        grades: data.grades,
        medalParameter: {
          gold: data.gold,
          silver: data.silver,
          bronze: data.bronze,
          honor_mentions: data.honor_mentions,
        },
      };
      const res = await areasEndpoints.update(id, dataToSend);
      console.log(res);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area", variables.id] });
    }
  });
}

export const usePatchArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Area> }) => {
      const res = await areasEndpoints.patch(id, data);
      if (!res) throw new Error("Error al actualizar parcialmente el área");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area", variables.id] });
    }
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await areasEndpoints.delete(id);
      if (!res) throw new Error("Error al eliminar el área");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    }
  });
};
