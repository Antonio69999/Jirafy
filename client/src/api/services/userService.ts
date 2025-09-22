import { api } from "@/api/http";
import type { ApiResponse } from "@/types/common";
import type { User } from "@/types/auth";

const base = "/api/users";

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  if (!res.data?.success || typeof res.data.data === "undefined") {
    throw new Error(res.data?.message || "API error");
  }
  return res.data.data;
}

export const userService = {
  async list(): Promise<User[]> {
    const res = await api.get<ApiResponse<User[]>>(base);
    return unwrap(res);
  },
};
