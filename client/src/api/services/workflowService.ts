import { api } from "@/api/http";
import type { ApiResponse } from "@/types/common";

export interface WorkflowTransition {
  id: number;
  project_id: number;
  from_status_id: number;
  to_status_id: number;
  name: string;
  description?: string;
  fromStatus?: {
    id: number;
    key: string;
    name: string;
    category: string;
  };
  toStatus?: {
    id: number;
    key: string;
    name: string;
    category: string;
  };
}

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const workflowService = {
  /**
   * Récupérer les transitions d'un projet
   */
  async getProjectTransitions(
    projectId: number
  ): Promise<WorkflowTransition[]> {
    const res = await api.get<ApiResponse<WorkflowTransition[]>>(
      `/api/projects/${projectId}/workflow/transitions`
    );
    return unwrap(res);
  },

  /**
   * Créer une transition
   */
  async createTransition(data: {
    project_id: number;
    from_status_id: number;
    to_status_id: number;
    name: string;
    description?: string;
  }): Promise<WorkflowTransition> {
    const res = await api.post<ApiResponse<WorkflowTransition>>(
      "/api/workflow/transitions",
      data
    );
    return unwrap(res);
  },

  /**
   * Supprimer une transition
   */
  async deleteTransition(id: number): Promise<void> {
    await api.delete(`/api/workflow/transitions/${id}`);
  },

  /**
   * Récupérer les transitions disponibles pour une issue
   */
  async getAvailableTransitions(
    issueId: number
  ): Promise<WorkflowTransition[]> {
    const res = await api.get<ApiResponse<WorkflowTransition[]>>(
      `/api/issues/${issueId}/transitions`
    );
    return unwrap(res);
  },

  /**
   * Effectuer une transition sur une issue
   */
  async performTransition(issueId: number, transitionId: number): Promise<any> {
    const res = await api.post<ApiResponse<any>>(
      `/api/issues/${issueId}/transition`,
      { transition_id: transitionId }
    );
    return unwrap(res);
  },
};
