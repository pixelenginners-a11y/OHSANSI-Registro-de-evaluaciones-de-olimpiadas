import { useMutation } from "@tanstack/react-query";
import { type ResponsableParcialEdit } from "../types";
import apiInterceptor from "../../../api/axiosInterceptor";
import { queryClient } from "../../../lib/QueryClient";

export const useUpdateAcademic = () => {
  return useMutation<any, Error, { id: number; data: ResponsableParcialEdit }, void>({
    mutationFn: async ({ id, data }) => {
      const res = await apiInterceptor.put(`/academics/${id}`, data);
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
      await apiInterceptor.delete(`/academics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAcademics'] });
      queryClient.invalidateQueries({ queryKey: ['academics'], exact: false });
    },
  });
};

export const useCreateAcademic = () => {
  return useMutation<any, Error, ResponsableParcialEdit, void>({
    mutationFn: async (data) => {
      const res = await apiInterceptor.post("/academics", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academics'] });
      queryClient.invalidateQueries({ queryKey: ['getAcademics'] });
    },
  });
};
