import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  // Sync token with localStorage on mount and when token changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken !== token) {
        setToken(storedToken);
      }
    }
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await axios.post("http://localhost:5007/api/auth/google", {
        idToken,
      });

      const jwt = res.data.token || res.data.Token;

      if (jwt) {
        setToken(jwt);
        if (typeof window !== "undefined") {
          localStorage.setItem("token", jwt);
        }
        console.log("Login success, token saved!");
      } else {
        console.error("No token received from server");
        throw new Error("Login failed: No token received");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, loginWithGoogle, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};