export interface EvaluatorBase {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  area?: string;
  area_id?: number | string | null;
  role_id?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface EvaluatorCreate {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  area_id: number;
}

export type EvaluatorUpdate = Partial<Omit<EvaluatorCreate, 'password'>> & {
  password?: string;
};

export interface EvaluatorListResponse {
  evaluators: EvaluatorBase[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EvaluatorResponse {
  message: string;
  data: EvaluatorBase;
}