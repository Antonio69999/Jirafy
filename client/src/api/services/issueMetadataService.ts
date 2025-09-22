import { api } from "@/api/http";
import type { ApiResponse } from "@/types/common";

interface IssueType {
  id: number;
  key: string;
  name: string;
}

interface IssueStatus {
  id: number;
  key: string;
  name: string;
  category: string;
}

interface IssuePriority {
  id: number;
  key: string;
  name: string;
  weight: number;
}

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const issueMetadataService = {
  async getTypes(): Promise<IssueType[]> {
    const res = await api.get<ApiResponse<IssueType[]>>("/api/issue-types");
    return unwrap(res);
  },

  async getStatuses(): Promise<IssueStatus[]> {
    const res = await api.get<ApiResponse<IssueStatus[]>>("/api/statuses");
    return unwrap(res);
  },

  async getPriorities(): Promise<IssuePriority[]> {
    const res = await api.get<ApiResponse<IssuePriority[]>>("/api/priorities");
    return unwrap(res);
  },
};