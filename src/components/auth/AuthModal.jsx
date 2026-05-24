import { useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function AuthModal({ open, setOpen }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="glass w-[95%] md:w-[450px] rounded-3xl p-8 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition"
        >
          <X size={22} />
        </button>

        <div className="flex justify-between mb-8">
          <button
            className={`px-5 py-2 rounded-xl ${isLogin ? "bg-purple-600" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={`px-5 py-2 rounded-xl ${!isLogin ? "bg-cyan-600" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        {isLogin ? (
          <LoginForm setOpen={setOpen} />
        ) : (
          <SignupForm setOpen={setOpen} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;