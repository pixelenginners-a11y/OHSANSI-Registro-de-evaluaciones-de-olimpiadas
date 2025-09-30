import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";

import api from "../../../api/axios";
import type { EvaluatorCreate, EvaluatorUpdate, EvaluatorResponse } from "../types/evaluator";

export const useUpdateEvaluator = (id: number) => {
  return useMutation<EvaluatorResponse, AxiosError, EvaluatorUpdate>({
    mutationFn: async (data: EvaluatorUpdate) => {
      const res = await api.put(`/evaluators/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluators'] });
      queryClient.invalidateQueries({ queryKey: ['evaluator', id] });
    }
  })
}

export const useDeleteEvaluator = (id: number) => {
  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await api.delete(`/evaluators/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluators'] });
    }
  })
}

export const useCreateEvaluator = () => {
  return useMutation<EvaluatorResponse, AxiosError, EvaluatorCreate>({
    mutationFn: async (data: EvaluatorCreate) => {
      const res = await api.post("/evaluators", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluators'] });
    }
  })
}