import { api } from "@/api/http";
import type { RegisterData, AuthResponse, ApiResponse } from "@/types/auth";

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      {
        email,
        password,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/auth/logout");
  },

  async refresh(): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/refresh"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Refresh failed");
    }

    return response.data.data;
  },

  async me(): Promise<AuthResponse> {
    const response = await api.get<ApiResponse<AuthResponse>>("/api/auth/me");

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to get user info");
    }

    return response.data.data;
  },
};
