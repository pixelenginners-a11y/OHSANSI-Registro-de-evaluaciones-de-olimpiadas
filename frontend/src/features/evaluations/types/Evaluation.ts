export type EditEvaluationForm = {
  score: number;
  status: 'pendiente' | 'clasificado' | 'no_clasificado' | 'desclasificado';
  description?: string;
};

export interface UpdateEvaluationResponse {
  message: string;
  data: {
    id: number;
    score: number;
    status: 'pendiente' | 'clasificado' | 'no_clasificado' | 'desclasificado';
    description?: string;
    evaluator_id?: number;
    group_id?: number;
    phase?: string;
  };
}
