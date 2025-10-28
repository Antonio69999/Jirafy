import { api } from "@/api/http";
import type { ApiResponse } from "@/types/common";
import type { ProjectMember } from "@/types/project";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const projectMemberService = {
  async list(projectId: number): Promise<ProjectMember[]> {
    const res = await api.get<ApiResponse<ProjectMember[]>>(
      `/api/projects/${projectId}/members`
    );
    return unwrap(res);
  },

  async add(
    projectId: number,
    userId: number,
    role: string
  ): Promise<ProjectMember[]> {
    const res = await api.post<ApiResponse<ProjectMember[]>>(
      `/api/projects/${projectId}/members`,
      { user_id: userId, role }
    );
    return unwrap(res);
  },

  async updateRole(
    projectId: number,
    userId: number,
    role: string
  ): Promise<ProjectMember[]> {
    const res = await api.put<ApiResponse<ProjectMember[]>>(
      `/api/projects/${projectId}/members/${userId}`,
      { role }
    );
    return unwrap(res);
  },

  async remove(projectId: number, userId: number): Promise<ProjectMember[]> {
    const res = await api.delete<ApiResponse<ProjectMember[]>>(
      `/api/projects/${projectId}/members/${userId}`
    );
    return unwrap(res);
  },
};
