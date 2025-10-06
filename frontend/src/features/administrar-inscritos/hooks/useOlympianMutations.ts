import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";
import { createOlympian, updateOlympian, deleteOlympian } from "../../../api/olympians";
import type { OlympianCreate, OlympianUpdate } from "../types";

export const useCreateOlympian = () => {
  return useMutation({
    mutationFn: async (data: OlympianCreate) => {
      const res = await createOlympian(data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["olympians"] });
    },
  });
};

export const useUpdateOlympian = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: OlympianUpdate }) => {
      const res = await updateOlympian(id, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["olympians"] });
      queryClient.invalidateQueries({ queryKey: ["olympian", variables.id] });
    },
  });
};

export const useDeleteOlympian = () => {
  return useMutation<void, AxiosError, number>({
    mutationFn: async (id: number) => {
      await deleteOlympian(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["olympians"] });
    },
  });
};
