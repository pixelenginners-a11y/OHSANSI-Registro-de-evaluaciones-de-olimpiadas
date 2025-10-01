import { useMutation } from "@tanstack/react-query";
import api from "../../../api/axios";
import type { EvaluatorUpdate } from "../types/evaluator";

export const useUpdateEvaluator = (id: number) => {
  return useMutation<EvaluatorUpdate>({
    mutationFn: async () => {
      const res = await api.get(`/evaluators/${id}`);
      if (!res) throw new Error("Error get evaluator by id");
      return res.data;
    }
  })
}