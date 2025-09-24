export interface Evaluator {
  id: number;
  full_name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  area: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EvaluatorCreate = Omit<Evaluator, 'id' | 'created_at' | 'updated_at' | 'active'>;

export type EvaluatorUpdate = Partial<Omit<Evaluator, 'id' | 'created_at' | 'updated_at'>>;

export type EvaluatorListResponse = {
  evaluators: Evaluator[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EvaluatorFormData {
  full_name: string;
  username: string;
  email: string;
  password: string;
  area_id: string;
  phone: string;
}

export type EvaluatorResponse = Omit<Evaluator, 'password'>;

export interface EvaluatorsResponse {
  evaluators: EvaluatorResponse[];
  total: number;
  page: number;
  pageSize: number;
}