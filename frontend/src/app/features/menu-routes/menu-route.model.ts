export interface MenuRoutePermission {
  id: string;
  name: string;
  label: string;
  description: string | null;
}

export interface MenuRoute {
  id: string;
  title: string;
  slug: string | null;
  icon: string | null;
  category: string;
  sort_order: number;
  parent_id: string | null;
  is_active: boolean;
  permissions: MenuRoutePermission[];
  children: MenuRoute[];
  created_at?: string;
  updated_at?: string;
}

export interface MenuRouteFormValue {
  title: string;
  slug: string | null;
  icon: string | null;
  category: string;
  sort_order: number;
  parent_id: string | null;
  is_active: boolean;
}
