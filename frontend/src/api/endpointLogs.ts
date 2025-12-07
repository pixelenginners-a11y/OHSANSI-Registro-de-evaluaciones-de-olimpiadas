import api from './axios';

export type LogRecord = {
  id: number;
  actor_id: number | null;
  actor_role: string | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  area_id: number | null;
  grade_id: number | null;
  phase: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type LogsResponse = {
  data: LogRecord[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type LogFilters = Partial<{
  user_id: number;
  role: string;
  action: string;
  area_id: number;
  grade_id: number;
  phase: string;
  entity_type: string;
  date_from: string;
  date_to: string;
  page: number;
}>;

export const logsEndpoints = {
  get: (filters: LogFilters = {}) => api.get<LogsResponse>('/logs', { params: filters }),
};

export default logsEndpoints;
