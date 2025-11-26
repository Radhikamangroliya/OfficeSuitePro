import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function Login() {
  const { loginWithGoogle, isInitialized, renderGoogleButton } = useAuth();
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [buttonRendered, setButtonRendered] = useState(false);

  useEffect(() => {
    // Auto-trigger OneTap when component mounts and Google is initialized
    if (isInitialized) {
      const timer = setTimeout(() => {
        loginWithGoogle();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, loginWithGoogle]);

  useEffect(() => {
    // Render Google button when container is available and Google is initialized
    if (isInitialized && buttonContainerRef.current && !buttonRendered) {
      renderGoogleButton(buttonContainerRef.current);
      setButtonRendered(true);
    }
  }, [isInitialized, renderGoogleButton, buttonRendered]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-white">
        <img src="/login-visual.png" className="w-3/4 max-w-lg" />
      </div>

      <div className="flex flex-col justify-center items-center bg-[#F7D9BB] px-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Sign in to access your personal OS</p>

          {/* Google Sign-In Button Container - Professional rounded styling */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <div className="flex justify-center">
              <div 
                ref={buttonContainerRef}
                className="[&>div]:rounded-full [&>div]:overflow-hidden [&>div]:shadow-lg [&>div]:transition-all [&>div]:hover:shadow-xl"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
