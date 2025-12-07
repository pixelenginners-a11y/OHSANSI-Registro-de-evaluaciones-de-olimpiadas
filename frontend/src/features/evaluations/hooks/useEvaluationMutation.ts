import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../../api/axios';

export type EditEvaluationForm = {
  score?: number;
  status?: "pending" | "in_review" | "approved" | "rejected" | "disqualified" | null;
  description?: string;
  disqualified?: boolean;
};

export interface UpdateEvaluationResponse {
  message: string;
  data: any;
}

export interface ErrorResponse {
  message: string;
}

export interface ApproveAllResponse {
  message: string;
  data: { updated_count: number };
}

interface MutationVariables {
  id: number;
  data: EditEvaluationForm;
}

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateEvaluationResponse,
    AxiosError<ErrorResponse>,
    MutationVariables
  >({
    mutationFn: async ({ id, data }) => {
      const payload: any = {};
      if (data.score !== undefined) payload.score = data.score;
      if (data.description !== undefined) payload.description = data.description;
      if (data.disqualified !== undefined) payload.disqualified = data.disqualified;
      if (data.status !== undefined) payload.status = data.status;
      console.log('Payload enviado:', JSON.stringify(payload, null, 2));

      const response = await api.patch<UpdateEvaluationResponse>(
        `/evaluations/${id}`,
        payload
      );

      console.log('Respuesta de la actualización:', response.data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['getEvaluations'] });
      console.log(`Evaluación ${variables.id} actualizada`);
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Error actualizando evaluación:', errorMessage);
    },
  });
};

export const useApproveAllEvaluations = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveAllResponse, AxiosError<ErrorResponse>>({
    mutationFn: async () => {
      const response = await api.patch<ApproveAllResponse>('/evaluations/approve-all');
      return response.data;
    },
    onSuccess: (data) => {
      console.log(`Se aprobaron ${data.data.updated_count} evaluaciones.`);
      queryClient.invalidateQueries({ queryKey: ['getEvaluations'] });
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Error aprobando evaluaciones:', errorMessage);
    },
  });
};

