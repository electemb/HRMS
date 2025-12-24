import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { login as apiLogin, logout as apiLogout } from "../api/auth";
import type { AuthResponse } from "../api/auth";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  roles: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    // Optionally, load tokens from localStorage/sessionStorage
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setAccessToken(parsed.accessToken);
      setRefreshToken(parsed.refreshToken);
      // Support both `user.roles` (string[]) and `user.role` (string)
      const loadedRoles: string[] = parsed.user?.roles
        ? parsed.user.roles
        : parsed.user?.role
        ? [parsed.user.role]
        : [];
      setRoles(loadedRoles);
    }
  }, []);

  useEffect(() => {
    if (accessToken && refreshToken && user) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ user, accessToken, refreshToken })
      );
    } else {
      localStorage.removeItem("auth");
    }
  }, [user, accessToken, refreshToken]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setUser(res.user);
    setAccessToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    // Normalize roles from API response
    const newRoles: string[] = (res.user as any)?.roles
      ? (res.user as any).roles
      : (res.user as any)?.role
      ? [(res.user as any).role]
      : [];
    setRoles(newRoles);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRoles([]);
    apiLogout();
    localStorage.removeItem("auth");
  };

  // Optionally, implement refresh logic here

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        roles,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
