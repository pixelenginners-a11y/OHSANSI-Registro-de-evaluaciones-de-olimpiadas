export type Area = {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  responsable_id: number | null;
  is_group: boolean;
  group_min_size: number | null;
  group_max_size: number | null;
}