export type Responsable = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string | null;
  password?: string; // Solo para crear/actualizar
  active: boolean;
}
