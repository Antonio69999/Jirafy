export type Issue = {
  id: number;
  project_id: number;
  type_id: number;
  status_id: number;
  priority_id: number;
  reporter_id: number;
  assignee_id?: number | null;
  number: number;
  issue_key: string;
  title: string;
  description?: string | null;
  story_points?: number | null;
  due_date?: string | null;
  created_at: string;
  updated_at: string;

  // Relations chargées
  project?: { id: number; key: string; name: string };
  type?: { id: number; key: string; name: string };
  status?: { id: number; key: string; name: string; category: string };
  priority?: { id: number; key: string; name: string; weight: number };
  reporter?: { id: number; name: string; email: string };
  assignee?: { id: number; name: string; email: string };
  labels?: { id: number; name: string; color: string }[];
};

export type IssueCreate = {
  project_id: number;
  type_id: number;
  status_id: number;
  priority_id: number;
  reporter_id: number;
  assignee_id?: number | null;
  title: string;
  description?: string | null;
  story_points?: number | null;
  due_date?: string | null;
};

export type IssueUpdate = Partial<Omit<IssueCreate, 'project_id' | 'reporter_id'>>;

export type IssueListParams = {
  project_id?: number;
  status_id?: number;
  type_id?: number;
  priority_id?: number;
  assignee_id?: number;
  q?: string;
  order_by?: "created_at" | "title" | "priority_id" | "due_date";
  order_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
};