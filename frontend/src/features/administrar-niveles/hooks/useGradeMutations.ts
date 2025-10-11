import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";
import { createGrade, updateGrade, deleteGrade } from "../../../api/grades";
import type { Nivel, NivelCreate, NivelUpdate } from "../types";

export const useCreateGrade = () => {
  return useMutation<Nivel, AxiosError, NivelCreate>({
    mutationFn: async (data: NivelCreate) => {
      const res = await createGrade(data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
};

export const useUpdateGrade = (id: number) => {
  return useMutation<Nivel, AxiosError, NivelUpdate>({
    mutationFn: async (data: NivelUpdate) => {
      const res = await updateGrade(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["grade", id] });
    },
  });
};

export const useDeleteGrade = (id: number) => {
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await deleteGrade(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
};
