export type Team = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;

  members?: TeamMember[];
  members_count?: number;
  projects_count?: number;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null; // Ajout du champ avatar
  pivot: {
    role: "owner" | "admin" | "member" | "viewer";
  };
};

export type TeamCreate = {
  slug: string;
  name: string;
  description?: string | null;
  owner_id?: number;
};

export type TeamUpdate = Partial<Omit<TeamCreate, "owner_id">>;

export type TeamListParams = {
  q?: string;
  order_by?: "created_at" | "name" | "slug";
  order_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
};
