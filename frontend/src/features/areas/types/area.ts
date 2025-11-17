export type MedalParameter = {
  id: number;
  area_id: number;
  gold: number|null;
  silver: number|null;
  bronze: number|null;
  honor_mentions: number;
};

export type Area = {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  responsable_id: number | null;
  medal_parameter: MedalParameter | null;
  is_group: boolean;
  group_min_size: number;
  group_max_size: number;
}