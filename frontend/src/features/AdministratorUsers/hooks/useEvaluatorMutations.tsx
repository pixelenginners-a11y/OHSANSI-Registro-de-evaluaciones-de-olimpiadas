import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";

import apiInterceptor from "../../../api/axiosInterceptor";
import type { EvaluatorCreate, EvaluatorUpdate, EvaluatorResponse } from "../types";

export const useUpdateEvaluator = () => {
  return useMutation<EvaluatorResponse, AxiosError, { id: number; data: EvaluatorUpdate }, void>({
    mutationFn: async ({ id, data }) => {
      const res = await apiInterceptor.put(`/evaluators/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluators'] });
      queryClient.invalidateQueries({ queryKey: ['searchEvaluators'] });
      queryClient.invalidateQueries({ queryKey: ['evaluator', variables.id] });
    },
  });
};

export const useDeleteEvaluator = () => {
  return useMutation<void, AxiosError, number, void>({
    mutationFn: async (id) => {
      await apiInterceptor.delete(`/evaluators/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluators'] });
      queryClient.invalidateQueries({ queryKey: ['searchEvaluators'] });
    },
  });
};

export const useCreateEvaluator = () => {
  return useMutation<EvaluatorResponse, AxiosError, EvaluatorCreate, void>({
    mutationFn: async (data) => {
      const res = await apiInterceptor.post("/evaluators", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluators'] });
      queryClient.invalidateQueries({ queryKey: ['searchEvaluators'] });
    },
  });
};