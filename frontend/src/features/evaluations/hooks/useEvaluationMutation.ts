import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../../api/axios';

export type EditEvaluationForm = {
  score: number;
  status: 'pendiente' | 'clasificado' | 'no_clasificado' | 'desclasificado';
  description?: string;
};

export interface UpdateEvaluationResponse {
  message: string;
  data: any;
}

export interface ErrorResponse {
  message: string;
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
      const payload = {
        score: data.score,
        status: data.status,
        description: data.description,
      };

      const response = await api.patch<UpdateEvaluationResponse>(
        `/evaluations/${id}`,
        payload
      );

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
