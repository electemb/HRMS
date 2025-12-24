import axios from "axios";

// Read API base URL from environment variable (Vite uses import.meta.env)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5187/api";

// Create a separate axios instance for auth to avoid circular imports
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    roles: string[];
    [key: string]: unknown;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await authApi.post("/auth/login", { email, password });
  return res.data;
};

export const refresh = async (refreshToken: string): Promise<AuthResponse> => {
  const res = await authApi.post("/auth/refresh", { refreshToken });
  return res.data;
};

export const logout = async () => {
  await authApi.post("/auth/logout");
};
