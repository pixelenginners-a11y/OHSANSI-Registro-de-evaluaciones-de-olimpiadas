export type Listing = {
  id: number;
  name: string;
  area_id: number;
  grade_id: number;
  type: string;
  description: string;
  is_published: boolean;
  published_at: string | null;
  visibility: string;
  created_at: string;
  updated_at: string;
  area: {
    id: number;
    name: string;
    description: string;
    active: boolean;
    is_group: boolean;
    group_min_size: number | null;
    group_max_size: number | null;
  };
  grade: {
    id: number;
    name: string;
    description: string;
    active: boolean;
  };
};

export type ListingsResponse = {
  current_page: number;
  data: Listing[];
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

export type CreateListingData = {
  name: string;
  area_id: number;
  grade_id: number;
  type: '' | 'concursantes' | 'clasificados' | 'no_clasificados' | 'desclasificados' | 'premiados' | 'certificados' | 'ceremonia' | 'publicacion';
  description?: string;
  is_published?: boolean;
  visibility?: 'publico' | 'privado' | 'restringido';
};

export type UpdateListingData = {
  name: string;
  description: string;
  type: string;
  is_published: boolean;
  visibility: string;
};