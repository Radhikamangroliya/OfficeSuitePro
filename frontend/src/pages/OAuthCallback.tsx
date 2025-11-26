import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const code = params.get("code");

    console.log("OAuth Callback - Token:", token ? "Present" : "Missing");
    console.log("OAuth Callback - Code:", code ? "Present" : "Missing");
    console.log("OAuth Callback - Error:", error);

    if (error) {
      setStatus(`Error: ${error}`);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (token) {
      console.log("Saving token to localStorage...");
      localStorage.setItem("token", token);
      setStatus("Success! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 500);
    } else if (code) {
      // If we receive a code, redirect to backend to exchange it
      setStatus("Exchanging code for token...");
      window.location.href = `http://localhost:5007/api/auth/google/callback?code=${encodeURIComponent(code)}`;
    } else {
      setStatus("No token received. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7D9BB]">
      <div className="text-center">
        <p className="text-xl font-semibold">{status}</p>
      </div>
    </div>
  );
}
