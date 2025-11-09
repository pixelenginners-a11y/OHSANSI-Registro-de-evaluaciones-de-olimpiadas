import { useMutation } from "@tanstack/react-query";

import api from "../../../api/axios";
import { queryClient } from "../../../lib/QueryClient";

export const useUpdateInscription = (id: number) => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.put(`/inscriptions/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['inscriptions', id] });
    }
  })
}

export const useDeleteInscription = (id: number) => {
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/inscriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    }
  })
}

export const useCreateInscription = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/inscriptions", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
    }
  })
}