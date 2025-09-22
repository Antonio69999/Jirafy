import { api } from "@/api/http";
import type { ApiResponse } from "@/types/common";

interface Label {
  id: number;
  name: string;
  color: string;
  project_id: number;
}

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const labelService = {
  async list(): Promise<Label[]> {
    const res = await api.get<ApiResponse<Label[]>>("/api/labels");
    return unwrap(res);
  },

  async getByProject(projectId: number): Promise<Label[]> {
    const res = await api.get<ApiResponse<Label[]>>(
      `/api/projects/${projectId}/labels`
    );
    return unwrap(res);
  },
};
