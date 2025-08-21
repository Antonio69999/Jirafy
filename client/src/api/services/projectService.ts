import { api } from "@/api/http";
import type { ApiResponse, Paginated } from "@/types/common";
import type {
  Project,
  ProjectCreate,
  ProjectListParams,
  ProjectUpdate,
} from "@/types/project";

const base = "/api/projects";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const projectService = {
  async list(params: ProjectListParams = {}): Promise<Paginated<Project>> {
    const res = await api.get<ApiResponse<Paginated<Project>>>(base, {
      params,
    });
    return unwrap(res);
  },

  async get(id: number): Promise<Project> {
    const res = await api.get<ApiResponse<Project>>(`${base}/${id}`);
    return unwrap(res);
  },

  async create(payload: ProjectCreate): Promise<Project> {
    const body = { ...payload, key: payload.key.trim().toUpperCase() };
    const res = await api.post<ApiResponse<Project>>(base, body);
    return unwrap(res);
  },

  async update(id: number, payload: ProjectUpdate): Promise<Project> {
    const body = payload.key
      ? { ...payload, key: payload.key.trim().toUpperCase() }
      : payload;
    const res = await api.put<ApiResponse<Project>>(`${base}/${id}`, body);
    return unwrap(res);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${base}/${id}`);
  },
};
