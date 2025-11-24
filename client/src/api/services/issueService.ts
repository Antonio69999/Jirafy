import { api } from "@/api/http";
import type { ApiResponse, Paginated } from "@/types/common";
import type {
  Issue,
  IssueCreate,
  IssueListParams,
  IssueUpdate,
} from "@/types/issue";

const base = "/api/issues";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const issueService = {
  async list(params: IssueListParams = {}): Promise<Paginated<Issue>> {
    const res = await api.get<ApiResponse<Paginated<Issue>>>(base, {
      params,
    });
    return unwrap(res);
  },

  async getProjectIssues(
    projectId: number,
    params: Omit<IssueListParams, "project_id"> = {}
  ): Promise<Paginated<Issue>> {
    const res = await api.get<ApiResponse<Paginated<Issue>>>(
      `/api/projects/${projectId}/issues`,
      {
        params,
      }
    );
    return unwrap(res);
  },

  /**
   * Récupérer les tickets du client connecté
   */
  async getMyTickets(
    params: {
      per_page?: number;
      page?: number;
    } = {}
  ): Promise<Paginated<Issue>> {
    const res = await api.get<ApiResponse<Paginated<Issue>>>(
      `${base}/my-tickets`,
      { params }
    );
    return unwrap(res);
  },

  async get(id: number): Promise<Issue> {
    const res = await api.get<ApiResponse<Issue>>(`${base}/${id}`);
    return unwrap(res);
  },

  async getByKey(key: string): Promise<Issue> {
    const res = await api.get<ApiResponse<Issue>>(`${base}/key/${key}`);
    return unwrap(res);
  },

  async create(payload: IssueCreate): Promise<Issue> {
    const res = await api.post<ApiResponse<Issue>>(base, payload);
    return unwrap(res);
  },

  async update(id: number, payload: IssueUpdate): Promise<Issue> {
    const res = await api.put<ApiResponse<Issue>>(`${base}/${id}`, payload);
    return unwrap(res);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${base}/${id}`);
  },
};

export type { Issue, IssueCreate, IssueUpdate, IssueListParams };
