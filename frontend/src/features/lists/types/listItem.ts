export type Olympian = {
  id: number;
  full_name: string;
  identity_document: string;
  legal_guardian_contact: string;
  educational_institution: string;
  department: string;
  academic_tutor: string;
  created_at: string;
  updated_at: string;
};

export type GroupMember = {
  id: number;
  group_id: number;
  olympian_id: number;
  created_at: string;
  updated_at: string;
  olympian: Olympian;
};

export type Group = {
  id: number;
  name: string;
  area_id: number;
  grade_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  members: GroupMember[];
};

export type Inscription = {
  id: number;
  olympian: Olympian;
};

export type ListItem = {
  id: number;
  listing_id: number;
  inscription_id: number | null;
  group_id: number | null;
  created_at: string;
  updated_at: string;
  inscription: Inscription | null;
  group: Group | null;
};

export type ListItemsResponse = {
  current_page: number;
  data: ListItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};