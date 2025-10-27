import { api } from "@/api/http";
import type { ApiResponse, Paginated } from "@/types/common";
import type {
  Team,
  TeamCreate,
  TeamUpdate,
  TeamListParams,
} from "@/types/team";

const base = "/api/teams";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const teamService = {
  async list(params: TeamListParams = {}): Promise<Paginated<Team>> {
    const res = await api.get<ApiResponse<Paginated<Team>>>(base, { params });
    return unwrap(res);
  },

  async get(id: number): Promise<Team> {
    const res = await api.get<ApiResponse<Team>>(`${base}/${id}`);
    return unwrap(res);
  },

  async getBySlug(slug: string): Promise<Team> {
    const res = await api.get<ApiResponse<Team>>(`${base}/${slug}`);
    return unwrap(res);
  },

  async create(payload: TeamCreate): Promise<Team> {
    const body = { ...payload, slug: payload.slug.trim().toLowerCase() };
    const res = await api.post<ApiResponse<Team>>(base, body);
    return unwrap(res);
  },

  async update(id: number, payload: TeamUpdate): Promise<Team> {
    const body = payload.slug
      ? { ...payload, slug: payload.slug.trim().toLowerCase() }
      : payload;
    const res = await api.put<ApiResponse<Team>>(`${base}/${id}`, body);
    return unwrap(res);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`${base}/${id}`);
  },

  async addMember(teamId: number, userId: number, role: string): Promise<Team> {
    const res = await api.post<ApiResponse<Team>>(`${base}/${teamId}/members`, {
      user_id: userId,
      role,
    });
    return unwrap(res);
  },

  async removeMember(teamId: number, userId: number): Promise<Team> {
    const res = await api.delete<ApiResponse<Team>>(
      `${base}/${teamId}/members/${userId}`
    );
    return unwrap(res);
  },

  async updateMemberRole(
    teamId: number,
    userId: number,
    role: string
  ): Promise<Team> {
    const res = await api.put<ApiResponse<Team>>(
      `${base}/${teamId}/members/${userId}`,
      { role }
    );
    return unwrap(res);
  },
};
