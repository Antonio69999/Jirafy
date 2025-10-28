export type Project = {
  id: number;
  key: string;
  name: string;
  description?: string | null;
  team_id?: number | null;
  lead_user_id?: number | null;
  issue_seq: number;
  created_at: string;
  updated_at: string;

  team?: { id: number; slug: string; name: string } | null;
  lead?: { id: number; name: string; email: string } | null;
  issues_count?: number;
  members?: ProjectMember[];
};

export type ProjectMember = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role: 'admin' | 'manager' | 'contributor' | 'viewer';
  source: 'project' | 'team'; 
};

export type ProjectCreate = {
  key: string;
  name: string;
  description?: string | null;
  team_id?: number | null;
  lead_user_id?: number | null;
};

export type ProjectUpdate = Partial<ProjectCreate>;

export type ProjectListParams = {
  q?: string;
  team_id?: number;
  order_by?: "created_at" | "name" | "key";
  order_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
};