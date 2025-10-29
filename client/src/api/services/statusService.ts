import { api } from "@/api/http";
import type { ApiResponse, Paginated } from "@/types/common";

export interface Status {
  id: number;
  key: string;
  name: string;
  category: "todo" | "in_progress" | "done";
  created_at?: string;
  updated_at?: string;
}

export interface StatusCreate {
  key: string;
  name: string;
  category: "todo" | "in_progress" | "done";
}

export interface StatusUpdate {
  key?: string;
  name?: string;
  category?: "todo" | "in_progress" | "done";
}

export interface StatusListParams {
  category?: string;
  search?: string;
  order_by?: string;
  order_dir?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

const base = "/api/statuses";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const statusService = {
  async list(params: StatusListParams = {}): Promise<Paginated<Status>> {
    const res = await api.get<ApiResponse<Paginated<Status>>>(base, {
      params,
    });
    return unwrap(res);
  },

  async get(id: number): Promise<Status> {
    const res = await api.get<ApiResponse<Status>>(`${base}/${id}`);
    return unwrap(res);
  },

  async getByKey(key: string): Promise<Status> {
    const res = await api.get<ApiResponse<Status>>(`${base}/key/${key}`);
    return unwrap(res);
  },

  async getAvailable(): Promise<Status[]> {
    const res = await api.get<ApiResponse<Status[]>>(`${base}/available`);
    return unwrap(res);
  },

  async create(payload: StatusCreate): Promise<Status> {
    const res = await api.post<ApiResponse<Status>>(base, payload);
    return unwrap(res);
  },

  async update(id: number, payload: StatusUpdate): Promise<Status> {
    const res = await api.put<ApiResponse<Status>>(`${base}/${id}`, payload);
    return unwrap(res);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${base}/${id}`);
  },
};