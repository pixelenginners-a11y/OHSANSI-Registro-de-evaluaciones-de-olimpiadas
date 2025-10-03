import { useMutation, useQueryClient } from "@tanstack/react-query";
import responsablesEndpoints, { type Responsable } from "../../../api/endpointResponsable";

export const useCreateResponsable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Responsable) => {
      const res = await responsablesEndpoints.create(data);
      if (!res) throw new Error("Error al crear el responsable");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responsables"] });
    }
  });
};

export const useUpdateResponsable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Responsable }) => {
      const res = await responsablesEndpoints.update(id, data);
      if (!res) throw new Error("Error al actualizar el responsable");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responsables"] });
    }
  });
};

export const usePatchResponsable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Responsable> }) => {
      const res = await responsablesEndpoints.patch(id, data);
      if (!res) throw new Error("Error al actualizar el responsable");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responsables"] });
    }
  });
};

export const useDeleteResponsable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await responsablesEndpoints.delete(id);
      if (!res) throw new Error("Error al eliminar el responsable");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responsables"] });
    }
  });
};
