import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/QueryClient";
import { AxiosError } from "axios";
import api from "../../../api/axios";

export type TogglePhaseInput = { phase: string; action: 'activate' | 'deactivate' };
export type TogglePhaseResponse = { success: boolean; message?: string };

export const useTogglePhase = () => {
  return useMutation<TogglePhaseResponse, AxiosError, TogglePhaseInput>({
    mutationFn: async ({ phase, action }) => {
      const res = await api.post(`/admin/competition/phases/${phase}/${action}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCompetitionPhases"] });
      queryClient.invalidateQueries({ queryKey: ["getEvaluations"] });
    },
    onError: (err) => {
      console.error("useTogglePhase error:", err);
    },
  });
};
