import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-white">
        <img src="/login-visual.png" className="w-3/4 max-w-lg" />
      </div>

      <div className="flex flex-col justify-center items-center bg-[#F7D9BB] px-10">
        <h1 className="text-3xl font-bold mb-4">Log in</h1>

        <button
          onClick={loginWithGoogle}
          className="bg-white shadow-lg px-6 py-3 rounded-full font-semibold"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
