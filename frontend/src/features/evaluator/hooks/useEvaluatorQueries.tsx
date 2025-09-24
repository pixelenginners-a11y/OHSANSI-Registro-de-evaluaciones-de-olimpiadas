import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import type { EvaluatorResponse } from "../types/evaluator";

export const useGetEvaluators = () => {

  return useQuery({
    queryKey: ["evaluators"],
    queryFn: async () => {
      const res = await api.get("/evaluators");
      if (!res) throw new Error("Error get evaluators");
      return res.data;
    }
  })
}

export const useGetEvaluatorById = (id: number) => {

  return useQuery<EvaluatorResponse>({
    queryKey: ["evaluator", id],
    queryFn: async () => {
      const res = await api.get(`/evaluators/${id}`);
      if (!res) throw new Error("Error get evaluator by id");
      return res.data;
    }
  })
}