import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE → WHITE + Illustration */}
      <div className="flex items-center justify-center bg-white">
        <img
          src="/login-visual.png"
          alt="Login visual"
          className="w-3/4 max-w-lg"
        />
      </div>

      {/* RIGHT SIDE → PASTEL LOGIN FORM */}
      <div className="flex flex-col justify-center items-center bg-[#F7D9BB] px-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Log in</h1>
        <p className="text-gray-700 mb-8">
          Welcome! Sign in to continue.
        </p>

        <GoogleLogin
          shape="pill"
          size="large"
          theme="outline"
          text="signin_with"
          logo_alignment="left"
          width="260"
          onSuccess={async (res) => {
            const idToken = res.credential;
            if (!idToken) return;
            await loginWithGoogle(idToken);
            navigate("/");
          }}
          onError={() => console.log("Google Login Failed")}
        />
      </div>

    </div>
  );
}