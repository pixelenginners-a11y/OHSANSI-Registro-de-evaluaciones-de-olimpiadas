import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";

import api from "../../../api/axios";
import type { InscriptionCreate, InscriptionUpdate, InscriptionResponse } from "../types";
import { type ErrorInscription } from "../../../types/Error";

export const useUpdateInscription = () => {
  return useMutation<InscriptionResponse, AxiosError<ErrorInscription>, { id: number; data: InscriptionUpdate }, void>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/inscriptions/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['searchInscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['inscription', variables.id] });
    },
  });
};

export const useDeleteInscription = () => {
  return useMutation<void, AxiosError, number, void>({
    mutationFn: async (id) => {
      await api.delete(`/inscriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['searchInscriptions'] });
    },
  });
};

export const useCreateInscription = () => {
  return useMutation<InscriptionResponse, AxiosError<ErrorInscription>, InscriptionCreate, void>({
    mutationFn: async (data) => {
      const res = await api.post("/inscriptions", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['searchInscriptions'] });
    },
  });
};