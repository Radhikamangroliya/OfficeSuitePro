import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  loginWithGoogle: () => void;
  logout: () => void;
  token: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const loginWithGoogle = () => {
    window.location.href =
      "http://localhost:5007/api/auth/google?redirect_uri=http://localhost:5173/oauth-callback";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        loginWithGoogle,
        logout,
        token,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)!;
}
