import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";
import { createInscrito, updateInscrito, deleteInscrito } from "../../../api/inscritos";
import type { Inscrito, InscritoCreate, InscritoUpdate } from "../types";

export const useCreateInscrito = () => {
  return useMutation<Inscrito, AxiosError, InscritoCreate>({
    mutationFn: async (data: InscritoCreate) => {
      const res = await createInscrito(data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscritos"] });
    },
  });
};

export const useUpdateInscrito = (id: number) => {
  return useMutation<Inscrito, AxiosError, InscritoUpdate>({
    mutationFn: async (data: InscritoUpdate) => {
      const res = await updateInscrito(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscritos"] });
      queryClient.invalidateQueries({ queryKey: ["inscrito", id] });
    },
  });
};

export const useDeleteInscrito = (id: number) => {
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await deleteInscrito(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscritos"] });
    },
  });
};
