export interface RegisterData {
  name?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: "super_admin" | "admin" | "user";
  teams?: {
    id: number;
    name: string;
    pivot: {
      role: "owner" | "admin" | "member";
    };
  }[];
  avatar?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
