import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Keep token + user synced
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedToken !== token) setToken(storedToken);
    if (storedUser && !user) setUser(JSON.parse(storedUser));
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await axios.post("http://localhost:5007/api/auth/google", {
        IdToken: idToken, // ⭐ MUST BE CAPITAL 'I' — backend expects it
      });

      const jwt = res.data.token || res.data.Token;
      const userData = res.data.User || res.data.user;

      if (!jwt) throw new Error("No token received");

      // Save token
      setToken(jwt);
      localStorage.setItem("token", jwt);

      // Save user
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      console.log("Login success! Token + User saved.");
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loginWithGoogle,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
