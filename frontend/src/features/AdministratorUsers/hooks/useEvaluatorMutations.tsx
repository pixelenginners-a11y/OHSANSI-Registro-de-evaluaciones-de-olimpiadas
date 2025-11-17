import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";

import api from "../../../api/axios";
import type { EvaluatorCreate, EvaluatorUpdate, EvaluatorResponse } from "../types";
import { type ErrorEvaluator } from "../../../types/Error";

export const useUpdateEvaluator = () => {
  return useMutation<EvaluatorResponse, AxiosError<ErrorEvaluator>, { id: number; data: EvaluatorUpdate }, void>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/evaluators/${id}`, data);
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
      await api.delete(`/evaluators/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluators'] });
      queryClient.invalidateQueries({ queryKey: ['searchEvaluators'] });
    },
  });
};

export const useCreateEvaluator = () => {
  return useMutation<EvaluatorResponse, AxiosError<ErrorEvaluator>, EvaluatorCreate, void>({
    mutationFn: async (data) => {
      const res = await api.post("/evaluators", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluators'] });
      queryClient.invalidateQueries({ queryKey: ['searchEvaluators'] });
    },
  });
};