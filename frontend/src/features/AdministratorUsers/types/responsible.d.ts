import { PaginatedResponse } from "../../../types/Pagination";

export interface Responsable {
  id: number;
  full_name: string;
  username: string;
  email: string;
  area: string | null;
  area_id?: number | string | null;
  active: boolean;
  phone?: string;
}

export interface ResponsableEdit extends Omit<Responsable, 'id'> { }

export interface ResponsableParcialEdit extends Partial<Omit<Responsable, 'id'>> { }

export interface ResponsableCreate extends Omit<Responsable, 'id' | 'area' | 'active'> {
  password: string;
}

export interface Column {
  key: keyof Responsable;
  label: string;
}

export interface PaginatedResponsablesResponse extends PaginatedResponse<Responsable> { }
