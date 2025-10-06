import { useQuery } from "@tanstack/react-query";
import apiInterceptor from "../../../api/axiosInterceptor";
import type { EvaluatorResponse } from "../types";

export const useGetEvaluators = () => {

  return useQuery({
    queryKey: ["evaluators"],
    queryFn: async () => {
      const res = await apiInterceptor.get("/evaluators");
      return res.data;
    }
  })
}

export const useGetEvaluatorById = (id: number) => {

  return useQuery<EvaluatorResponse>({
    queryKey: ["evaluator", id],
    queryFn: async () => {
      const res = await apiInterceptor.get(`/evaluators/${id}`);
      return res.data;
    }
  })
}