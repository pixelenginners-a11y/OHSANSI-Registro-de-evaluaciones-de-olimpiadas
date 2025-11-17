import { useMutation } from "@tanstack/react-query";
import { type ResponsableParcialEdit } from "../types";
import api from "../../../api/axios";
import { queryClient } from "../../../lib/QueryClient";
import type { AxiosError } from "axios";
import type { ErrorResponsable } from "../../../types/Error";

export const useUpdateAcademic = () => {
  return useMutation<any, AxiosError<ErrorResponsable>, { id: number; data: ResponsableParcialEdit }, void>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/academics/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['getAcademics'] });
      queryClient.invalidateQueries({ queryKey: ['academics', variables.id] });
    },
  });
};

export const useDeleteAcademic = () => {
  return useMutation<void, Error, number, void>({
    mutationFn: async (id) => {
      await api.delete(`/academics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAcademics'] });
      queryClient.invalidateQueries({ queryKey: ['academics'], exact: false });
    },
  });
};

export const useCreateAcademic = () => {
  return useMutation<any, AxiosError<ErrorResponsable>, ResponsableParcialEdit, void>({
    mutationFn: async (data) => {
      const res = await api.post("/academics", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academics'] });
      queryClient.invalidateQueries({ queryKey: ['getAcademics'] });
    },
  });
};
