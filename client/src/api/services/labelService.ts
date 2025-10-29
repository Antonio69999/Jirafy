import { api } from "@/api/http";
import type { ApiResponse } from "@/types/common";

export interface Label {
  id: number;
  name: string;
  color: string;
  project_id?: number | null;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const labelService = {
  /**
   * Récupérer tous les labels globaux
   */
  async list(): Promise<Label[]> {
    const res = await api.get<ApiResponse<Label[]>>("/api/labels");
    return unwrap(res);
  },

  /**
   * Récupérer les labels disponibles pour un projet (globaux + projet)
   */
  async getByProject(projectId: number): Promise<Label[]> {
    const res = await api.get<ApiResponse<Label[]>>(
      `/api/projects/${projectId}/labels/available`
    );
    return unwrap(res);
  },

  /**
   * Créer un nouveau label
   */
  async create(payload: {
    name: string;
    color: string;
    project_id?: number;
    description?: string;
  }): Promise<Label> {
    const res = await api.post<ApiResponse<Label>>("/api/labels", payload);
    return unwrap(res);
  },

  /**
   * Mettre à jour un label
   */
  async update(
    id: number,
    payload: { name?: string; color?: string; description?: string }
  ): Promise<Label> {
    const res = await api.put<ApiResponse<Label>>(`/api/labels/${id}`, payload);
    return unwrap(res);
  },

  /**
   * Supprimer un label
   */
  async remove(id: number): Promise<void> {
    await api.delete(`/api/labels/${id}`);
  },
};
