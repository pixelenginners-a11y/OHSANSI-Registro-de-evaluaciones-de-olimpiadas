import { useMutation, useQueryClient } from "@tanstack/react-query";
import areasEndpoints, { type Area } from "../../../api/endpointAreas";

type UpdateAreaData = {
  name: string;
  description: string | null;
  active: boolean;
  responsable_id: number | null;
  is_group: boolean;
  group_min_size: number;
  group_max_size: number;
  medalParameter?: {
    gold: number | null;
    silver: number | null;
    bronze: number | null;
    honor_mentions: number;
  };
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Area) => {
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

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateAreaData }) => {
      // Transformar datos al formato esperado por el backend
      const payload: any = {
        area: {
          name: data.name,
          description: data.description,
          active: data.active,
          responsable_id: data.responsable_id,
          is_group: data.is_group,
          group_min_size: data.group_min_size,
          group_max_size: data.group_max_size
        }
      };

      // Agregar medalParameter si existe, filtrando valores null
      if (data.medalParameter) {
        const medalParameter: any = {};

        if (data.medalParameter.gold !== null && data.medalParameter.gold !== undefined) {
          medalParameter.gold = data.medalParameter.gold;
        }
        if (data.medalParameter.silver !== null && data.medalParameter.silver !== undefined) {
          medalParameter.silver = data.medalParameter.silver;
        }
        if (data.medalParameter.bronze !== null && data.medalParameter.bronze !== undefined) {
          medalParameter.bronze = data.medalParameter.bronze;
        }
        if (data.medalParameter.honor_mentions !== null && data.medalParameter.honor_mentions !== undefined) {
          medalParameter.honor_mentions = data.medalParameter.honor_mentions;
        }

        // Solo agregar medalParameter si hay al menos un campo
        if (Object.keys(medalParameter).length > 0) {
          payload.medalParameter = medalParameter;
        }
      }

      const res = await areasEndpoints.update(id, payload as any);
      if (!res) throw new Error("Error al actualizar el área");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area", variables.id] });
    }
  });
};

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
