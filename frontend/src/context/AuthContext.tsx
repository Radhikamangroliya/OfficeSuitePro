import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  isInitialized: boolean;
  googleIdToken: string | null;
  renderGoogleButton: (container: HTMLDivElement) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleLogin = useCallback(async (response: any) => {
    try {
      // Extract Google ID Token from response.credential
      const idToken = response.credential;
      
      // Log the Google ID Token for debugging
      console.log("Google ID Token:", idToken);
      console.log("Token starts with:", idToken.substring(0, 20));
      
      // Store in context
      setGoogleIdToken(idToken);

      // Immediately send to backend
      console.log("Sending Google ID Token to backend...");
      const apiResponse = await axios.post(
        "http://localhost:5007/api/auth/google/token",
        { IdToken: idToken },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Backend response:", apiResponse.data);
      console.log("Backend response keys:", Object.keys(apiResponse.data || {}));
      
      // Backend returns Token with capital T (PropertyNamingPolicy = null)
      const jwt = apiResponse.data?.Token || apiResponse.data?.token;
      
      if (jwt) {
        // Save the returned backend JWT in localStorage
        localStorage.setItem("token", jwt);
        setToken(jwt);
        console.log("Backend JWT saved, redirecting to dashboard...");
        window.location.href = "/dashboard";
      } else {
        console.error("No token found in response. Full response:", apiResponse.data);
        throw new Error("No token in response");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      console.error("Error details:", error.response?.data);
      alert(
        error.response?.data?.message || 
        error.message || 
        "Failed to authenticate. Please try again."
      );
    }
  }, []);

  useEffect(() => {
    // Wait for Google Identity Services script to load
    const checkGoogle = setInterval(() => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        clearInterval(checkGoogle);
        setIsInitialized(true);
        
        // Initialize Google Identity Services
        google.accounts.id.initialize({
          client_id: "115603689230-lngpjjblc3ed01vlcf994l2v3dv14l99.apps.googleusercontent.com",
          callback: handleLogin,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, [handleLogin]);

  const loginWithGoogle = () => {
    const google = (window as any).google;

    if (!google?.accounts?.id) {
      alert("Google Identity Services not loaded. Please refresh the page.");
      return;
    }

    // Trigger Google OneTap prompt
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
        console.log("OneTap not available, user can click the button");
      }
    });
  };

  const renderGoogleButton = (container: HTMLDivElement) => {
    const google = (window as any).google;
    if (google?.accounts?.id && container) {
      google.accounts.id.renderButton(
        container,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          width: 320,
          shape: "pill"
        }
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loginWithGoogle,
        logout,
        isInitialized,
        googleIdToken,
        renderGoogleButton,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
